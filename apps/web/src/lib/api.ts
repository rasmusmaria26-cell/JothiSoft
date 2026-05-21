import { createBrowserClient } from '@supabase/ssr';
import { useToastStore } from '@/store/toastStore';

const getAuthHeaders = async () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return headers;
};

const handleResponseError = async (res: Response) => {
  let message = 'Request failed';
  try {
    const err = await res.json();
    if (err.message) {
      message = err.message;
    } else if (err.error) {
      if (typeof err.error === 'object') {
        const msgTa = err.error.message_ta || err.error.message;
        const msgEn = err.error.message_en || err.error.message;
        if (msgTa && msgEn && msgTa !== msgEn) {
          message = `${msgEn} · ${msgTa}`;
        } else {
          message = msgEn || msgTa || message;
        }
      } else if (typeof err.error === 'string') {
        message = err.error;
      }
    }
  } catch (e) {
    // fallback if no JSON body
  }

  if (res.status === 429) {
    useToastStore.getState().addToast(
      'Too many requests — please wait a moment · மிக அதிகமான கோரிக்கைகள் — சிறிது நேரம் காத்திருக்கவும்',
      'warning'
    );
  } else if (res.status >= 500 && res.status !== 503) {
    useToastStore.getState().addToast(
      'Server error — please try again later · சேவையகப் பிழை — பின்னர் மீண்டும் முயற்சிக்கவும்',
      'error'
    );
  } else if (res.status !== 503) {
    useToastStore.getState().addToast(
      message,
      'error'
    );
  }

  const customError = new Error(message) as any;
  customError.status = res.status;
  throw customError;
};

const getBaseUrl = (): string => {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`;
  }
  return baseUrl;
};

const api = {
  get: async <T = any>(endpoint: string): Promise<T> => {
    const headers = await getAuthHeaders();
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      await handleResponseError(res);
    }
    return res.json();
  },
  post: async <T = any>(endpoint: string, body?: any): Promise<T> => {
    const headers = await getAuthHeaders();
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      await handleResponseError(res);
    }
    return res.json();
  },
  put: async <T = any>(endpoint: string, body?: any): Promise<T> => {
    const headers = await getAuthHeaders();
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      await handleResponseError(res);
    }
    return res.json();
  },
  delete: async <T = any>(endpoint: string): Promise<T> => {
    const headers = await getAuthHeaders();
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) {
      await handleResponseError(res);
    }
    return res.json();
  },
};

export default api;

