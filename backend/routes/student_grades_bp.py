# routes/student_grades_bp.py
from flask import Blueprint, jsonify
from config.db import db
from bson import ObjectId

student_grades_bp = Blueprint("student_grades", __name__)

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

@student_grades_bp.route("/api/student/<email>/grades", methods=["GET"])
def get_student_grades(email):
    # 1. Find student
    student = db.users.find_one({"email": email.lower()})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    program_id = student.get("programId", "acs")  # fallback for John
    specialization = student.get("specialization")  # e.g. "AI", "DS"

    # 2. Fetch all courses for this program
    courses_docs = db.courses.find({"programId": program_id}).sort("semester", 1)
    all_courses = []
    for doc in courses_docs:
        semester = doc["semester"]
        for course in doc["courses"]:
            # keep course if it's core OR matches specialization
            if (
                not specialization
                or course.get("specialization") is None
                or course.get("specialization") == specialization
            ):
                all_courses.append({
                    "semester": semester,
                    "id": course["id"],
                    "title": course["title"],
                    "creditPoints": course["creditPoints"],
                    "type": course["type"],
                    "specialization": course.get("specialization")
                })

    # 3. Fetch student grades
    grades_doc = db.grades.find_one({"studentEmail": email.lower()}) or {}
    student_grades = {g["courseId"]: g for g in grades_doc.get("grades", [])}

    # 4. Merge grades with courses
    merged = []
    for course in all_courses:
        grade_info = student_grades.get(course["id"], {})
        accounted_credits = course["creditPoints"] if grade_info.get("status") == "Passed" else None
        merged.append({
            "semester": course["semester"],
            "courseId": course["id"],
            "title": course["title"],
            "credits": course["creditPoints"],
            "grade": grade_info.get("grade"),
            "status": grade_info.get("status"),
            "accountedCredits": accounted_credits
        })

    # 5. Convert ObjectId for safety
    return jsonify(convert_objectid(merged))

@student_grades_bp.route("/api/student/<email>/grades", methods=["POST"])
def add_student_grades(email):
    from flask import request

    # Read JSON from request body
    data = request.get_json()
    if not data or "grades" not in data:
        return jsonify({"error": "Missing grades data"}), 400

    # Upsert: insert or update
    db.grades.update_one(
        {"studentEmail": email.lower()},
        {"$set": {"grades": data["grades"]}},
        upsert=True
    )
    return jsonify({"message": f"Grades for {email} added/updated successfully"}), 200

