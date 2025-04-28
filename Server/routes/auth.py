from fastapi import APIRouter
from controllers.authController import signup_user, signin_user
from models.user import User, SigninUser

router = APIRouter()

@router.post("/signup")
async def signup(user: User):
    return signup_user(user)

@router.post("/signin")
async def signin(user: SigninUser):
    return signin_user(user)
