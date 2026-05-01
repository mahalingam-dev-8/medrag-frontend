import { env } from '@/config/env';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  // 204 / 205 carry no body — never attempt to parse
  if (res.status === 204 || res.status === 205) return undefined as unknown as T;
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) return res.json() as Promise<T>;
  return undefined as unknown as T;
}

export const httpClient = {
  get: <T>(path: string) =>
    fetch(`${env.apiUrl}${path}`).then(r => handleResponse<T>(r)),

  post: <T>(path: string, body?: unknown) =>
    fetch(`${env.apiUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(r => handleResponse<T>(r)),

  postForm: <T>(path: string, form: FormData) =>
    fetch(`${env.apiUrl}${path}`, { method: 'POST', body: form }).then(r =>
      handleResponse<T>(r)
    ),

  del: <T>(path: string) =>
    fetch(`${env.apiUrl}${path}`, { method: 'DELETE' }).then(r =>
      handleResponse<T>(r)
    ),
};
