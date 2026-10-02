let recognition;
let finalTranscript = "";


// ========================================
// Babar AI System
// ========================================

let babarCore = null;
let shortTermMemory = null;
let longTermMemory = null;
let memoryManager = null;
let conversationMemory = null;
let skillRegistry = null;
let skillManager = null;
let permissionManager = null;
let commandRouter = null;
let executionLogger = null;
let commandExecutor = null;
let activityLog = null;


// ========================================
// Initialize Babar AI
// ========================================

function initializeBabarAI() {

  try {

    // ------------------------------------
    // Memory
    // ------------------------------------

    shortTermMemory =
      new ShortTermMemory();

    longTermMemory =
      new LongTermMemory();

    memoryManager =
      new MemoryManager(
        shortTermMemory,
        longTermMemory
      );

    conversationMemory =
      new ConversationMemory(
        memoryManager
      );


    // ------------------------------------
    // Skills
    // ------------------------------------

    skillRegistry =
      new SkillRegistry();

    skillManager =
      new SkillManager(
        skillRegistry
      );


    // ------------------------------------
    // Permission
    // ------------------------------------

    permissionManager =
      new PermissionManager();


    // ------------------------------------
    // Core
    // ------------------------------------

    babarCore =
      new BabarCore(
        {},
        memoryManager,
        conversationMemory
      );


    // ------------------------------------
    // Router
    // ------------------------------------

    commandRouter =
      new CommandRouter(
        babarCore,
        skillManager,
        permissionManager
      );


    // ------------------------------------
    // Execution Logger
    // ------------------------------------

    executionLogger =
      new ExecutionLogger();


    // ------------------------------------
    // Command Executor
    // ------------------------------------

    commandExecutor =
      new CommandExecutor(
        commandRouter,
        executionLogger
      );


    // ------------------------------------
    // Activity Log
    // ------------------------------------

    activityLog =
      new ActivityLog(
        executionLogger
      );


    console.log(
      "Babar AI initialized successfully."
    );


    return true;

  } catch (error) {

    console.error(
      "Babar AI initialization failed:",
      error
    );


    babarCore = null;

    return false;

  }

}


// ========================================
// Page Initialization
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const initialized =
      initializeBabarAI();


    const output =
      document.getElementById("output");


    if (!output) {
      return;
    }


    if (initialized) {

      output.innerText =
        "Babar AI is ready.\n\n" +
        "Enter a command or use Voice.";

    } else {

      output.innerText =
        "⚠️ Babar AI could not initialize.\n\n" +
        "Please check the Core files.";

    }

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


  recognition.lang =
    "en-US";


  recognition.continuous =
    false;


  recognition.interimResults =
    true;


  recognition.maxAlternatives =
    1;


  recognition.onstart =
    function () {

      output.innerText =
        "🎙️ Listening...\n\n" +
        "Please speak now.";

    };


  recognition.onaudiostart =
    function () {

      output.innerText =
        "🎙️ Microphone active...\n\n" +
        "Please speak now.";

    };


  recognition.onspeechstart =
    function () {

      output.innerText =
        "🗣️ Speech detected...\n\n" +
        "Keep speaking.";

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
        "⏹️ Speech ended.";

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
// Generate / Create Command
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


  // Make sure Babar AI is initialized.
  if (!babarCore) {

    const initialized =
      initializeBabarAI();


    if (!initialized) {

      output.innerText =
        "❌ Babar AI could not initialize.\n\n" +
        "Please check the Core files.";

      return;

    }

  }


  output.innerText =
    "Babar AI is processing your request...";


  try {

    // ------------------------------------
    // Save user message
    // ------------------------------------

    const memoryResult =
      babarCore.addUserMessage(
        prompt
      );


    if (
      memoryResult &&
      memoryResult.success === false
    ) {

      console.warn(
        "Could not save user message:",
        memoryResult.message
      );

    }


    // ------------------------------------
    // Create proper Babar AI command
    // ------------------------------------

    const command =
      babarCore.createCommand(
        "conversation",
        "process",
        "babar-ai",
        {
          prompt:
            prompt
        }
      );


    // ------------------------------------
    // Show command information
    // ------------------------------------

    output.innerText =
      "✅ Babar AI received your request.\n\n" +

      "Command:\n" +
      prompt +
      "\n\n" +

      "Command ID:\n" +
      command.id;


    console.log(
      "Babar AI Command:",
      command
    );


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
