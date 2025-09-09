from flask import Blueprint, request, jsonify
import bcrypt
from config.db import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"].lower()
    password = data["password"].encode("utf-8")  # convert to bytes
    role = data.get("role", "student")

    if db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())  # bcrypt hash

    db.users.insert_one({
        "email": email,
        "password": hashed_password.decode("utf-8"),  # store as string in MongoDB
        "role": role
    })
    return jsonify({"message": "User registered"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"].lower()
    password = data["password"].encode("utf-8")  # convert to bytes

    user = db.users.find_one({"email": email})
    if not user or not bcrypt.checkpw(password, user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "email": user["email"],
        "role": user["role"]
    }), 200
