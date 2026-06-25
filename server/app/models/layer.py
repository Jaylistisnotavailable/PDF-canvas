from sqlalchemy import String, Boolean, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Layer(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "layers"

    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(100))
    visible: Mapped[bool] = mapped_column(Boolean, default=True)
    locked: Mapped[bool] = mapped_column(Boolean, default=False)
    opacity: Mapped[float] = mapped_column(Float, default=1.0)
    color: Mapped[str] = mapped_column(String(20), default="#3B82F6")
    order: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    project: Mapped["Project"] = relationship(back_populates="layers")
    annotations: Mapped[list["Annotation"]] = relationship(back_populates="layer", cascade="all, delete-orphan")