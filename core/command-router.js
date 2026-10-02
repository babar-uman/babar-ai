class CommandRouter {

  constructor(core, skillManager = null, permissionManager = null) {

    this.core = core;
    this.skillManager = skillManager;
    this.permissionManager = permissionManager;

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


  setPermissionManager(permissionManager) {

    this.permissionManager = permissionManager;

    return {
      success: true,
      message: "Permission Manager connected."
    };

  }


  async route(command, confirmed = false) {

    if (!command || !command.type) {

      return {
        success: false,
        message: "Invalid command."
      };

    }


    // Permission check
    if (this.permissionManager) {

      const permissionAction =
        this.getPermissionAction(command);


      const permissionResult =
        this.permissionManager.canExecute(
          permissionAction,
          confirmed
        );


      if (!permissionResult.allowed) {

        return {

          success: false,

          permission_required: true,

          action:
            permissionAction,

          message:
            permissionResult.reason,

          command:
            command

        };

      }

    }


    // Skill commands
    if (command.type === "skill") {

      return await this.routeSkill(command);

    }


    // Registered routes
    const handler =
      this.routes.get(command.type);


    if (!handler) {

      return {

        success: false,

        message:
          `No handler registered for: ${command.type}`,

        command:
          command

      };

    }


    try {

      const result =
        await handler(command);


      // Preserve handler failures.
      // Do not convert success:false into success:true.
      if (result && result.success === false) {

        return result;

      }


      return {

        success: true,

        message:
          "Command routed successfully.",

        data:
          result

      };

    } catch (error) {

      return {

        success: false,

        message:
          "Command execution failed.",

        error:
          error.message

      };

    }

  }


  getPermissionAction(command) {

    if (command.permission_action) {

      return command.permission_action;

    }


    if (command.type === "skill") {

      const skill =
        command.target || "unknown";

      return `skill.${skill}`;

    }


    return `${command.type}.${command.action || "execute"}`;

  }


  async routeSkill(command) {

    if (!this.skillManager) {

      return {

        success: false,

        message:
          "Skill Manager is not connected."

      };

    }


    const skillName =
      command.target ||
      command.parameters?.skill ||
      "";


    if (!skillName) {

      return {

        success: false,

        message:
          "No skill specified."

      };

    }


    return await this.skillManager.execute(
      skillName,
      command
    );

  }


  getRoutes() {

    return Array.from(
      this.routes.keys()
    );

  }


  getStatus() {

    return {

      routes:
        this.getRoutes(),

      skillManagerConnected:
        this.skillManager !== null,

      permissionManagerConnected:
        this.permissionManager !== null

    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {

  window.CommandRouter =
    CommandRouter;

}


// Node.js version
if (typeof module !== "undefined" && module.exports) {

  module.exports =
    CommandRouter;

}
