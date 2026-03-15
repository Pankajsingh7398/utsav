// Maps feature disabled for standalone deployment
// This feature requires Manus Forge API which is not available in standalone mode

export type LatLng = {
  lat: number;
  lng: number;
};

export async function makeRequest<T = unknown>(
  endpoint: string,
  params: Record<string, unknown> = {},
  options: { method?: "GET" | "POST"; body?: Record<string, unknown> } = {}
): Promise<T> {
  console.warn(
    `[Maps] Feature disabled in standalone mode. Endpoint: ${endpoint}`
  );

  return { status: "disabled" } as T;
}
