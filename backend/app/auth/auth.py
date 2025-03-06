from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Header
import firebase_admin
from firebase_admin import credentials, auth
import requests
from .models import UserRegister, UserLogin
import os
# Firebase setup
cred = credentials.Certificate("config/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

# Create an API router (instead of a new FastAPI app)
router = APIRouter()

load_dotenv()

# Get variables from .env
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

# Firebase API Key (Replace with your key)


@router.post("/auth/register")
def register_user(user: UserRegister):
    try:
        user_record = auth.create_user(
            email=user.email, password=user.password)
        return {"message": "User registered successfully", "uid": user_record.uid}
    except Exception as e:
        return {"error": str(e)}


@router.post("/auth/login")
def login_user(user: UserLogin):
    try:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
        payload = {"email": user.email,
                   "password": user.password, "returnSecureToken": True}
        response = requests.post(url, json=payload)

        if response.status_code != 200:
            return {"error": "Invalid email or password"}

        data = response.json()
        return {"id_token": data["idToken"], "refresh_token": data["refreshToken"]}

    except Exception as e:
        return {"error": str(e)}


def verify_token(authorization: str = Header(None)):
    print(authorization)
    if not authorization:
        raise HTTPException(
            status_code=401, detail="Authorization token missing")

    token = authorization.split("Bearer ")[-1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token  # Returns user details (UID, email, etc.)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
