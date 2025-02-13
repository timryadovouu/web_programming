from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, HTTPException, status, Depends, Query
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from typing import List
from fastapi.templating import Jinja2Templates
from utils import get_user_from_token
import logging
import json

app = FastAPI()
templates = Jinja2Templates(directory="templates")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()


# @app.get("/")
# async def get(request: Request):
#     return templates.TemplateResponse(request=request, name="test.html")

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int):
    token = websocket.query_params.get("token")
    user_email = get_user_from_token(token) 
    logger.info(f"Token received: {token}")
    logger.info(f"email received: {user_email}")
    await manager.connect(websocket)
    # await manager.broadcast(f"{user_email} has joined the chat")
    await manager.broadcast(json.dumps({
        "type": "notification",
        "message": f"{user_email} has joined the chat"
    }))
    try: 
        while True:
            data = await websocket.receive_text()
            # await manager.send_personal_message(f"You wrote: {data}", websocket)
            # await manager.broadcast(f"{user_email}: {data}")
            await manager.broadcast(json.dumps({
                "type": "message",
                "sender": user_email,
                "message": data
            }))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info(f"{user_email} disconnected")
        # await manager.broadcast(f"{user_email} has left the chat")
        await manager.broadcast(json.dumps({
            "type": "notification",
            "message": f"{user_email} has left the chat"
        }))
