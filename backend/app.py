from flask import Flask
from flask_cors import CORS

from routes.admin import admin_bp
from routes.student import student_bp
from routes.instructor import instructor_bp
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.programs_api import programs_bp
from routes.manage_users import users_bp
from routes.student_courses_bp import student_courses_bp
from routes.student_grades_bp import student_grades_bp
from routes.student_privacy_bp import student_privacy_bp
from routes.recommendations_bp import recommendations_bp

app = Flask(__name__)
CORS(app)

# Register blueprints with prefixes
app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(student_bp, url_prefix="/student")
app.register_blueprint(instructor_bp, url_prefix="/instructor")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(profile_bp, url_prefix="/profile")
app.register_blueprint(programs_bp)
app.register_blueprint(users_bp)
app.register_blueprint(student_courses_bp)
app.register_blueprint(student_grades_bp)
app.register_blueprint(student_privacy_bp)
app.register_blueprint(recommendations_bp)

@app.route("/")
def home():
    return "Welcome to Learning Analytics Application!"

if __name__ == "__main__":
    app.run(debug=True)
