from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from config.db import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"].lower()
    password = generate_password_hash(data["password"])
    role = data.get("role", "student")  # default to student if not provided

    if db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    db.users.insert_one({
        "email": email,
        "password": password,
        "role": role
    })
    return jsonify({"message": "User registered"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"].lower()
    password = data["password"]

    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "email": user["email"],
        "role": user["role"]
    }), 200
