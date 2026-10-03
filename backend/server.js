const http = require("http");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;

      if (body.length > 1024 * 1024) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

async function generateAIResponse(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text:
              "You are Babar AI, a helpful personal AI assistant. " +
              "Give clear, practical and accurate answers. " +
              "When the user asks for coding help, provide complete " +
              "working code when appropriate."
          }
        ]
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `Gemini API request failed with status ${response.status}.`;

    throw new Error(message);
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

  if (!text) {
    throw new Error("AI returned an empty response.");
  }

  return text;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });

    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, {
      success: true,
      service: "Babar AI Backend",
      status: "online",
      aiConfigured: Boolean(GEMINI_API_KEY),
      model: MODEL
    });

    return;
  }

  if (req.method === "POST" && req.url === "/api/ai") {
    try {
      const body = await readBody(req);

      const prompt =
        typeof body.prompt === "string"
          ? body.prompt.trim()
          : "";

      if (!prompt) {
        sendJson(res, 400, {
          success: false,
          message: "Prompt is required."
        });

        return;
      }

      const response = await generateAIResponse(prompt);

      sendJson(res, 200, {
        success: true,
        response,
        model: MODEL
      });

      return;
    } catch (error) {
      sendJson(res, 500, {
        success: false,
        message: error.message || "AI request failed."
      });

      return;
    }
  }

  sendJson(res, 404, {
    success: false,
    message: "Route not found."
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Babar AI backend running at http://${HOST}:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down Babar AI backend...");
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("\nShutting down Babar AI backend...");
  server.close(() => process.exit(0));
});
