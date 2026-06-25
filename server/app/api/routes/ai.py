from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.ai import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/chat", response_model=ChatResponse, status_code=501)
async def chat(request: ChatRequest):
    raise HTTPException(status_code=501, detail="AI Chat feature is not implemented yet.")

@router.get("/conversations", response_model=List[dict], status_code=501)
async def get_conversations():
    raise HTTPException(status_code=501, detail="AI Conversations feature is not implemented yet.")

@router.get("/conversations/{conversation_id}", response_model=dict, status_code=501)
async def get_conversation(conversation_id: str):
    raise HTTPException(status_code=501, detail="AI Conversations feature is not implemented yet.")