let recognition;
let finalTranscript = "";


// ========================================
// Babar AI Core Connection
// ========================================

let babarCore = null;


function initializeBabarAI() {

  try {

    // BabarCore should already be loaded on the page.
    if (typeof BabarCore === "undefined") {

      console.warn(
        "BabarCore is not loaded yet."
      );

      return false;

    }


    babarCore = new BabarCore();

    return true;

  } catch (error) {

    console.error(
      "Failed to initialize Babar AI:",
      error
    );

    return false;

  }

}


// Initialize when page loads.
document.addEventListener(
  "DOMContentLoaded",
  function () {

    initializeBabarAI();

  }
);


// ========================================
// Voice Recognition
// ========================================

function startVoice() {

  const prompt =
    document.getElementById("prompt");

  const output =
    document.getElementById("output");


  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if (!SpeechRecognition) {

    output.innerText =
      "❌ Speech Recognition is not supported in this browser.";

    return;

  }


  finalTranscript = "";


  recognition =
    new SpeechRecognition();


  recognition.lang = "en-US";

  recognition.continuous = false;

  recognition.interimResults = true;

  recognition.maxAlternatives = 1;


  recognition.onstart =
    function () {

      output.innerText =
        "🎙️ Listening...\n\nPlease speak now.";

    };


  recognition.onaudiostart =
    function () {

      output.innerText =
        "🎙️ Microphone active...\n\nPlease speak now.";

    };


  recognition.onspeechstart =
    function () {

      output.innerText =
        "🗣️ Speech detected...\n\nKeep speaking.";

    };


  recognition.onresult =
    function (event) {

      let text = "";


      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        text +=
          event.results[i][0].transcript;


        if (
          event.results[i].isFinal
        ) {

          finalTranscript +=
            event.results[i][0].transcript +
            " ";

        }

      }


      prompt.value =
        finalTranscript || text;


      output.innerText =
        "✅ Voice detected:\n\n" +
        (finalTranscript || text);

    };


  recognition.onnomatch =
    function () {

      output.innerText =
        "⚠️ Voice detected, but no words were recognized.";

    };


  recognition.onerror =
    function (event) {

      output.innerText =
        "❌ Voice error:\n\n" +
        event.error;

    };


  recognition.onspeechend =
    function () {

      output.innerText =
        "⏹️ Speech ended. Processing...";

    };


  recognition.onend =
    function () {

      if (
        finalTranscript.trim() !== ""
      ) {

        prompt.value =
          finalTranscript.trim();


        output.innerText =
          "✅ Voice command received:\n\n" +
          finalTranscript.trim();

      } else {

        output.innerText =
          "⚠️ Recognition ended without receiving text.";

      }

    };


  try {

    recognition.start();

  } catch (error) {

    output.innerText =
      "❌ Could not start voice recognition:\n\n" +
      error.message;

  }

}


// ========================================
// Generate / Process Command
// ========================================

async function generateIdea() {

  const promptElement =
    document.getElementById("prompt");

  const output =
    document.getElementById("output");


  const prompt =
    promptElement.value.trim();


  if (prompt === "") {

    output.innerText =
      "Please enter your idea first.";

    return;

  }


  output.innerText =
    "Babar AI is processing your request...\n\n" +
    "Your command:\n" +
    prompt;


  try {

    // Make sure BabarCore is available.
    if (!babarCore) {

      const initialized =
        initializeBabarAI();


      if (!initialized) {

        output.innerText =
          "⚠️ Babar AI Core is not connected yet.\n\n" +
          "The interface is working, but the Core system " +
          "has not been loaded by index.html.";

        return;

      }

    }


    // Create a command through BabarCore.
    const command =
      babarCore.createCommand(
        "conversation",
        {
          prompt: prompt
        }
      );


    // Store the user's request in memory.
    if (
      typeof babarCore.addConversationMessage ===
      "function"
    ) {

      babarCore.addConversationMessage(
        "user",
        prompt
      );

    }


    output.innerText =
      "✅ Command created successfully.\n\n" +
      "Babar AI received:\n" +
      prompt +
      "\n\n" +
      "Command ID:\n" +
      (command.id || "N/A");


  } catch (error) {

    console.error(
      "Babar AI command error:",
      error
    );


    output.innerText =
      "❌ Babar AI encountered an error.\n\n" +
      error.message;

  }

}
