from sqlalchemy import String, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Project(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    pdf_file_path: Mapped[str] = mapped_column(String(500))
    pdf_file_name: Mapped[str] = mapped_column(String(255))
    pdf_page_count: Mapped[int] = mapped_column(Integer, default=0)
    
    scale_numerator: Mapped[float] = mapped_column(Float, default=1.0)
    scale_denominator: Mapped[float] = mapped_column(Float, default=100.0)
    scale_unit: Mapped[str] = mapped_column(String(20), default="mm")

    # Relationships
    layers: Mapped[list["Layer"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    annotations: Mapped[list["Annotation"]] = relationship(back_populates="project", cascade="all, delete-orphan")