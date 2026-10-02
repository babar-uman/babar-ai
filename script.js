let recognition;
let finalTranscript = "";

function startVoice() {
  const prompt = document.getElementById("prompt");
  const output = document.getElementById("output");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output.innerText =
      "❌ Speech Recognition is not supported in this browser.";
    return;
  }

  finalTranscript = "";

  recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = function () {
    output.innerText =
      "🎙️ Listening...\n\nPlease speak now.";
  };

  recognition.onaudiostart = function () {
    output.innerText =
      "🎙️ Microphone active...\n\nPlease speak now.";
  };

  recognition.onspeechstart = function () {
    output.innerText =
      "🗣️ Speech detected...\n\nKeep speaking.";
  };

  recognition.onresult = function (event) {
    let text = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + " ";
      }
    }

    prompt.value = finalTranscript || text;

    output.innerText =
      "✅ Voice detected:\n\n" +
      (finalTranscript || text);
  };

  recognition.onnomatch = function () {
    output.innerText =
      "⚠️ Voice detected, but no words were recognized.";
  };

  recognition.onerror = function (event) {
    output.innerText =
      "❌ Voice error:\n\n" +
      event.error;
  };

  recognition.onspeechend = function () {
    output.innerText =
      "⏹️ Speech ended. Processing...";
  };

  recognition.onend = function () {
    if (finalTranscript.trim() !== "") {
      prompt.value = finalTranscript.trim();

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


function generateIdea() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (prompt.trim() === "") {
    output.innerText =
      "Please enter your idea first.";
    return;
  }

  output.innerText =
    "Babar AI is processing your request...\n\n" +
    "Your command:\n" +
    prompt;
}
