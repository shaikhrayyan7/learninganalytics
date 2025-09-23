from flask import Blueprint, jsonify
from pymongo import MongoClient
from app_config import MONGO_URI
from encryption_utils import decrypt_data

student_performance_bp = Blueprint(
    "student_performance_bp",
    __name__,
    url_prefix="/api/student/performance"
)

client = MongoClient(MONGO_URI)
db = client["learning_analytics"]
assigned_col = db["assigned_surveys"]

@student_performance_bp.route("/analytics/<email>", methods=["GET"])
def get_student_analytics(email):
    surveys = list(assigned_col.find({"studentEmail": email, "submitted": True}))
    if not surveys:
        return jsonify({"error": "No submitted surveys"}), 404

    weight_map = {"Strongly Disagree": 1, "Disagree": 2, "Neutral": 3, "Agree": 4, "Strongly Agree": 5}

    engagement_weekly, focus_weekly, stress_weekly, wellbeing_weekly = [], [], [], []
    week_labels = []

    for idx, s in enumerate(surveys):
        decrypted = decrypt_data(s["responses"])

        # Compute each metric safely
        def compute_score(section):
            vals = [weight_map.get(v, 3) for v in decrypted.get(section, {}).values()]
            return round(sum(vals)/len(vals)*20, 2) if vals else 0

        engagement_weekly.append(compute_score("engagement"))
        focus_weekly.append(compute_score("focus"))
        stress_weekly.append(compute_score("stress"))
        wellbeing_weekly.append(compute_score("wellbeing"))

        week_labels.append(s.get("label", f"Week {idx+1}"))

    return jsonify({
        "weeks": week_labels,
        "engagement": engagement_weekly,
        "focus": focus_weekly,
        "stress": stress_weekly,
        "wellbeing": wellbeing_weekly
    }), 200

