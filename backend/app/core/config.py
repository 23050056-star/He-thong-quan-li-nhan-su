from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hệ thống quản lý nhân sự"
    VERSION: str = "1.0.0"
    DATABASE_URL: str = "sqlite:///./app.db"
    JWT_SECRET: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()