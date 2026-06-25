from __future__ import annotations

import asyncio
import shutil
import uuid
from pathlib import Path
from typing import IO

from fastapi import UploadFile


UPLOAD_DIR = Path("/tmp/uploads")
CONVERTED_DIR = Path("/tmp/converted")


def _ensure_directory(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def generate_uuid_filename(extension: str) -> str:
    ext = (extension or "").lower()
    if ext and not ext.startswith("."):
        ext = f".{ext}"
    return f"{uuid.uuid4()}{ext}"


def get_upload_path(filename: str) -> Path:
    return _ensure_directory(UPLOAD_DIR) / filename


def get_converted_path(filename: str) -> Path:
    return _ensure_directory(CONVERTED_DIR) / filename


async def save_uploaded_file(upload: UploadFile, extension: str) -> str:
    filename = generate_uuid_filename(extension)
    target_path = get_upload_path(filename)
    upload.file.seek(0)
    
    def _write_file() -> None:
        with target_path.open("wb") as buffer:
            shutil.copyfileobj(upload.file, buffer)
    
    await asyncio.to_thread(_write_file)
    upload.file.seek(0)
    return filename


def find_file_by_id(file_id: str) -> Path | None:
    upload_dir = _ensure_directory(UPLOAD_DIR)
    for path in upload_dir.iterdir():
        if path.is_file() and path.stem == file_id:
            return path
    return None


async def write_output_file(source: IO[bytes], destination: Path) -> None:
    def _write_file() -> None:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(source, buffer)
    
    await asyncio.to_thread(_write_file)


