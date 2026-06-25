import os
import aiofiles
from fastapi import UploadFile
from app.core.config import settings

async def save_upload_file(file: UploadFile, destination_dir: str) -> str:
    os.makedirs(destination_dir, exist_ok=True)
    file_path = os.path.join(destination_dir, file.filename)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    return file_path