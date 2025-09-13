from flask import Blueprint, request, jsonify
from config.db import db

course_management_bp = Blueprint("course_management_bp", __name__)

# GET a single course by program_id and course_id
@course_management_bp.route("/api/programs/<program_id>/courses/<course_id>", methods=["GET"])
def get_course(program_id, course_id):
    semesters = list(db.courses.find({"programId": program_id}))
    for sem in semesters:
        for course in sem["courses"]:
            if course["id"] == course_id:
                course["_id"] = str(sem["_id"])
                return jsonify(course)
    return jsonify({"error": "Course not found"}), 404

# PUT to update instructors/students
@course_management_bp.route("/api/programs/<program_id>/courses/<course_id>", methods=["PUT"])
def update_course_members(program_id, course_id):
    data = request.json
    update_fields = {}

    if "instructors" in data:
        update_fields["courses.$.instructors"] = data["instructors"]
    if "students" in data:
        update_fields["courses.$.students"] = data["students"]

    result = db.courses.update_one(
        {"programId": program_id, "courses.id": course_id},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Course not found"}), 404

    return jsonify({"message": "Course updated"})
