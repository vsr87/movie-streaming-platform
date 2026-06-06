const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface HistoryApiRecord {
  id: string;
  userId: string;
  movieId: string;
  watchedAt?: string;
  watched_at?: string;
  last_position: number;
  is_completed: boolean;
  is_hidden: boolean;
  title?: string;
}

export interface HistoryApiResponse {
  message?: string;
  data: HistoryApiRecord[];
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? data.error ?? "Erro inesperado");
  }

  return data;
}

export async function getHistoryByUserId(userId: string): Promise<HistoryApiRecord[]> {
  const response = await fetch(`${API_URL}/history/${userId}`);
  const data = await parseResponse<HistoryApiResponse>(response);

  return data.data ?? [];
}