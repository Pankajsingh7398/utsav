// Voice transcription disabled for standalone deployment
// This feature requires Manus Forge API which is not available in standalone mode

export interface TranscriptionResult {
  text: string;
  language?: string;
  segments?: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  }>;
}

export async function transcribeAudio(options: {
  audioUrl: string;
  language?: string;
  prompt?: string;
}): Promise<TranscriptionResult> {
  console.warn(
    "[Voice Transcription] Feature disabled in standalone mode. Returning mock result."
  );

  return {
    text: "Voice transcription is not available in standalone mode. Please use the Manus hosted version for this feature.",
    language: "en",
  };
}
