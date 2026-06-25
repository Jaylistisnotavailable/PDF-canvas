from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    message: str
    conversation_id: str