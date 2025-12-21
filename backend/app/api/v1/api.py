# backend/app/api/v1/api.py
from fastapi import APIRouter
from .routes.auth import router as auth_router

# Tạo router chính
router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["Auth"])