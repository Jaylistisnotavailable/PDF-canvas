from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    scale_numerator: float = 1.0
    scale_denominator: float = 100.0
    scale_unit: str = "mm"

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    scale_numerator: Optional[float] = None
    scale_denominator: Optional[float] = None
    scale_unit: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: str
    pdf_file_path: str
    pdf_file_name: str
    pdf_page_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)