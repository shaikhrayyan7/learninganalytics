from flask import Blueprint, jsonify

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/dashboard")
def dashboard():
    return jsonify({"message": "Admin Dashboard"})
