from flask import Blueprint, jsonify, request
from config.db import db

instructor_courses_bp = Blueprint("instructor_courses_bp", __name__)

# ✅ Get courses taught by an instructor
@instructor_courses_bp.route("/api/instructor/<email>/courses", methods=["GET"])
def get_instructor_courses(email):
    email = email.lower()
    # Find all course documents containing this instructor
    course_docs = db.courses.find({"courses.instructors": email})

    result = {}
    for doc in course_docs:
        for course in doc["courses"]:
            if email in course.get("instructors", []):
                # key = course title, value = id + students
                result[course["title"]] = {
                    "id": course["id"],
                    "students": course.get("students", [])
                }

    return jsonify(result)


# ✅ Get a single course by course ID
@instructor_courses_bp.route("/api/courses/<course_id>", methods=["GET"])
def get_course(course_id):
    course_doc = db.courses.find_one({"courses.id": course_id}, {"courses.$": 1})
    if not course_doc or "courses" not in course_doc:
        return jsonify({"error": "Course not found"}), 404

    return jsonify(course_doc["courses"][0])

@instructor_courses_bp.route("/api/courses/<course_id>", methods=["PATCH"])
def update_course_tab(course_id):
    data = request.json
    tab = data.get("tab")
    content = data.get("content")

    # For now, store content in a "tabs" subfield in the course document
    course_doc = db.courses.find_one({"courses.id": course_id})
    if not course_doc:
        return jsonify({"error": "Course not found"}), 404

    for course in course_doc["courses"]:
        if course["id"] == course_id:
            if "tabs" not in course:
                course["tabs"] = {}
            course["tabs"][tab] = content
            break

    db.courses.update_one(
        {"_id": course_doc["_id"]},
        {"$set": {"courses": course_doc["courses"]}}
    )

    return jsonify({"success": True})
