from flask import Blueprint, jsonify, request
from config.db import db

student_courses_bp = Blueprint("student_courses", __name__)

# ✅ Get courses for a student
@student_courses_bp.route("/api/student/<email>/courses", methods=["GET"])
def get_student_courses(email):
    # 1. Find student
    student = db.users.find_one({"email": email.lower()})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # 2. Find program details
    program_name = student.get("program")
    program = db.programs.find_one({"name": program_name})
    if not program:
        return jsonify({"error": "Program not found"}), 404

    program_id = program["id"]

    # 3. Get semester from query params, fallback to student's currentSemester
    semester = request.args.get("semester")
    if semester:
        semester = int(semester)
    else:
        semester = int(student.get("currentSemester", 1))

    # 4. Fetch courses for program + semester
    course_doc = db.courses.find_one({"programId": program_id, "semester": semester})
    if not course_doc:
        return jsonify([])

    specialization = student.get("specialization")
    courses = []

    for course in course_doc["courses"]:
        if course["type"] == "core":
            courses.append(course)
        elif course["type"] == "elective":
            if program_id == "acs" and specialization:
                if course.get("specialization") == specialization:
                    courses.append(course)

    return jsonify(courses)


# ✅ Get details of a single course
@student_courses_bp.route("/api/courses/<course_id>", methods=["GET"])
def get_course_details(course_id):
    course = db.courses.find_one({"courses.id": course_id}, {"courses.$": 1})
    if not course or "courses" not in course:
        return jsonify({"error": "Course not found"}), 404

    course_data = course["courses"][0]
    return jsonify(course_data)


# ✅ NEW: Get program details (for FE semester filter)
@student_courses_bp.route("/api/program/<program_name>", methods=["GET"])
def get_program(program_name):
    program = db.programs.find_one({"name": program_name})
    if not program:
        return jsonify({"error": "Program not found"}), 404

    program["_id"] = str(program["_id"])  # Convert ObjectId
    return jsonify(program)
