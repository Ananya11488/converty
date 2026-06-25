import time
from pathlib import Path
from typing import Callable

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from backend.services.csv_to_json import convert_csv_to_json
from backend.services.md_to_pdf import convert_md_to_pdf
from backend.utils import file_ops, validators
from backend.utils.security import verify_api_key


class ConversionRequest(BaseModel):
    file_id: str
    target_format: str


router = APIRouter(
    prefix="/convert",
    tags=["convert"],
    dependencies=[Depends(verify_api_key)]
)

SERVICE_MAP: dict[tuple[str, str], Callable[[Path, Path], None]] = {
    (".md", "pdf"): convert_md_to_pdf,
    (".csv", "json"): convert_csv_to_json,
}


@router.post("/")
async def convert_file(payload: ConversionRequest) -> dict[str, str]:
    start = time.perf_counter()

    input_path = file_ops.get_upload_path(payload.file_id)
    if not input_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Source file not found.",
        )

    original_extension = input_path.suffix.lower()
    target_format = validators.validate_conversion(original_extension, payload.target_format)

    service = SERVICE_MAP.get((original_extension, target_format))
    if service is None:
        raise HTTPException(
            status_code=400,
            detail=f"Conversion from {original_extension} to {target_format} not implemented.",
        )

    converted_name = file_ops.generate_uuid_filename(target_format)
    output_path = file_ops.get_converted_path(converted_name)

    service(input_path, output_path)

    print(f"[PERF] /convert completed in {time.perf_counter() - start:.4f}s")

    return {"converted_id": converted_name}
