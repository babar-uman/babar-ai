class CommandRouter {
  constructor(core) {
    this.core = core;
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

  async route(command) {
    if (!command || !command.type) {
      return {
        success: false,
        message: "Invalid command."
      };
    }

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

  getRoutes() {
    return Array.from(this.routes.keys());
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = CommandRouter;
}
