from sqlalchemy import String, Float, Integer, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Annotation(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "annotations"

    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    layer_id: Mapped[str] = mapped_column(ForeignKey("layers.id", ondelete="CASCADE"))
    page_index: Mapped[int] = mapped_column(Integer)
    
    shape_type: Mapped[str] = mapped_column(String(50)) # point, line, rect, etc.
    label: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # 核心：使用 JSON 存储不同形状的特有属性 (坐标、点集等)
    properties: Mapped[dict] = mapped_column(JSON, default=dict)
    
    color: Mapped[str] = mapped_column(String(20))
    stroke_width: Mapped[float] = mapped_column(Float, default=2.0)
    fill_color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    fill_opacity: Mapped[float | None] = mapped_column(Float, nullable=True)
    opacity: Mapped[float] = mapped_column(Float, default=1.0)
    
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSON, nullable=True) # AI 预留

    # Relationships
    project: Mapped["Project"] = relationship(back_populates="annotations")
    layer: Mapped["Layer"] = relationship(back_populates="annotations")