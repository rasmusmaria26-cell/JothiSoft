from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

bearer_scheme = HTTPBearer()

PLAN_RANK = {"FREE": 0, "PRO": 1, "PREMIUM": 2}

# ---------------------------------------------------------------------------
# Extract and verify the Supabase JWT from the Authorization header
# ---------------------------------------------------------------------------
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    token = credentials.credentials
    try:
        # Supabase JWTs are signed with the JWT secret from project settings
        payload = jwt.decode(
            token,
            os.getenv("SUPABASE_JWT_SECRET", ""),
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


# ---------------------------------------------------------------------------
# Subscription gating — use as a FastAPI dependency on protected routes
# Usage: user = Depends(require_plan("PRO"))
# ---------------------------------------------------------------------------
def require_plan(required: str):
    async def check(user: dict = Depends(get_current_user)) -> dict:
        # Plan is stored in JWT app_metadata by the Supabase webhook handler
        user_plan = (
            user.get("app_metadata", {}).get("plan", "FREE")
            or user.get("user_metadata", {}).get("plan", "FREE")
            or "FREE"
        )
        if PLAN_RANK.get(user_plan, 0) < PLAN_RANK.get(required, 0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "plan_required",
                    "required": required,
                    "current": user_plan,
                    "upgrade_url": "/upgrade",
                },
            )
        return user
    return check
