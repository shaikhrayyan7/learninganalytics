from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.programs_api import programs_bp
from routes.manage_users import users_bp
from routes.student_courses_bp import student_courses_bp
from routes.student_grades_bp import student_grades_bp
from routes.student_privacy_bp import student_privacy_bp
from routes.recommendations_bp import recommendations_bp
from routes.send_recommendations_bp import send_recommendations_bp
from routes.instructor_courses_bp import instructor_courses_bp
from routes.student_list_bp import student_list_bp
from routes.course_management_bp import course_management_bp
from routes.instructor_survey_bp import instructor_survey_bp
from routes.student_survey_bp import student_survey_bp
from routes.student_performance_bp import student_performance_bp
from routes.mock_data_bp import mock_data_bp

app = Flask(__name__)
CORS(app)

# Register blueprints with prefixes
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(profile_bp, url_prefix="/profile")
app.register_blueprint(programs_bp)
app.register_blueprint(users_bp)
app.register_blueprint(student_courses_bp)
app.register_blueprint(student_grades_bp)
app.register_blueprint(student_privacy_bp)
app.register_blueprint(recommendations_bp)
app.register_blueprint(send_recommendations_bp, url_prefix="/api")
app.register_blueprint(instructor_courses_bp)
app.register_blueprint(student_list_bp)
app.register_blueprint(course_management_bp)
app.register_blueprint(instructor_survey_bp)
app.register_blueprint(student_survey_bp)
app.register_blueprint(student_performance_bp)
app.register_blueprint(mock_data_bp)

@app.route("/")
def home():
    return "Welcome to Learning Analytics Application!"

if __name__ == "__main__":
    app.run(debug=True)
