class BabarCore {

  constructor(config = {}, memoryManager = null) {

    this.name =
      config.name || "Babar AI";

    this.version =
      config.version || "0.1.0";


    this.language =
      config.language || {
        default: "en",
        supported: ["en", "ur"],
        auto_detect: true
      };


    this.memory =
      config.memory || {
        enabled: true
      };


    this.memoryManager =
      memoryManager;


    this.skills =
      new Map();


    this.agents =
      new Map();

  }


  setMemoryManager(memoryManager) {

    this.memoryManager =
      memoryManager;


    return {

      success: true,

      message:
        "Memory Manager connected."

    };

  }


  registerSkill(name, skill) {

    if (!name || !skill) {

      throw new Error(
        "Invalid skill registration."
      );

    }


    this.skills.set(
      name,
      skill
    );


    return {

      success: true,

      message:
        `Skill registered: ${name}`

    };

  }


  registerAgent(name, agent) {

    if (!name || !agent) {

      throw new Error(
        "Invalid agent registration."
      );

    }


    this.agents.set(
      name,
      agent
    );


    return {

      success: true,

      message:
        `Agent registered: ${name}`

    };

  }


  createCommand(
    type,
    action,
    target = "",
    parameters = {}
  ) {

    return {

      id:
        this.generateId(),

      type:
        type,

      action:
        action,

      target:
        target,

      parameters:
        parameters,

      requires_permission:
        true,

      priority:
        "normal",

      source:
        "core",

      timestamp:
        new Date().toISOString()

    };

  }


  async executeCommand(command) {

    if (!command || !command.type) {

      return {

        success: false,

        message:
          "Invalid command."

      };

    }


    return {

      success: true,

      message:
        "Command received by Babar AI Core.",

      data: {

        command:
          command

      }

    };

  }


  remember(
    key,
    value,
    category = "general",
    metadata = {}
  ) {

    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.remember(
      key,
      value,
      category,
      metadata
    );

  }


  recall(key) {

    if (!this.memoryManager) {

      return null;

    }


    return this.memoryManager.recall(
      key
    );

  }


  knows(key) {

    if (!this.memoryManager) {

      return false;

    }


    return this.memoryManager.knows(
      key
    );

  }


  searchMemory(query) {

    if (!this.memoryManager) {

      return [];

    }


    return this.memoryManager.searchMemory(
      query
    );

  }


  addUserMessage(
    content,
    metadata = {}
  ) {

    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.addUserMessage(
      content,
      metadata
    );

  }


  addAssistantMessage(
    content,
    metadata = {}
  ) {

    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.addAssistantMessage(
      content,
      metadata
    );

  }


  getRecentConversation(
    limit = 10
  ) {

    if (!this.memoryManager) {

      return [];

    }


    return this.memoryManager.getRecentConversation(
      limit
    );

  }


  forget(key) {

    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.forget(
      key
    );

  }


  getMemoryStatus() {

    if (!this.memoryManager) {

      return {

        connected: false

      };

    }


    return {

      connected: true,

      status:
        this.memoryManager.getStatus()

    };

  }


  generateId() {

    return (

      "babar-" +

      Date.now().toString(36) +

      "-" +

      Math.random()
        .toString(36)
        .substring(2, 8)

    );

  }


  getStatus() {

    return {

      name:
        this.name,

      version:
        this.version,

      skills:
        this.skills.size,

      agents:
        this.agents.size,

      language:
        this.language.default,

      memory:
        this.memory.enabled,

      memory_manager_connected:
        this.memoryManager !== null

    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {

  window.BabarCore =
    BabarCore;

}


// Node.js version
if (
  typeof module !== "undefined" &&
  module.exports
) {

  module.exports =
    BabarCore;

}
