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
// Permission Confirmation State
// ========================================

let pendingCommand = null;


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
    commandExecutor = null;

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
// Create Babar AI Command
// ========================================

function createBabarCommand(prompt) {

  return babarCore.createCommand(
    "conversation",
    "process",
    "babar-ai",
    {
      prompt:
        prompt
    }
  );

}


// ========================================
// Execute Babar AI Command
// ========================================

async function executeBabarCommand(
  command,
  confirmed = false
) {

  return await commandExecutor.execute(
    command,
    confirmed
  );

}


// ========================================
// Generate / Confirm / Execute
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


  // ------------------------------------
  // Make sure Babar AI is initialized
  // ------------------------------------

  if (!babarCore || !commandExecutor) {

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
    "Babar AI is preparing your command...";


  try {

    // ------------------------------------
    // Confirm pending command
    // ------------------------------------

    if (pendingCommand) {

      const pendingPrompt =
        pendingCommand.parameters &&
        pendingCommand.parameters.prompt
          ? pendingCommand.parameters.prompt
          : "";


      if (
        prompt !== pendingPrompt
      ) {

        output.innerText =
          "⚠️ A different command was entered.\n\n" +
          "Please confirm the pending command first.";

        return;

      }


      output.innerText =
        "🔐 Permission confirmed.\n\n" +
        "Executing command...";


      const confirmedCommand =
        pendingCommand;


      pendingCommand =
        null;


      const executionResult =
        await executeBabarCommand(
          confirmedCommand,
          true
        );


      console.log(
        "Confirmed execution result:",
        executionResult
      );


      if (
        !executionResult ||
        executionResult.success !== true
      ) {

        const message =
          executionResult &&
          executionResult.result &&
          executionResult.result.message
            ? executionResult.result.message
            : "Command execution failed.";


        output.innerText =
          "❌ Command failed.\n\n" +
          message;

        return;

      }


      babarCore.addAssistantMessage(
        "Command executed successfully.",
        {
          command_id:
            confirmedCommand.id
        }
      );


      output.innerText =
        "✅ Babar AI command executed successfully.\n\n" +

        "Command:\n" +
        pendingPrompt +
        "\n\n" +

        "Command ID:\n" +
        confirmedCommand.id;


      return;

    }


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
    // Create command
    // ------------------------------------

    const command =
      createBabarCommand(
        prompt
      );


    console.log(
      "Babar AI Command:",
      command
    );


    // ------------------------------------
    // First execution attempt
    // ------------------------------------

    const executionResult =
      await executeBabarCommand(
        command,
        false
      );


    console.log(
      "Babar AI Execution Result:",
      executionResult
    );


    // ------------------------------------
    // Permission required
    // ------------------------------------

    if (
      executionResult &&
      executionResult.result &&
      executionResult.result.permission_required
    ) {

      pendingCommand =
        command;


      output.innerText =
        "🔐 Permission required.\n\n" +

        "Command:\n" +
        prompt +
        "\n\n" +

        "Press Generate again to confirm.";

      return;

    }


    // ------------------------------------
    // Execution failed
    // ------------------------------------

    if (
      !executionResult ||
      executionResult.success !== true
    ) {

      const message =
        executionResult &&
        executionResult.result &&
        executionResult.result.message
          ? executionResult.result.message
          : "Command execution failed.";


      output.innerText =
        "❌ Command failed.\n\n" +
        message;

      return;

    }


    // ------------------------------------
    // Successful execution
    // ------------------------------------

    babarCore.addAssistantMessage(
      "Command executed successfully.",
      {
        command_id:
          command.id
      }
    );


    output.innerText =
      "✅ Babar AI command executed successfully.\n\n" +

      "Command:\n" +
      prompt +
      "\n\n" +

      "Command ID:\n" +
      command.id;


  } catch (error) {

    console.error(
      "Babar AI command error:",
      error
    );


    pendingCommand =
      null;


    output.innerText =
      "❌ Babar AI encountered an error.\n\n" +
      error.message;

  }

}
