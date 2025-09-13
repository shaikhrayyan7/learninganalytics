from flask import Blueprint, request, jsonify
from config.db import db

send_recommendations_bp = Blueprint("send_recommendations", __name__)

# --- Get courses and students for instructor ---
@send_recommendations_bp.route("/instructor/<email>/courses", methods=["GET"])
def get_courses(email):
    email = email.lower()
    semesters = db.courses.find({"courses.instructors": email}, {"_id": 0, "courses": 1})
    
    result = {}
    for sem in semesters:
        for course in sem.get("courses", []):
            if email in course.get("instructors", []):
                result[course["title"]] = course.get("students", [])
    
    if not result:
        return jsonify({"error": "Instructor not found or no courses"}), 404
    
    return jsonify(result), 200

# --- Send personal recommendation ---
@send_recommendations_bp.route("/instructor/personal", methods=["POST"])
def send_personal_recommendation():
    data = request.json
    student_email = data.get("student")
    message = data.get("message")
    instructor_email = data.get("instructor")
    category = data.get("category", "Study Tips")

    if not all([student_email, message, instructor_email]):
        return jsonify({"error": "Missing fields"}), 400

    # Store message with instructor info
    db.recommendations.update_one(
        {"type": "personalized", "studentEmail": student_email},
        {"$push": {f"recommendations.{category}": {"message": message, "instructor": instructor_email}}},
        upsert=True
    )

    return jsonify({"message": f"Recommendation sent to {student_email} in '{category}'"}), 201

# --- Send class-wide recommendation ---
@send_recommendations_bp.route("/instructor/class", methods=["POST"])
def send_class_recommendation():
    data = request.json
    message = data.get("message")
    instructor_email = data.get("instructor")
    category = data.get("category", "Study Tips")

    if not all([message, instructor_email]):
        return jsonify({"error": "Missing fields"}), 400

    # Store message with instructor info
    db.recommendations.update_one(
        {"type": "classWide"},
        {"$push": {f"recommendations.{category}": {"message": message, "instructor": instructor_email}}},
        upsert=True
    )

    return jsonify({"message": f"Class-wide recommendation sent in '{category}'"}), 201
