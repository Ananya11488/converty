import time

from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import FileResponse

from backend.utils import file_ops
from backend.utils.security import verify_api_key

router = APIRouter(
    tags=["download"],
    dependencies=[Depends(verify_api_key)]
)


@router.get("/download")
async def download(file_id: str = Query(...)) -> FileResponse:
    start = time.perf_counter()

    file_path = file_ops.find_file_by_id(file_id)
    if file_path is None or not file_path.exists() or not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    print(f"[PERF] /download completed in {time.perf_counter() - start:.4f}s")

    return FileResponse(
        path=file_path,
        filename=file_path.name,
    )
