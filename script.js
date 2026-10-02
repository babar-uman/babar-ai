let recognition;

function startVoice() {
  const prompt = document.getElementById("prompt");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    document.getElementById("output").innerText =
      "Voice input is not supported in this browser.";
    return;
  }

  recognition = new SpeechRecognition();

  recognition.lang = "ur-PK";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = function () {
    document.getElementById("output").innerText =
      "🎙️ Listening...";
  };

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;

    prompt.value = text;

    document.getElementById("output").innerText =
      "Voice command received:\n\n" + text;
  };

  recognition.onerror = function () {
    document.getElementById("output").innerText =
      "Voice input error. Please try again.";
  };

  recognition.start();
}


function generateIdea() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (prompt.trim() === "") {
    output.innerText = "Please enter your idea first.";
    return;
  }

  output.innerText =
    "Babar AI is processing your request...\n\n" +
    "Your command:\n" +
    prompt;
}
