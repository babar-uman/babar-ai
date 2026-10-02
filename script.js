let recognition;

function startVoice() {
  const prompt = document.getElementById("prompt");
  const output = document.getElementById("output");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output.innerText =
      "Voice recognition is not supported in this browser.";
    return;
  }

  recognition = new SpeechRecognition();

  recognition.lang = "ur-PK";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = function () {
    output.innerText = "🎙️ Listening... بولیں";
  };

  recognition.onresult = function (event) {
    let text = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }

    prompt.value = text;

    output.innerText =
      "🎙️ آپ نے کہا:\n\n" + text;
  };

  recognition.onerror = function (event) {
    output.innerText =
      "Voice error: " + event.error;
  };

  recognition.onend = function () {
    if (prompt.value.trim() !== "") {
      output.innerText =
        "Voice command received:\n\n" + prompt.value;
    }
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
