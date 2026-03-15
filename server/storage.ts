// Local file storage for standalone deployment
// Stores files in local filesystem instead of cloud storage

import * as fs from "fs";
import * as path from "path";

const STORAGE_DIR = path.join(process.cwd(), "storage");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  try {
    const key = normalizeKey(relKey);
    const filePath = path.join(STORAGE_DIR, key);
    
    // Create directories if they don't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    if (typeof data === "string") {
      fs.writeFileSync(filePath, data);
    } else {
      fs.writeFileSync(filePath, Buffer.from(data));
    }

    // Return local URL
    const url = `/storage/${key}`;
    return { key, url };
  } catch (error) {
    console.error("[Storage] Upload failed:", error);
    throw new Error(`Storage upload failed: ${error}`);
  }
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  try {
    const key = normalizeKey(relKey);
    const url = `/storage/${key}`;
    return { key, url };
  } catch (error) {
    console.error("[Storage] Get failed:", error);
    throw new Error(`Storage get failed: ${error}`);
  }
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}
