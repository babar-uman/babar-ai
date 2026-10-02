class PermissionManager {

  constructor() {
    this.permissions = new Map();

    this.defaultLevel = "ask";

    this.levels = [
      "none",
      "ask",
      "required"
    ];
  }


  setPermission(action, level = "ask") {

    if (!action) {
      throw new Error("Permission action is required.");
    }

    if (!this.levels.includes(level)) {
      throw new Error(`Invalid permission level: ${level}`);
    }

    this.permissions.set(action, level);

    return {
      success: true,
      action: action,
      level: level
    };
  }


  getPermission(action) {

    return (
      this.permissions.get(action) ||
      this.defaultLevel
    );

  }


  requiresPermission(action) {

    const level = this.getPermission(action);

    return level !== "none";

  }


  canExecute(action, confirmed = false) {

    const level = this.getPermission(action);


    // No permission required
    if (level === "none") {

      return {
        allowed: true,
        reason: "No permission required."
      };

    }


    // Permission required
    if (level === "required") {

      if (!confirmed) {

        return {
          allowed: false,
          reason: "User confirmation is required."
        };

      }

      return {
        allowed: true,
        reason: "User confirmation received."
      };

    }


    // Ask level
    if (level === "ask") {

      if (!confirmed) {

        return {
          allowed: false,
          reason: "Permission request required."
        };

      }

      return {
        allowed: true,
        reason: "Permission granted by user."
      };

    }


    return {
      allowed: false,
      reason: "Permission denied."
    };

  }


  removePermission(action) {

    if (!this.permissions.has(action)) {

      return {
        success: false,
        message: `Permission not found: ${action}`
      };

    }

    this.permissions.delete(action);

    return {
      success: true,
      message: `Permission removed: ${action}`
    };

  }


  listPermissions() {

    const result = [];

    for (const [action, level] of this.permissions) {

      result.push({
        action: action,
        level: level
      });

    }

    return result;

  }


  clearPermissions() {

    this.permissions.clear();

    return {
      success: true,
      message: "All permissions cleared."
    };

  }


  getStatus() {

    return {

      defaultLevel:
        this.defaultLevel,

      totalPermissions:
        this.permissions.size,

      levels:
        this.levels

    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {
  window.PermissionManager = PermissionManager;
}


// Node.js version
if (typeof module !== "undefined" && module.exports) {
  module.exports = PermissionManager;
}
