from fastapi import FastAPI, Depends, HTTPException, status, Request, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session, joinedload
import logging

from database import SessionLocal, engine, Base, get_db
from schemas import UserCreate, Token, UserResponse, RoomCreate, RoomResponse
from utils import verify_password, get_password_hash
from auth import create_access_token, get_current_user
from models import User, Room
from typing import List

# create app
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# create database tables
Base.metadata.create_all(bind=engine)

# create logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===================================== LOGIN LOGIC =====================================
@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse(request=request, name="login.html", context={"request": request})

@app.post("/login/", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # generate JWT token for authentication
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ===================================== REGISTRATION LOGIC =====================================
@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(request=request, name="register.html", context={"request": request})

@app.post("/register/", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # hash the password and create the user
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # generate JWT token
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ===================================== CHAT LOGIC =====================================
@app.get("/chats", response_class=HTMLResponse)
def chats_page(request: Request):
    return templates.TemplateResponse(request=request, name="chats.html", context={"request": request})

@app.get("/chats/", response_model=List[RoomResponse])
def get_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # to show only owner's rooms
    # chats = db.query(Room).options(joinedload(Room.owner)).filter(Room.owner_id == current_user.id).all()

    # to show only all rooms
    chats = db.query(Room).options(joinedload(Room.owner)).all()
    return chats

@app.get("/chat/{room_id}", response_class=HTMLResponse)
async def chat_page(request: Request, room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return templates.TemplateResponse("chat.html", {"request": request, "room": room})

@app.post("/chats/create")
def create_chat_room(room: RoomCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # check if room name already exists
    db_room = db.query(Room).filter(Room.name == room.name, Room.owner_id == current_user.id).first()
    if db_room:
        raise HTTPException(status_code=400, detail="Room name already exists")
    
    new_room = Room(name=room.name, owner_id=current_user.id)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return {"message": "Room created", "room": new_room}

@app.delete("/chats/delete/{room_id}")
def delete_chat_room(room_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # id and owner_id 
    # room = db.query(Room).filter(Room.id == room_id, Room.owner_id == current_user.id).first()

    # id and THEN owner_id
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this room")
    
    # delete room from database
    db.delete(room)
    db.commit()
    return {"message": f"Room (ID: {room_id}) deleted"}

@app.get("/search", response_model=List[RoomResponse])
def search_chats(
    query: str = Query(..., min_length=6, description="search query (minimum 6 letters)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rooms = db.query(Room).filter(Room.name.ilike(f"%{query}%")).all()
    # rooms = db.query(Room).filter(Room.name.contains(query))
    if not rooms:
        raise HTTPException(status_code=404, detail="No chats found")
    return rooms

# ===================================== ANOTHER LOGIC =====================================

@app.get("/home", response_class=HTMLResponse)
async def read_root(request: Request):
    # return {"message": "Welcome to the FastAPI Auth Demo"}
    return templates.TemplateResponse(request=request, name="home.html", context={"request": request})

@app.get("/")
def redirect_to_home():
    # redirect
    return RedirectResponse(url="/home", status_code=301)

# Protected route to check JWT token validity
@app.get("/me", response_model=UserResponse)
def access_cabinet(current_user: User = Depends(get_current_user)):
    return {"message": f"Welcome to your cabinet, {current_user.email}!", "user": current_user}
