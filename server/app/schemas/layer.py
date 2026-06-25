from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class LayerBase(BaseModel):
    name: str
    visible: bool = True
    locked: bool = False
    opacity: float = 1.0
    color: str = "#3B82F6"
    order: int = 0

class LayerCreate(LayerBase):
    pass

class LayerUpdate(BaseModel):
    name: Optional[str] = None
    visible: Optional[bool] = None
    locked: Optional[bool] = None
    opacity: Optional[float] = None
    color: Optional[str] = None

class LayerReorderItem(BaseModel):
    id: str
    order: int

class LayerResponse(LayerBase):
    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)