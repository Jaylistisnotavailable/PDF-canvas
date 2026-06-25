from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.core.database import get_db
from app.core.config import settings
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.storage import save_upload_file

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_project(project_in: ProjectCreate, db: AsyncSession = Depends(get_db)):
    project = Project(**project_in.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

@router.get("/", response_model=List[ProjectResponse])
async def list_projects(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, project_in: ProjectUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
        
    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(project)
    await db.commit()

@router.post("/{project_id}/upload", response_model=ProjectResponse)
async def upload_pdf(
    project_id: str, 
    file: UploadFile = File(...), 
    db: AsyncSession = Depends(get_db)
):
    if not file.filename or not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 保存文件
    project_upload_dir = os.path.join(settings.UPLOAD_DIR, project_id)
    file_path = await save_upload_file(file, project_upload_dir)
    
    # 更新项目元数据 (实际项目中这里会调用 pdfjs 或 pypdf 获取页数)
    project.pdf_file_path = file_path
    project.pdf_file_name = file.filename
    project.pdf_page_count = 10 # 模拟获取页数
    
    await db.commit()
    await db.refresh(project)
    return project

import os