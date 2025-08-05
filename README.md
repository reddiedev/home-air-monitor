# 🥓 Home Air Monitor (HAM)

HAM is a DIY indoor air quality monitoring system powered by an ESP8266 microcontroller, helping me track the temperature and humidity of my bedroom

![Dashboard](/public/dashboard.png)

## Objectives
- [x] Provide real-time temperature and humidity data
- [x] Local self-hosted compute and storage deployment
- [x] Low-cost and easy integration with systems
- [x] Practical applications of technology I know/ want to learn
- [ ] 3d-printed enclosure
- [ ] integration of CO2 sensor

## Tech Stack
![Diagram](/public/diagram.png)
- ESP8266-based IOT device 
- REST API via FastAPI
- Sqlite-based Database via Pocketbase
- Frontend using React.JS via Vite/Tanstack Start
- Deployment via Docker

## Getting Started

### Requirements
Your IOT device must have:
- ESP8266-based Microcontroller ie. NodeMCU v3
- SHT30-D Temperature & Humidity Sensor
- Breadboard and Jumper Wires
- Optional, DHT-22 Temperature & Humidity Sensor

Your server must have:
- Python 3.12^
- Node.js v20 LTS
- Running Pocketbase instance via [Docker](https://pocketbase.io/docs/going-to-production/#using-docker)
> In my case, I used a Raspberry Pi 4b 4GB model to run the containers

### Installation & Testing
```bash
git clone https://github.com/reddiedev/home-air-monitor.git
cd home-air-monitor

cd backend
pip install -r requirements.txt
fastapi dev main

cd frontend
pnpm install --frozen-lockfile
pnpm run dev
```
Using [Arduino IDE](https://www.arduino.cc/en/software), flash the `device/Main.ino` source code into the ESP8266 development board

### Usage

```bash
# cd backend || # cd frontend
docker compose up -d --build
```

- View Dashboard at `http://localhost:3000`
- View API at `http://localhost:8000`
