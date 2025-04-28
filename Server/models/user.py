from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    password: str

class SigninUser(BaseModel):
    email: str
    password: str