# backend/main.py
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import uvicorn

from backend.app.services.auth import authenticate_user



# KHÔNG thêm sys.path, KHÔNG import từ app

app = FastAPI(
    title="Hệ thống quản lý nhân sự",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đường dẫn
backend_dir = Path(__file__).parent.absolute()
frontend_path = backend_dir.parent / "frontend"

print(f"✅ Backend: {backend_dir}")
print(f"✅ Frontend: {frontend_path}")

# Mount static files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Mount static
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# Routes
@app.get("/")
def root():
    return {"message": "Server is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/login")
def login_page():
    return FileResponse(frontend_path / "account" / "index.html")

@app.get("/admin/dashboard")
def admin_dashboard():
    return FileResponse(frontend_path / "admin" / "index.html")

@app.get("/nhanvien/dashboard")
def nhanvien_dashboard():
    return FileResponse(frontend_path / "nhanvien" / "index.html")

@app.post("/api/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    user = authenticate_user(email, password)
    if user:
        return {"access_token": "token123", "role": user.role, "email": user.email}
    
    return JSONResponse(status_code=401, content={"detail": "Đăng nhập thất bại"});