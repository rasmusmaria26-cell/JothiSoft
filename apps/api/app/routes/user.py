from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.db import get_supabase

router = APIRouter()

@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    """GET /api/user/profile — returns user + plan from Supabase."""
    sb = get_supabase()
    user_id = user.get("sub")
    result = (
        sb.table("users")
        .select("*, subscriptions(plan, expires_at)")
        .eq("id", user_id)
        .single()
        .execute()
    )
    return result.data
