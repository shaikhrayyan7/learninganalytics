from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

users_bp = Blueprint('users_bp', __name__, url_prefix='/api/users')

client = MongoClient("mongodb://localhost:27017/")
db = client["learning_analytics"]  # Correct DB
users_col = db["users"]             # Your collection


def normalize_user(user):
    """Convert DB user schema → FE schema"""
    return {
        "_id": str(user["_id"]),
        "firstName": user.get("firstName", ""),
        "lastName": user.get("lastName", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "").capitalize(),  # student → Student
        "program": user.get("program") or user.get("course", ""),
        "matricNo": user.get("matricNo") or user.get("matriculationNumber", ""),
        "phone": user.get("phone") or user.get("number", ""),
        "dob": user.get("dob", ""),
        "address": user.get("address", ""),
        "department": user.get("department", ""),
        "intake": user.get("intake", "")
    }


# GET all users
@users_bp.route("/", methods=["GET"])
def get_users():
    users = list(users_col.find({}))
    return jsonify([normalize_user(u) for u in users])


# GET user by ID
@users_bp.route("/<id>", methods=["GET"])
def get_user(id):
    user = users_col.find_one({"_id": ObjectId(id)})
    if user:
        return jsonify(normalize_user(user))
    return jsonify({"error": "User not found"}), 404


# POST new user
@users_bp.route("/", methods=["POST"])
def add_user():
    data = request.json

    # store lowercase role for consistency
    data["role"] = data.get("role", "").lower()

    result = users_col.insert_one(data)
    new_user = users_col.find_one({"_id": result.inserted_id})
    return jsonify(normalize_user(new_user)), 201


# PUT update user
@users_bp.route("/<id>", methods=["PUT"])
def update_user(id):
    data = request.json
    if "role" in data:
        data["role"] = data["role"].lower()

    users_col.update_one({"_id": ObjectId(id)}, {"$set": data})
    updated_user = users_col.find_one({"_id": ObjectId(id)})
    return jsonify(normalize_user(updated_user))


# DELETE user
@users_bp.route("/<id>", methods=["DELETE"])
def delete_user(id):
    result = users_col.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404
