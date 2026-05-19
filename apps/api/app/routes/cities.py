from fastapi import APIRouter, Query
from app.db import get_supabase

router = APIRouter()

@router.get("")
async def search_cities(q: str = Query(..., min_length=1), limit: int = 8):
    """
    Fuzzy city search using pg_trgm.
    GET /api/cities?q=chennai
    """
    sb = get_supabase()
    result = (
        sb.rpc("search_cities", {"query": q, "result_limit": limit})
        .execute()
    )
    return result.data or []
