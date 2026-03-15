// Data API disabled for standalone deployment
// This feature requires Manus Forge API which is not available in standalone mode

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

export async function callDataApi(
  apiId: string,
  options: DataApiCallOptions = {}
): Promise<unknown> {
  console.warn(
    `[Data API] Feature disabled in standalone mode. API: ${apiId}`
  );

  return { data: [] };
}
