from flask import Blueprint, request, jsonify
from config.db import db

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/<email>", methods=["GET"])
def get_profile(email):
    email = email.lower()
    user = db.users.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200

@profile_bp.route("/<email>", methods=["PUT"])
def update_profile(email):
    email = email.lower()
    data = request.json

    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    allowed_fields = [
        "firstName", "lastName", "matriculationNumber", "number", "dob",
        "address", "program", "department", "intake", "office", "specialization"
    ]
    update_data = {field: data[field] for field in allowed_fields if field in data}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    db.users.update_one({"email": email}, {"$set": update_data})
    updated_user = db.users.find_one({"email": email}, {"_id": 0, "password": 0})
    return jsonify(updated_user), 200
