from dotenv import load_dotenv
import os
import requests
from datetime import datetime
from pydantic import BaseModel

class SensorData(BaseModel):
    temperature: float
    humidity: float

load_dotenv()


class Pocketbase():

  def __init__(self,):
    self.url = os.getenv("POCKETBASE_URL") or "http://127.0.0.1:8090"
    self.email = os.getenv("POCKETBASE_EMAIL") or "admin@example.com"
    self.password = os.getenv("POCKETBASE_PASSWORD") or "0123456789"
    self.token = self.get_login_token()
    self.requests_counter = 0

    self.initialize_database()

  def get_login_token(self):
    print(f"[Pocketbase]: Getting login token: {self.email} {self.password}")
    url = f"{self.url}/api/collections/_superusers/auth-with-password"
    request =  requests.post(url, json={"identity": self.email, "password": self.password})
    token = request.json()["token"]
    print(f"[Pocketbase]: Login token: {token}")
    return token

  def upload_sensor_data(self, data: SensorData):
    self.requests_counter += 1
    if self.requests_counter > 100:
      self.requests_counter = 0
      self.token = self.get_login_token()

    print(f"[Pocketbase]: Uploading sensor data: {data}")
    url = f"{self.url}/api/collections/data/records"
    response = requests.post(url, json={
      "timestamp": datetime.now().isoformat(),
      "temperature": data.temperature,
      "humidity": data.humidity,
      "status": "ok!"
    }, headers={"Authorization": f"{self.token}"})

    print(f"[Pocketbase]: Sensor data uploaded: {response.json()}")
    
    return response.json()

  def initialize_database(self):
    print(f"[Pocketbase]: Initializing database...")

    try:
        response = requests.post(f"{self.url}/api/collections", json={
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
                },headers={"Authorization": f"{self.token}"})
        
        if response.status_code == 200:
            print(f"[Pocketbase]: Database initialized: {response.json()}")
        elif response.status_code == 400:
            print(f"[Pocketbase]: Collection already exists, skipping initialization")
        else:
            print(f"[Pocketbase]: Unexpected status code: {response.status_code}")
            
    except Exception as e:
        print(f"[Pocketbase]: Error initializing database: {e}")

