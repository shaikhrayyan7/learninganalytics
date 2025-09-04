from flask import Blueprint, request, jsonify
from config.db import db

student_bp = Blueprint('student', __name__)
students = db["students"]

@student_bp.route('/', methods=['GET'])
def get_students():
    result = list(students.find({}, {"_id": 0}))
    return jsonify(result)

@student_bp.route('/', methods=['POST'])
def add_student():
    data = request.get_json()
    students.insert_one(data)
    return jsonify({"message": "Student added"}), 201
