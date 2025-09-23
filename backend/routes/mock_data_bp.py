# routes/mock_data_bp.py
from flask import Blueprint, jsonify
from pymongo import MongoClient
from app_config import MONGO_URI
from encryption_utils import encrypt_data

mock_data_bp = Blueprint("mock_data_bp", __name__, url_prefix="/api/mock")

client = MongoClient(MONGO_URI)
db = client["learning_analytics"]
assigned_col = db["assigned_surveys"]

@mock_data_bp.route("/add/<email>", methods=["POST"])
def add_mock_surveys(email):
    from flask import request

    data = request.get_json()
    if not data or "surveys" not in data:
        return jsonify({"error": "Missing surveys data"}), 400

    for s in data["surveys"]:
        assigned_col.insert_one({
            "studentEmail": email,
            "submitted": True,
            "label": s["label"],
            "responses": encrypt_data(s["responses"])
        })

    return jsonify({"message": "Mock surveys added"}), 201

