# 🥓 Home Air Monitor (HAM)

**HAM** is a DIY indoor air quality monitoring system powered by an ESP8266 microcontroller. It helps you track the temperature and humidity of your bedroom—keeping your space comfy and healthy!

![Dashboard](/public/dashboard.png)

---

## 🎯 Objectives

- [x] Real-time temperature & humidity data
- [x] Local, self-hosted compute & storage
- [x] Low-cost and easy integration with other systems
- [x] Hands-on learning with tech I know (and want to learn!)
- [ ] CO₂ sensor integration *(coming soon!)*
- [ ] E-ink display integration *(coming soon!)*
- [ ] 3D-printed enclosure *(coming soon!)*


---

## 🛠️ Tech Stack

![Diagram](/public/diagram.png)

- **ESP8266** IoT device  
- **REST API** with FastAPI  
- **Pocketbase** (SQLite-based database)  
- **Frontend:** React.js (Vite + TanStack Start)  
- **Deployment:** Docker

---

## 🚀 Getting Started

### 🧰 Hardware Requirements

**IoT Device:**
- ESP8266-based microcontroller (e.g., NodeMCU v3)
- SHT30-D temperature & humidity sensor
- Breadboard and jumper wires
- *(Optional)* DHT-22 temperature & humidity sensor

**Server:**
- Python 3.12+
- Node.js v20 LTS
- [Pocketbase](https://pocketbase.io/docs/going-to-production/#using-docker) (via Docker)

> 💡 *Tip: I use a Raspberry Pi 4B (4GB) to run the containers!*

---

### 🏗️ Installation & Testing

Clone the repo and set up the backend:

```bash
git clone https://github.com/reddiedev/home-air-monitor.git
cd home-air-monitor

cd backend
pip install -r requirements.txt
fastapi dev main
```

Set up the frontend:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run dev
```

Flash the ESP8266 with the device code using the [Arduino IDE](https://www.arduino.cc/en/software):

- Open `device/Main.ino` in Arduino IDE
- Connect your ESP8266 and upload the code

---

### 🖥️ Usage

Spin up everything with Docker:

```bash
# From either backend or frontend directory
docker compose up -d --build
```

- 🌐 **Dashboard:** [http://localhost:3000](http://localhost:3000)
- 🛠️ **API:** [http://localhost:8000](http://localhost:8000)

---

## 🤝 Contributing

Pull requests, issues, and suggestions are welcome!  
Let’s make indoor air quality monitoring better together.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---
