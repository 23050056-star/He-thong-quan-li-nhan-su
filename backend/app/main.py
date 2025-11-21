from fastapi import FastAPI
from app.api.v1.routes import auth, employees

app = FastAPI(title="Hệ thống quản lý nhân sự")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["employees"])

@app.get("/")
def root():
    return {"msg": "API chạy OK"}
app/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "he-thong-quan-li-nhan-su"
    DATABASE_URL: str = "sqlite:///./app.db"
    JWT_SECRET: str = "change-me-in-prod"

    class Config:
        env_file = ".env"

settings = Settings()
