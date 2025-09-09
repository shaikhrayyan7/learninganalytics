from flask import Blueprint, request, jsonify
from config.db import db
from bson import ObjectId
from datetime import datetime

student_privacy_bp = Blueprint("student_privacy", __name__)

def convert_objectid(doc):
    """Recursively convert ObjectId to string in dict/list"""
    if isinstance(doc, list):
        return [convert_objectid(d) for d in doc]
    elif isinstance(doc, dict):
        return {k: convert_objectid(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc

@student_privacy_bp.route("/api/student/<email>/privacy", methods=["GET"])
def get_privacy(email):
    student = db.users.find_one({"email": email.lower()})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # Get privacy array or default values
    privacy = student.get("privacy", [
        {"type": "analytics", "value": True, "updatedAt": None},
        {"type": "research", "value": False, "updatedAt": None},
        {"type": "consent", "value": True, "updatedAt": None}
    ])
    return jsonify(convert_objectid(privacy))


@student_privacy_bp.route("/api/student/<email>/privacy", methods=["PUT"])
def update_privacy(email):
    student = db.users.find_one({"email": email.lower()})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.json
    if not isinstance(data, list):
        return jsonify({"error": "Invalid data format, expected array"}), 400

    # Add updatedAt timestamp
    for item in data:
        item["updatedAt"] = datetime.utcnow()

    db.users.update_one({"email": email.lower()}, {"$set": {"privacy": data}})
    return jsonify({"message": "Privacy preferences updated successfully"})
