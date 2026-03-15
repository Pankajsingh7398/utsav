// Image generation disabled for standalone deployment
// This feature requires Manus Forge API which is not available in standalone mode

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
};

export type GenerateImageResponse = {
  url?: string;
};

export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  console.warn(
    "[Image Generation] Feature disabled in standalone mode. Returning placeholder."
  );

  return {
    url: "https://via.placeholder.com/512x512?text=Image+Generation+Disabled",
  };
}
