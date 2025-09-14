import os
from dotenv import load_dotenv

load_dotenv()  # loads .env

SECRET_KEY = os.getenv("AES_SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")
