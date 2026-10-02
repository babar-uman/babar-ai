class CommandRouter {
  constructor(core, skillManager = null) {
    this.core = core;
    this.skillManager = skillManager;
    this.routes = new Map();
  }

  register(type, handler) {
    if (!type || typeof handler !== "function") {
      throw new Error("Invalid route registration.");
    }

    this.routes.set(type, handler);

    return {
      success: true,
      message: `Route registered: ${type}`
    };
  }

  setSkillManager(skillManager) {
    this.skillManager = skillManager;

    return {
      success: true,
      message: "Skill Manager connected."
    };
  }

  async route(command) {
    if (!command || !command.type) {
      return {
        success: false,
        message: "Invalid command."
      };
    }

    // Skill commands
    if (command.type === "skill") {
      return await this.routeSkill(command);
    }

    // Registered routes
    const handler = this.routes.get(command.type);

    if (!handler) {
      return {
        success: false,
        message: `No handler registered for: ${command.type}`,
        command
      };
    }

    try {
      const result = await handler(command);

      return {
        success: true,
        message: "Command routed successfully.",
        data: result
      };

    } catch (error) {
      return {
        success: false,
        message: "Command execution failed.",
        error: error.message
      };
    }
  }

  async routeSkill(command) {
    if (!this.skillManager) {
      return {
        success: false,
        message: "Skill Manager is not connected."
      };
    }

    const skillName =
      command.target ||
      command.parameters?.skill ||
      "";

    if (!skillName) {
      return {
        success: false,
        message: "No skill specified."
      };
    }

    return await this.skillManager.execute(
      skillName,
      command
    );
  }

  getRoutes() {
    return Array.from(this.routes.keys());
  }

  getStatus() {
    return {
      routes: this.getRoutes(),
      skillManagerConnected: this.skillManager !== null
    };
  }
}


if (typeof window !== "undefined") {
  window.CommandRouter = CommandRouter;
}


if (typeof module !== "undefined" && module.exports) {
  module.exports = CommandRouter;
}
