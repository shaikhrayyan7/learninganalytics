from flask import Blueprint, jsonify
from config.db import db

recommendations_bp = Blueprint("recommendations", __name__)

@recommendations_bp.route("/api/student/<email>/recommendations", methods=["GET"])
def get_student_recommendations(email):
    email = email.lower()

    # Fetch class-wide recommendations
    classwide_doc = db.recommendations.find_one({"type": "classWide"})
    classwide_recs = classwide_doc.get("recommendations", {}) if classwide_doc else {}

    # Fetch personalized recommendations for this student
    student_doc = db.recommendations.find_one({"type": "personalized", "studentEmail": email})
    student_recs = student_doc.get("recommendations", {}) if student_doc else {}

    # Merge: personalized overrides / adds to classWide
    merged_recs = {}
    for category in set(list(classwide_recs.keys()) + list(student_recs.keys())):
        merged_recs[category] = {
            "classWide": classwide_recs.get(category, []),
            "personalized": student_recs.get(category, [])
        }

    return jsonify(merged_recs)
