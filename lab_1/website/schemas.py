from pydantic import BaseModel


class User(BaseModel):
    email: str

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    message: str
    user: User

class Room(BaseModel):
    name: str

class RoomCreate(BaseModel):
    name: str

class OwnerResponse(BaseModel):
    email: str 

    class Config:
        orm_mode = True

class RoomResponse(BaseModel):
    id: int
    owner_id: int
    name: str
    owner: OwnerResponse

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
