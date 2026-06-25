from __future__ import annotations

from pathlib import Path
from typing import Mapping

from fastapi import HTTPException, UploadFile, status


MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".md", ".csv"}
SUPPORTED_CONVERSIONS: Mapping[str, set[str]] = {
    ".md": {"pdf"},
    ".csv": {"json"},
}


def _normalized_extension(filename: str | None) -> str:
    return Path(filename or "").suffix.lower()


def validate_file_extension(filename: str, allowed_extensions: set[str]) -> str:
    extension = Path(filename or "").suffix.lower()
    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file extension",
        )
    return extension


def validate_file_size(size: int, max_size: int) -> None:
    if size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File exceeds maximum allowed size",
        )


def validate_upload_file(upload: UploadFile) -> str:
    extension = validate_file_extension(upload.filename or "", ALLOWED_EXTENSIONS)
    upload.file.seek(0, 2)
    size = upload.file.tell()
    upload.file.seek(0)
    validate_file_size(size, MAX_FILE_SIZE_BYTES)

    return extension


def validate_conversion(original_extension: str, target_format: str) -> str:
    normalized_extension = original_extension.lower()
    normalized_target = target_format.lower().lstrip(".")

    if normalized_extension not in SUPPORTED_CONVERSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No conversions supported for extension: {normalized_extension}",
        )

    if normalized_target not in SUPPORTED_CONVERSIONS[normalized_extension]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Conversion from {normalized_extension} to {normalized_target} not supported.",
        )

    return normalized_target


