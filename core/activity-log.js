class ActivityLog {

  constructor(executionLogger = null) {

    this.executionLogger =
      executionLogger;

  }


  setLogger(executionLogger) {

    this.executionLogger =
      executionLogger;


    return {

      success: true,

      message:
        "Execution Logger connected."

    };

  }


  getAll() {

    if (!this.executionLogger) {

      return [];

    }


    return this.executionLogger.getLogs();

  }


  getRecent(limit = 20) {

    if (!this.executionLogger) {

      return [];

    }


    return this.executionLogger.getRecent(
      limit
    );

  }


  getByCommandId(commandId) {

    if (!this.executionLogger) {

      return [];

    }


    return this.executionLogger.getByCommandId(
      commandId
    );

  }


  getById(id) {

    if (!this.executionLogger) {

      return null;

    }


    return this.executionLogger.getById(
      id
    );

  }


  getSuccessful() {

    return this.getAll().filter(
      log =>
        log.success === true
    );

  }


  getFailed() {

    return this.getAll().filter(
      log =>
        log.success === false
    );

  }


  getPermissionRequired() {

    return this.getAll().filter(
      log =>
        log.permission_required === true
    );

  }


  count() {

    return this.getAll().length;

  }


  clear() {

    if (!this.executionLogger) {

      return {

        success: false,

        message:
          "Execution Logger is not connected."

      };

    }


    return this.executionLogger.clear();

  }


  getSummary() {

    const logs =
      this.getAll();


    const successful =
      logs.filter(
        log =>
          log.success === true
      ).length;


    const failed =
      logs.filter(
        log =>
          log.success === false
      ).length;


    const permissionRequired =
      logs.filter(
        log =>
          log.permission_required === true
      ).length;


    return {

      total:
        logs.length,

      successful:
        successful,

      failed:
        failed,

      permission_required:
        permissionRequired

    };

  }


  getStatus() {

    return {

      connected:
        this.executionLogger !== null,

      total:
        this.count(),

      summary:
        this.getSummary()

    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {

  window.ActivityLog =
    ActivityLog;

}


// Node.js version
if (typeof module !== "undefined" && module.exports) {

  module.exports =
    ActivityLog;

}
