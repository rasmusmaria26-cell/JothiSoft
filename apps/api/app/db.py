from supabase import create_client, Client
import os

_client: Client | None = None

def get_supabase() -> Client:
    global _client
    if _client is None:
        supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
        _client = create_client(
            supabase_url,
            os.getenv("SUPABASE_SERVICE_KEY", ""),  # service role — server only
        )
    return _client
