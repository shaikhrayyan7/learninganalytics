from flask import Blueprint, jsonify, request
from config.db import db

student_list_bp = Blueprint("student_list_bp", __name__)

# ✅ Get all courses taught by an instructor (id + title)
@student_list_bp.route("/api/studentlist/<email>/courses", methods=["GET"])
def get_instructor_courses(email):
    email = email.lower()
    course_docs = db.courses.find({"courses.instructors": email})

    courses = []
    for doc in course_docs:
        for course in doc["courses"]:
            if email in course.get("instructors", []):
                courses.append({
                    "id": course["id"],
                    "title": course["title"]
                })
    return jsonify(courses)


# ✅ Get students in a course (basic: email)
@student_list_bp.route("/api/studentlist/course/<course_id>/students", methods=["GET"])
def get_course_students(course_id):
    # Find course by id
    course_doc = db.courses.find_one({"courses.id": course_id}, {"courses.$": 1})
    if not course_doc or "courses" not in course_doc:
        return jsonify({"error": "Course not found"}), 404

    course = course_doc["courses"][0]
    student_emails = course.get("students", [])

    # Optional: pull full student info from users collection
    students = []
    if student_emails:
        users = db.users.find({"email": {"$in": student_emails}}, {"firstName": 1, "lastName": 1, "email": 1, "matriculationNumber": 1})
        for u in users:
            students.append({
                "firstName": u.get("firstName"),
                "lastName": u.get("lastName"),
                "email": u.get("email"),
                "matriculation": u.get("matriculationNumber")
            })

    return jsonify(students)
