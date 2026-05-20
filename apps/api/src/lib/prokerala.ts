import NodeCache from 'node-cache';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Initialize a NodeCache instance for API responses
// Default TTL is 24 hours (86400 seconds)
export const cache = new NodeCache({ stdTTL: 86400 });

/**
 * Fetch and cache the Prokerala OAuth 2.0 access token.
 */
export const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  
  // Return cached token if valid for at least another 60 seconds
  if (cachedToken && now < tokenExpiry - 60000) {
    return cachedToken;
  }
  
  if (!process.env.PROKERALA_CLIENT_ID || !process.env.PROKERALA_CLIENT_SECRET) {
    throw new Error('Prokerala API credentials are not set in the environment variables.');
  }

  const tokenUrl = process.env.PROKERALA_TOKEN_URL || 'https://api.prokerala.com/token';

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.PROKERALA_CLIENT_ID,
      client_secret: process.env.PROKERALA_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Prokerala token: ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in * 1000);
  
  return cachedToken as string;
};

/**
 * Base fetch function to interact with the Prokerala API.
 * 
 * @param endpoint The API endpoint (e.g., '/astrology/birth-details')
 * @param params Query parameters for the request
 */
export const prokeralaFetch = async (
  endpoint: string,
  params: Record<string, string>
): Promise<any> => {
  const token = await getAccessToken();
  const baseUrl = process.env.PROKERALA_BASE_URL || 'https://api.prokerala.com/v2';
  const url = new URL(`${baseUrl}${endpoint}`);
  
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString(), {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    let errDetail = res.statusText;
    try {
      const err = await res.json();
      if (err.errors && err.errors[0] && err.errors[0].detail) {
        errDetail = err.errors[0].detail;
      }
    } catch (e) {
      // Ignore JSON parse errors on error responses
    }
    const error = new Error(`Prokerala error: ${errDetail}`);
    (error as any).statusCode = res.status;
    throw error;
  }

  return res.json();
};

/**
 * Cached wrapper for prokeralaFetch to reduce API credit usage.
 * 
 * @param endpoint The API endpoint
 * @param params Query parameters
 * @param ttl Time-to-live in seconds (defaults to 24hrs)
 */
export const cachedProkeralaFetch = async (
  endpoint: string,
  params: Record<string, string>,
  ttl?: number
): Promise<any> => {
  // Create a unique cache key based on the endpoint and all parameters
  const key = `prokerala:${endpoint}:${JSON.stringify(params)}`;
  
  const cachedData = cache.get(key);
  if (cachedData) {
    return cachedData;
  }

  const data = await prokeralaFetch(endpoint, params);
  
  // Store in cache (if ttl is 0, node-cache handles it as unlimited)
  cache.set(key, data, ttl ?? 86400);
  
  return data;
};
