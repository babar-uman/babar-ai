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
