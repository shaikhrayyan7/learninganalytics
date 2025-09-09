from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from config.db import db

programs_bp = Blueprint("programs_bp", __name__)

@programs_bp.route("/api/programs", methods=["GET"])
def get_all_programs():
    programs = list(db.programs.find(
        {}, 
        {"_id": 1, "id": 1, "name": 1, "type": 1, "duration": 1, "semesters": 1, "specializations": 1}
    ))
    for p in programs:
        p["_id"] = str(p["_id"])
    return jsonify(programs)

@programs_bp.route("/api/programs/<program_id>", methods=["GET"])
def get_program_by_id(program_id):
    program = db.programs.find_one({"id": program_id})
    if not program:
        return jsonify({"error": "Program not found"}), 404
    program["_id"] = str(program["_id"])
    return jsonify(program)

@programs_bp.route("/api/programs/<program_id>/courses", methods=["GET"])
def get_courses_for_program(program_id):
    semesters = list(db.courses.find({"programId": program_id}).sort("semester", 1))
    for sem in semesters:
        sem["_id"] = str(sem["_id"])
    return jsonify(semesters)

@programs_bp.route("/api/programs/<program_id>/courses", methods=["POST"])
def add_course(program_id):
    data = request.json
    if not data.get("title"):
        return jsonify({"error": "Course title required"}), 400

    course_doc = {
        "programId": program_id,
        "semester": data.get("semester", 1),
        "courses": [{
            "id": data.get("id") or str(ObjectId())[:8],
            "title": data["title"],
            "creditPoints": data.get("creditPoints", 0),
            "type": data.get("type", "core"),
            "specialization": data.get("specialization"),
            "instructors": data.get("instructors", []),
            "students": data.get("students", [])
        }]
    }

    existing = db.courses.find_one({"programId": program_id, "semester": course_doc["semester"]})
    if existing:
        db.courses.update_one(
            {"_id": existing["_id"]},
            {"$push": {"courses": course_doc["courses"][0]}}
        )
    else:
        db.courses.insert_one(course_doc)

    return jsonify({"message": "Course added", "course": course_doc["courses"][0]})

@programs_bp.route("/api/programs/<program_id>/courses/<course_id>", methods=["PUT"])
def update_course(program_id, course_id):
    data = request.json
    update_fields = {}
    if "title" in data:
        update_fields["courses.$.title"] = data["title"]
    if "creditPoints" in data:
        update_fields["courses.$.creditPoints"] = data["creditPoints"]
    if "type" in data:
        update_fields["courses.$.type"] = data["type"]
    if "specialization" in data:
        update_fields["courses.$.specialization"] = data["specialization"]
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

@programs_bp.route("/api/programs/<program_id>/courses/<course_id>", methods=["DELETE"])
def delete_course(program_id, course_id):
    result = db.courses.update_one(
        {"programId": program_id},
        {"$pull": {"courses": {"id": course_id}}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "Course not found"}), 404

    return jsonify({"message": "Course deleted"})
