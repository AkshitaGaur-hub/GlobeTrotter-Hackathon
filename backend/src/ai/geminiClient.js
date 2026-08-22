import crypto from "crypto";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

export function getRequestHash(payload) {
  return crypto.createHash("md5").update(JSON.stringify(payload)).digest("hex");
}

export async function getCachedAIResponse(requestHash) {
  try {
    const res = await pool.query(
      "SELECT response_json FROM ai_generations WHERE request_hash = $1 LIMIT 1;",
      [requestHash]
    );
    if (res.rows.length > 0) {
      console.log(`[AI Cache Hit] Hash: ${requestHash}`);
      return res.rows[0].response_json;
    }
  } catch (err) {
    console.warn("AI Cache query warning:", err.message);
  }
  return null;
}

export async function saveAIResponse(tripId, requestHash, responseJson) {
  try {
    await pool.query(
      `INSERT INTO ai_generations (trip_id, request_hash, response_json)
       VALUES ($1, $2, $3);`,
      [tripId, requestHash, JSON.stringify(responseJson)]
    );
  } catch (err) {
    console.warn("AI Cache save warning:", err.message);
  }
}

/**
 * Robust Gemini AI caller supporting Free Tier with JSON output
 */
export async function callGeminiJSON(prompt, systemInstruction = "") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_api_key_here") {
    throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nTask:\n${prompt}\n\nIMPORTANT: Return ONLY valid, raw JSON. Do not include markdown code block backticks.` }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: "application/json"
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error [${response.status}]:`, errorText);
      if (response.status === 429) {
        throw new Error("GEMINI_RATE_LIMIT_429");
      }
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty response received from Gemini.");
    }

    // Clean any accidental markdown wrap
    const cleaned = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("GEMINI_TIMEOUT");
    }
    throw err;
  }
}
