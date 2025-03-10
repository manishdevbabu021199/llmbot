import hashlib
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Header
import firebase_admin
from firebase_admin import credentials, auth
import requests
from .models import UserRegister, UserLogin
import os
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

# Firebase setup
cred = credentials.Certificate("config/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

router = APIRouter()


load_dotenv()
key = os.getenv("AUTH_KEY")  
iv = os.getenv("AUTH_IV")  
iv = iv.encode('utf-8')
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")


def decrypt(enc, key, iv):
    enc = base64.b64decode(enc)
    cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(enc), 16)


@router.post("/auth/register")
def register_user(user: UserRegister):
    try:
        user_record = auth.create_user(
            email=user.email, password=decrypt(user.password))
        return {"message": "User registered successfully", "uid": user_record.uid}
    except Exception as e:
        return {"error": str(e)}


@router.post("/auth/login")
def login_user(user: UserLogin):
    print(decrypt(user.password, key, iv).decode("utf-8", "ignore"))
    try:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
        payload = {"email": user.email,
                   "password": decrypt(user.password, key, iv).decode("utf-8", "ignore"), "returnSecureToken": True}
        response = requests.post(url, json=payload)

        if response.status_code != 200:
            error_data = response.json()
            error_message = error_data.get("error", {}).get(
                "message", "An error occurred")
            raise HTTPException(status_code=400, detail=error_message)

        data = response.json()

        email_hash = hashlib.md5(
            user.email.strip().lower().encode()).hexdigest()
        avatar_url = f"https://www.gravatar.com/avatar/{email_hash}?d=identicon"

        return {
            "email": user.email,
            "avatar_url": avatar_url,
            "id_token": data["idToken"],
            "refresh_token": data["refreshToken"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def verify_token(authorization: str = Header(None)):
    print(authorization)
    if not authorization:
        raise HTTPException(
            status_code=401, detail="Authorization token missing")

    token = authorization.split("Bearer ")[-1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/auth/validate-token")
def validate_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=401, detail="Authorization token missing")

    token = authorization.split("Bearer ")[-1]

    try:
        decoded_token = auth.verify_id_token(token)
        return {"message": "Token is valid"}

    except firebase_admin.auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=401, detail="ID token has expired. Use refresh token to get a new one.")

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/auth/refresh-token")
def refresh_token(refresh_token: str):
    try:
        url = f"https://securetoken.googleapis.com/v1/token?key={FIREBASE_API_KEY}"
        payload = {"grant_type": "refresh_token",
                   "refresh_token": refresh_token}
        response = requests.post(url, data=payload)

        if response.status_code != 200:
            raise HTTPException(
                status_code=401, detail="Invalid refresh token")

        data = response.json()

        new_id_token = data["id_token"]
        decoded_token = auth.verify_id_token(new_id_token)
        user_profile = auth.get_user(decoded_token["uid"])

        email_hash = hashlib.md5(
            user_profile.email.strip().lower().encode()).hexdigest()
        avatar_url = f"https://www.gravatar.com/avatar/{email_hash}?d=identicon"

        return {
            "email": user_profile.email,
            "avatar_url": avatar_url,
            "id_token": new_id_token,
            "refresh_token": data["refresh_token"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
