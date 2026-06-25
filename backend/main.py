from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

from backend.api.upload import router as upload_router
from backend.api.download import router as download_router
from backend.api.convert import router as convert_router
from backend.api.health import router as health_router

app = FastAPI()

# ✅ CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later: restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Optional HTTPS redirect (security requirement)
# app.add_middleware(HTTPSRedirectMiddleware)

# ✅ Route registration
app.include_router(upload_router)
app.include_router(download_router)
app.include_router(convert_router)
app.include_router(health_router)

@app.get("/")
async def root():
    return {"message": "Converty API running"}
