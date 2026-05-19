from dotenv import load_dotenv
import os

# Load env variables before importing local modules that depend on them
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers.calc import router as calc_router
from app.services.ephemeris import ensure_ephemeris_files



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: ensure ephemeris files are downloaded before serving requests."""
    print("[startup] Checking Swiss Ephemeris data files …")
    ensure_ephemeris_files()
    print("[startup] Ephemeris ready. JothiSoft API is live.")
    yield
    print("[shutdown] JothiSoft API shutting down.")


app = FastAPI(
    title="JothiSoft API",
    description="Tamil Astrology calculation engine — Panchangam, Jathagam, Porutham, Numerology",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.user import router as user_router
from app.routes.cities import router as cities_router

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(calc_router)
app.include_router(user_router, prefix="/api/user", tags=["user"])
app.include_router(cities_router, prefix="/api/cities", tags=["cities"])


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "jothisoft-api", "version": "0.2.0"}
