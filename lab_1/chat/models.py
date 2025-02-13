from typing import List

class ChatRoom:
    def __init__(self, room_name: str):
        self.room_name = room_name
        self.users = set()  # Set to store unique WebSocket connections

    def add_user(self, websocket):
        self.users.add(websocket)

    def remove_user(self, websocket):
        self.users.remove(websocket)

    def broadcast(self, message: str):
        for user in self.users:
            user.send_text(message)

# Global dictionary to store chat rooms
chat_rooms = {}

