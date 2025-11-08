export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = import.meta.env.VITE_API_URL as string;
  const apiKey = import.meta.env.VITE_API_KEY as string;

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}
