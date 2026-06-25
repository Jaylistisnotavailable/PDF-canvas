from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List

from app.core.database import get_db
from app.models.annotation import Annotation
from app.models.project import Project
from app.schemas.annotation import AnnotationCreate, AnnotationUpdate, AnnotationResponse, BatchAnnotationCreate
from app.api.deps import get_project_by_id

router = APIRouter(prefix="/projects/{project_id}/annotations", tags=["Annotations"])

@router.get("/", response_model=List[AnnotationResponse])
async def get_annotations(
    project: Project = Depends(get_project_by_id),
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Annotation).where(Annotation.project_id == project.id, Annotation.page_index == page - 1)
    )
    return result.scalars().all()

@router.post("/", response_model=List[AnnotationResponse], status_code=201)
async def create_annotation(
    annotation_in: AnnotationCreate,
    project: Project = Depends(get_project_by_id),
    db: AsyncSession = Depends(get_db)
):
    annotation = Annotation(project_id=project.id, **annotation_in.model_dump())
    db.add(annotation)
    await db.commit()
    await db.refresh(annotation)
    return [annotation]

@router.post("/batch", response_model=List[AnnotationResponse], status_code=201)
async def batch_create_annotations(
    batch_in: BatchAnnotationCreate,
    project: Project = Depends(get_project_by_id),
    db: AsyncSession = Depends(get_db)
):
    annotations = [Annotation(project_id=project.id, **ann.model_dump()) for ann in batch_in.annotations]
    db.add_all(annotations)
    await db.commit()
    for ann in annotations:
        await db.refresh(ann)
    return annotations

@router.patch("/{annotation_id}", response_model=AnnotationResponse)
async def update_annotation(
    annotation_id: str,
    annotation_in: AnnotationUpdate,
    project: Project = Depends(get_project_by_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Annotation).where(Annotation.id == annotation_id, Annotation.project_id == project.id)
    )
    annotation = result.scalar_one_or_none()
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")
    
    for key, value in annotation_in.model_dump(exclude_unset=True).items():
        setattr(annotation, key, value)
        
    await db.commit()
    await db.refresh(annotation)
    return annotation

@router.delete("/{annotation_id}", status_code=204)
async def delete_annotation(
    annotation_id: str,
    project: Project = Depends(get_project_by_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Annotation).where(Annotation.id == annotation_id, Annotation.project_id == project.id)
    )
    annotation = result.scalar_one_or_none()
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")
    
    await db.delete(annotation)
    await db.commit()