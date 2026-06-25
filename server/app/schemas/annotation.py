from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Dict, Any, List

class AnnotationBase(BaseModel):
    layer_id: str
    page_index: int
    shape_type: str
    label: Optional[str] = None
    properties: Dict[str, Any]
    color: str
    stroke_width: float = 2.0
    fill_color: Optional[str] = None
    fill_opacity: Optional[float] = None
    opacity: float = 1.0
    metadata: Optional[Dict[str, Any]] = None

class AnnotationCreate(AnnotationBase):
    pass

class AnnotationUpdate(BaseModel):
    layer_id: Optional[str] = None
    page_index: Optional[int] = None
    label: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    color: Optional[str] = None
    stroke_width: Optional[float] = None
    fill_color: Optional[str] = None
    fill_opacity: Optional[float] = None
    opacity: Optional[float] = None

class AnnotationResponse(AnnotationBase):
    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BatchAnnotationCreate(BaseModel):
    annotations: List[AnnotationCreate]