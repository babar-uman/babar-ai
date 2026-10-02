// ========================================
// Babar AI Backend Server
// ========================================

const http = require("http");


// ========================================
// Configuration
// ========================================

const HOST =
  process.env.HOST || "127.0.0.1";

const PORT =
  Number(process.env.PORT) || 3000;


// ========================================
// JSON Response Helper
// ========================================

function sendJson(
  response,
  statusCode,
  data
) {

  const body =
    JSON.stringify(data);


  response.writeHead(
    statusCode,
    {
      "Content-Type":
        "application/json; charset=utf-8",

      "Content-Length":
        Buffer.byteLength(body)
    }
  );


  response.end(body);

}


// ========================================
// Read Request Body
// ========================================

function readRequestBody(request) {

  return new Promise(
    (resolve, reject) => {

      let body = "";


      request.on(
        "data",
        chunk => {

          body +=
            chunk.toString();

        }
      );


      request.on(
        "end",
        () => {

          if (!body) {

            resolve({});

            return;

          }


          try {

            const data =
              JSON.parse(body);


            resolve(data);

          } catch (error) {

            reject(
              new Error(
                "Invalid JSON request body."
              )
            );

          }

        }
      );


      request.on(
        "error",
        reject
      );

    }
  );

}


// ========================================
// Health Check
// ========================================

function handleHealthCheck(
  response
) {

  sendJson(
    response,
    200,
    {
      success: true,

      service:
        "Babar AI Backend",

      status:
        "online",

      version:
        "0.1.0"
    }
  );

}


// ========================================
// AI Request Handler
// ========================================

async function handleAIRequest(
  request,
  response
) {

  try {

    const body =
      await readRequestBody(
        request
      );


    const prompt =
      typeof body.prompt === "string"
        ? body.prompt.trim()
        : "";


    if (!prompt) {

      sendJson(
        response,
        400,
        {
          success: false,

          message:
            "Prompt is required."
        }
      );

      return;

    }


    // ------------------------------------
    // Temporary response
    // ------------------------------------
    // Real AI provider will be connected
    // in the next backend step.

    sendJson(
      response,
      200,
      {
        success: true,

        message:
          "AI request received.",

        response:
          "Babar AI received your request and is ready for AI processing.",

        prompt:
          prompt
      }
    );

  } catch (error) {

    console.error(
      "AI request error:",
      error
    );


    sendJson(
      response,
      500,
      {
        success: false,

        message:
          "Backend could not process the request."
      }
    );

  }

}


// ========================================
// HTTP Server
// ========================================

const server =
  http.createServer(
    async (
      request,
      response
    ) => {

      // ----------------------------------
      // CORS
      // ----------------------------------

      response.setHeader(
        "Access-Control-Allow-Origin",
        "*"
      );

      response.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
      );

      response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
      );


      // ----------------------------------
      // OPTIONS
      // ----------------------------------

      if (
        request.method === "OPTIONS"
      ) {

        response.writeHead(
          204
        );

        response.end();

        return;

      }


      // ----------------------------------
      // Health Check
      // ----------------------------------

      if (
        request.method === "GET" &&
        request.url === "/health"
      ) {

        handleHealthCheck(
          response
        );

        return;

      }


      // ----------------------------------
      // AI Endpoint
      // ----------------------------------

      if (
        request.method === "POST" &&
        request.url === "/api/ai"
      ) {

        await handleAIRequest(
          request,
          response
        );

        return;

      }


      // ----------------------------------
      // Not Found
      // ----------------------------------

      sendJson(
        response,
        404,
        {
          success: false,

          message:
            "Endpoint not found."
        }
      );

    }
  );


// ========================================
// Start Server
// ========================================

server.listen(
  PORT,
  HOST,
  () => {

    console.log(
      `Babar AI Backend running at http://${HOST}:${PORT}`
    );

  }
);


// ========================================
// Server Error Handling
// ========================================

server.on(
  "error",
  error => {

    console.error(
      "Babar AI Backend error:",
      error
    );

  }
);


// ========================================
// Graceful Shutdown
// ========================================

function shutdown() {

  console.log(
    "Shutting down Babar AI Backend..."
  );


  server.close(
    () => {

      process.exit(0);

    }
  );

}


process.on(
  "SIGINT",
  shutdown
);


process.on(
  "SIGTERM",
  shutdown
);
