from fastapi import FastAPI
from dotenv import load_dotenv
from core.pocketbase import Pocketbase, SensorData

load_dotenv()

app = FastAPI()
pocketbase = Pocketbase()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/upload")
async def upload_sensor_data(data: SensorData):
    print(f"[INFO]: Temperature: {data.temperature}, Humidity: {data.humidity}")
    info = pocketbase.upload_sensor_data(data)

    return info
