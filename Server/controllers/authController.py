from config.db import users_collection
from utils.security import get_password_hash, verify_password
from models.user import User, SigninUser
from fastapi import HTTPException

def signup_user(user: User):
    print("Received data:", user)
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    })
    return {"message": "User registered successfully"}

def signin_user(user: SigninUser):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {"message": "Login successful", "username": db_user["username"]}
