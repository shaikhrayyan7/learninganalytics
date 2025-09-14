from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from app_config import SECRET_KEY, MONGO_URI
from encryption_utils import encrypt_data, decrypt_data

student_survey_bp = Blueprint("student_survey_bp", __name__, url_prefix="/api/student")

client = MongoClient(MONGO_URI)
db = client["learning_analytics"]
assigned_col = db["assigned_surveys"]

# GET: fetch assigned surveys for a student
@student_survey_bp.route("/assigned/<email>", methods=["GET"])
def get_assigned_surveys(email):
    surveys = list(assigned_col.find({"studentEmail": email, "submitted": False}))
    for s in surveys:
        s["_id"] = str(s["_id"])
        for cat, qs in s["questions"].items():
            for q in qs:
                q["_id"] = str(q["_id"])
    return jsonify(surveys), 200

# POST: submit survey responses (encrypted)
@student_survey_bp.route("/submit/<survey_id>", methods=["POST"])
def submit_survey(survey_id):
    data = request.json  # { responses: {...} }
    encrypted_responses = encrypt_data(data["responses"])  # encrypt before saving
    assigned_col.update_one(
        {"_id": ObjectId(survey_id)},
        {"$set": {"responses": encrypted_responses, "submitted": True}}
    )
    return jsonify({"message": "Survey submitted successfully"}), 200

# Optional: fetch encrypted responses and decrypt for student analytics
@student_survey_bp.route("/responses/<survey_id>", methods=["GET"])
def get_responses(survey_id):
    survey = assigned_col.find_one({"_id": ObjectId(survey_id)})
    if not survey or "responses" not in survey:
        return jsonify({"error": "No responses found"}), 404
    decrypted = decrypt_data(survey["responses"])
    return jsonify(decrypted), 200
