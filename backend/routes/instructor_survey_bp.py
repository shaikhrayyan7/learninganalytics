from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import random
from datetime import datetime

instructor_survey_bp = Blueprint('instructor_survey_bp', __name__, url_prefix='/api/instructor/survey')

client = MongoClient("mongodb://localhost:27017/")
db = client["learning_analytics"]

survey_col = db["survey_questions"]  # Question bank
assigned_col = db["assigned_surveys"] # Assigned surveys to students

# Pick random questions per category
def pick_random_questions(category, count=5):
    questions = list(survey_col.find({"category": category}, {"_id": 1, "question": 1, "options": 1}))
    for q in questions:
        q["_id"] = str(q["_id"])
        q["text"] = q.pop("question")  # rename for frontend
    return random.sample(questions, min(count, len(questions)))

# GET: fetch questions by category
@instructor_survey_bp.route("/questions", methods=["GET"])
def get_questions():
    category = request.args.get("category")
    count = int(request.args.get("count", 5))
    if not category:
        return jsonify({"error": "category is required"}), 400

    questions = pick_random_questions(category, count)
    return jsonify(questions), 200

# POST: create and assign a survey
@instructor_survey_bp.route("/create", methods=["POST"])
def create_survey():
    data = request.json
    course = data.get("course")
    start_date = data.get("week", {}).get("from")
    end_date = data.get("week", {}).get("to")
    week_label = data.get("week", {}).get("label", "")
    student_emails = data.get("students", [])
    questions = data.get("questions", {})

    if not course or not start_date or not end_date or not student_emails:
        return jsonify({"error": "course, startDate, endDate, and students are required"}), 400

    start_date = datetime.fromisoformat(start_date) if isinstance(start_date, str) else start_date
    end_date = datetime.fromisoformat(end_date) if isinstance(end_date, str) else end_date

    assigned_surveys = []
    for email in student_emails:
        doc = {
            "studentEmail": email,
            "course": course,
            "startDate": start_date,
            "endDate": end_date,
            "label": week_label,
            "questions": questions,
            "submitted": False,
            "responses": {}
        }
        result = assigned_col.insert_one(doc)
        assigned_surveys.append(str(result.inserted_id))

    return jsonify({"message": "Survey assigned", "assignedIds": assigned_surveys}), 201
