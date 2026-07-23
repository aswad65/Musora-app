# 🚀 Musora - Installation Guide

## Prerequisites

Make sure you have installed:

- Node.js (v18 or later recommended)
- Python 3.11+
- Git
- Microsoft SQL Server
- FFmpeg (added to system PATH)

---

# 1. Clone the repository

```bash
git clone https://github.com/aswad65/Musora-app.git
cd Musora-app
```

---

# 2. Install Frontend

```bash
cd frontend
npm install
```

---

# 3. Install Backend

```bash
cd ../backend
npm install
```

Create a `.env` file inside the `backend` folder and configure:

```env
PORT=
DB_SERVER=
DB_DATABASE=
DB_USER=
DB_PASSWORD=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 4. Setup MusicGen AI Service

```bash
cd ../Ai-service/music-gen-ai
```

Create a virtual environment

Windows

```bash
python -m venv venv
```

Activate it

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the server

```bash
python app.py
```

---

# 5. Setup Demucs AI Service

```bash
cd ../stem-separation-demucs-gradio-app
```

Create a virtual environment

```bash
python -m venv venv
```

Activate

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
python run.py
```

---

# 6. Start Backend

```bash
cd ../../backend
npm run dev
```

---

# 7. Start Frontend

```bash
cd ../frontend
npm run dev
```

---

# Services

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:3000
```

MusicGen

```
http://127.0.0.1:7860
```

Demucs

```
http://127.0.0.1:7960
```

---

# Notes

- Install FFmpeg before running the AI services.
- MusicGen and Demucs will download their required models automatically on the first run.
- The first startup may take several minutes because the AI models need to be downloaded.
