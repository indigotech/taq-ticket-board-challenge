const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL ?? ''}/api/v1`;

interface ErrorBody {
  errors?: Array<{ code: string; message: string }>;
}

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.status = options?.status;
    this.code = options?.code;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch (err) {
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`apiRequest: fetch to ${API_BASE_URL}${path} failed`, err);
    throw new ApiError(`Could not reach the server (${detail}) at ${API_BASE_URL}${path}`);
  }

  if (!response.ok) {
    const body: ErrorBody = await response.json().catch(() => ({}));
    const error = body.errors?.[0];
    throw new ApiError(error?.message ?? `Request failed with status ${response.status}`, {
      status: response.status,
      code: error?.code,
    });
  }

  return response.json();
}
