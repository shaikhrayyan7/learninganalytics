from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

users_bp = Blueprint('users_bp', __name__, url_prefix='/api/users')

client = MongoClient("mongodb://localhost:27017/")
db = client["learning_analytics"]
users_col = db["users"]

def normalize_user(user):
    """Convert DB user schema → FE schema with 'N/A' defaults"""
    return {
        "_id": str(user["_id"]),
        "firstName": user.get("firstName", "N/A"),
        "lastName": user.get("lastName", "N/A"),
        "email": user.get("email", "N/A"),
        "role": user.get("role", "N/A").capitalize(),
        "program": user.get("program", "N/A"),
        "matriculationNumber": user.get("matriculationNumber", "N/A"),
        "number": user.get("number", "N/A"),
        "dob": user.get("dob", "N/A"),
        "address": user.get("address", "N/A"),
        "department": user.get("department", "N/A"),
        "intake": user.get("intake", "N/A"),
        "office": user.get("office", "N/A")
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
