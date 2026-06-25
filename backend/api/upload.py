from __future__ import annotations

import time
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from backend.utils import file_ops, validators
from backend.utils.security import verify_api_key

router = APIRouter(
    tags=["upload"],
    dependencies=[Depends(verify_api_key)]
)

ALLOWED_EXTENSIONS = {".csv", ".md", ".txt", ".json", ".pdf"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload(file: UploadFile = File(...)) -> dict[str, str | int]:
    start = time.perf_counter()

    extension = validators.validate_file_extension(file.filename or "", ALLOWED_EXTENSIONS)

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    validators.validate_file_size(size, MAX_FILE_SIZE_BYTES)

    saved_filename = await file_ops.save_uploaded_file(file, extension)

    saved_path = file_ops.get_upload_path(saved_filename)
    if not saved_path.exists():
        raise HTTPException(
            status_code=500,
            detail="Failed to persist uploaded file.",
        )

    on_disk_size = saved_path.stat().st_size

    print(f"[PERF] /upload completed in {time.perf_counter() - start:.4f}s")

    return {
        "file_id": Path(saved_filename).stem,
        "filename": saved_filename,
        "size": on_disk_size,
    }
