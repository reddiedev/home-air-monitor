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

class SensorData(BaseModel):
    temperature: float
    humidity: float

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


@app.post("/api/upload")
async def upload_sensor_data(data: SensorData):

    await initialize_database()

    print(f"[INFO]: Temperature: {data.temperature}, Humidity: {data.humidity}")

    # upload new information to the database
    pocketbase_client.collection("data").create({
        "timestamp": datetime.now().isoformat(),
        "temperature": data.temperature,
        "humidity": data.humidity,
        "status": "good"
    })

    return {"temperature": data.temperature, "humidity": data.humidity}


async def get_air_quality():
    collection = pocketbase_client.collection("posts").get_list(page=1, per_page=10)
    records = [PostRecord(**record.__dict__) for record in collection.items]
    
    for record in records:
        print(record.content)  # Access as attribute
    
    return {"message": "Hello World"}


async def initialize_database():
    try:
        collection = pocketbase_client.collections.get_one("data")
        print(f"[INFO]: Collection already initialized!: #{collection.id}")
    except Exception as e:
        print(f"[PARENT ERROR]: {e}")
        try:
            pocketbase_client.collections.create({
                "name": "data",
                "type": "base",
                "fields":[
                    {
                        "name": "timestamp",
                        "type": "date",
                        "required": True,
                        "unique": False,
                    },
                    {
                        "name": "temperature",
                        "type": "number",
                        "required": True,
                        "unique": False,
                    },
                    {
                        "name": "humidity",
                        "type": "number",
                        "required": True,
                        "unique": False,
                    },
                    {
                        "name":"status",
                        "type":"text",
                        "required": True,
                        "unique": False,
                    }
                
                ]
            })
        except Exception as ee:
            print(f"[ERROR]: {ee}")