class BabarCore {
  constructor(config = {}) {
    this.name = config.name || "Babar AI";
    this.version = config.version || "0.1.0";

    this.language = config.language || {
      default: "en",
      supported: ["en", "ur"],
      auto_detect: true
    };

    this.memory = config.memory || {
      enabled: true
    };

    this.skills = new Map();
    this.agents = new Map();
  }

  registerSkill(name, skill) {
    if (!name || !skill) {
      throw new Error("Invalid skill registration.");
    }

    this.skills.set(name, skill);

    return {
      success: true,
      message: `Skill registered: ${name}`
    };
  }

  registerAgent(name, agent) {
    if (!name || !agent) {
      throw new Error("Invalid agent registration.");
    }

    this.agents.set(name, agent);

    return {
      success: true,
      message: `Agent registered: ${name}`
    };
  }

  createCommand(type, action, target = "", parameters = {}) {
    return {
      id: this.generateId(),
      type,
      action,
      target,
      parameters,
      requires_permission: true,
      priority: "normal",
      source: "core",
      timestamp: new Date().toISOString()
    };
  }

  async executeCommand(command) {
    if (!command || !command.type) {
      return {
        success: false,
        message: "Invalid command."
      };
    }

    return {
      success: true,
      message: "Command received by Babar AI Core.",
      data: {
        command
      }
    };
  }

  generateId() {
    return (
      "babar-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).substring(2, 8)
    );
  }

  getStatus() {
    return {
      name: this.name,
      version: this.version,
      skills: this.skills.size,
      agents: this.agents.size,
      language: this.language.default,
      memory: this.memory.enabled
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = BabarCore;
}
