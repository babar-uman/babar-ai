function generateIdea() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (prompt.trim() === "") {
    output.innerText = "Please enter your idea first.";
    return;
  }

  output.innerText =
    "Your project idea:\n\n" + prompt;
}
