from pocketbase import PocketBase
from fastapi import FastAPI
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from datetime import datetime


class PostRecord(BaseModel):
    id: str
    content: str
    created: datetime
    updated: datetime
    
    class Config:
        # Allow extra fields that might come from PocketBase
        extra = "allow"

load_dotenv()

app = FastAPI()

pocketbase_client = PocketBase(os.getenv("POCKETBASE_URL") or "http://127.0.0.1:8090")
admin_client = pocketbase_client.admins.auth_with_password(
    os.getenv("POCKETBASE_EMAIL") or "admin@example.com",
    os.getenv("POCKETBASE_PASSWORD") or "0123456789",
)
    
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/v1/air-quality")
async def get_air_quality():
    collection = pocketbase_client.collection("posts").get_list(page=1, per_page=10)
    records = [PostRecord(**record.__dict__) for record in collection.items]
    
    for record in records:
        print(record.content)  # Access as attribute
    
    return {"message": "Hello World"}