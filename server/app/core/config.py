from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "PDF Editor"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:5173",  # Vite 默认端口
    ]

    DATABASE_URL: str = "sqlite+aiosqlite:///./pdf_editor.db"
    UPLOAD_DIR: str = "./uploads"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# 确保上传目录存在
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)