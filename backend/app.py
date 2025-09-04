from flask import Flask
from flask_cors import CORS

from routes.admin import admin_bp
from routes.student import student_bp
from routes.instructor import instructor_bp
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

# Register blueprints with prefixes
app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(student_bp, url_prefix="/student")
app.register_blueprint(instructor_bp, url_prefix="/instructor")
app.register_blueprint(auth_bp, url_prefix="/auth")

@app.route("/")
def home():
    return "Welcome to Learning Analytics Application!"

if __name__ == "__main__":
    app.run(debug=True)
