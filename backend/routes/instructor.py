from flask import Blueprint, request, jsonify
from config.db import db

instructor_bp = Blueprint('instructor', __name__)
instructors = db["instructors"]

@instructor_bp.route('/', methods=['GET'])
def get_instructors():
    result = list(instructors.find({}, {"_id": 0}))
    return jsonify(result)

@instructor_bp.route('/', methods=['POST'])
def add_instructor():
    data = request.get_json()
    instructors.insert_one(data)
    return jsonify({"message": "Instructor added"}), 201
