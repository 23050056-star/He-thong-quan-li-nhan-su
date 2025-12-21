from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import auth, employees

app = FastAPI(
    title="Hệ thống quản lý nhân sự",
    version="1.0.0"
)

# Thêm CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/login", tags=["auth"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["employees"])

@app.get("/")
def root():
    return {"msg": "API chạy OK"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Server is running"}