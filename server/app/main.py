from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine
from app.api.routes import projects, layers, annotations, ai

# 暂时不导入模型，避免未定义错误
# from .models import Base

app = FastAPI(title="PDF Editor API", version="0.1.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
api_prefix = settings.API_V1_STR
app.include_router(projects.router, prefix=api_prefix)
app.include_router(layers.router, prefix=api_prefix)
app.include_router(annotations.router, prefix=api_prefix)
app.include_router(ai.router, prefix=api_prefix)

@app.get("/")
async def root():
    return {"message": "PDF Editor API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}