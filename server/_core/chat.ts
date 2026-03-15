// Chat feature disabled for standalone deployment
// This feature requires Manus Forge API which is not available in standalone mode

import type { Express } from "express";

export function registerChatRoutes(app: Express) {
  app.post("/api/chat", (req, res) => {
    console.log("[Chat] Feature disabled in standalone mode");
    res.status(503).json({
      error: "Chat feature is disabled in standalone mode",
    });
  });
}

export const tools = {};
