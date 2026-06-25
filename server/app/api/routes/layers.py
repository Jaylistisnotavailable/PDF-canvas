from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.layer import Layer
from app.models.project import Project
from app.schemas.layer import LayerCreate, LayerUpdate, LayerResponse, LayerReorderItem
from app.api.deps import get_project_by_id

router = APIRouter(prefix="/projects/{project_id}/layers", tags=["Layers"])

@router.get("/", response_model=List[LayerResponse])
async def get_layers(project: Project = Depends(get_project_by_id), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Layer).where(Layer.project_id == project.id).order_by(Layer.order))
    return result.scalars().all()

@router.post("/", response_model=LayerResponse, status_code=201)
async def create_layer(
    layer_in: LayerCreate, 
    project: Project = Depends(get_project_by_id), 
    db: AsyncSession = Depends(get_db)
):
    layer = Layer(project_id=project.id, **layer_in.model_dump())
    db.add(layer)
    await db.commit()
    await db.refresh(layer)
    return layer

@router.patch("/{layer_id}", response_model=LayerResponse)
async def update_layer(
    layer_id: str, 
    layer_in: LayerUpdate, 
    project: Project = Depends(get_project_by_id), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Layer).where(Layer.id == layer_id, Layer.project_id == project.id))
    layer = result.scalar_one_or_none()
    if not layer:
        raise HTTPException(status_code=404, detail="Layer not found")
    
    for key, value in layer_in.model_dump(exclude_unset=True).items():
        setattr(layer, key, value)
        
    await db.commit()
    await db.refresh(layer)
    return layer

@router.delete("/{layer_id}", status_code=204)
async def delete_layer(
    layer_id: str, 
    project: Project = Depends(get_project_by_id), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Layer).where(Layer.id == layer_id, Layer.project_id == project.id))
    layer = result.scalar_one_or_none()
    if not layer:
        raise HTTPException(status_code=404, detail="Layer not found")
    
    await db.delete(layer)
    await db.commit()

@router.put("/reorder", response_model=List[LayerResponse])
async def reorder_layers(
    items: List[LayerReorderItem], 
    project: Project = Depends(get_project_by_id), 
    db: AsyncSession = Depends(get_db)
):
    for item in items:
        result = await db.execute(select(Layer).where(Layer.id == item.id, Layer.project_id == project.id))
        layer = result.scalar_one_or_none()
        if layer:
            layer.order = item.order
            
    await db.commit()
    
    result = await db.execute(select(Layer).where(Layer.project_id == project.id).order_by(Layer.order))
    return result.scalars().all()