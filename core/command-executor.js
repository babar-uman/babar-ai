class CommandExecutor {

  constructor(router) {

    this.router = router;

    this.history = [];

  }


  async execute(command, confirmed = false) {

    if (!command || !command.type) {

      return {

        success: false,

        message: "Invalid command."

      };

    }


    const startTime = Date.now();


    try {

      const result =
        await this.router.route(
          command,
          confirmed
        );


      const executionRecord = {

        command_id:
          command.id || null,

        type:
          command.type,

        action:
          command.action || null,

        target:
          command.target || null,

        success:
          result.success === true,

        permission_required:
          result.permission_required || false,

        timestamp:
          new Date().toISOString(),

        duration_ms:
          Date.now() - startTime

      };


      this.history.push(
        executionRecord
      );


      return {

        success:
          result.success === true,

        result:
          result,

        execution:
          executionRecord

      };


    } catch (error) {

      const executionRecord = {

        command_id:
          command.id || null,

        type:
          command.type,

        action:
          command.action || null,

        target:
          command.target || null,

        success: false,

        error:
          error.message,

        timestamp:
          new Date().toISOString(),

        duration_ms:
          Date.now() - startTime

      };


      this.history.push(
        executionRecord
      );


      return {

        success: false,

        result: {

          success: false,

          message:
            "Command execution failed.",

          error:
            error.message

        },

        execution:
          executionRecord

      };

    }

  }


  getHistory() {

    return [...this.history];

  }


  clearHistory() {

    this.history = [];

    return {

      success: true,

      message:
        "Execution history cleared."

    };

  }


  getLastExecution() {

    if (this.history.length === 0) {

      return null;

    }

    return this.history[
      this.history.length - 1
    ];

  }


  getStatus() {

    return {

      history_count:
        this.history.length,

      router_connected:
        this.router !== null

    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {

  window.CommandExecutor =
    CommandExecutor;

}


// Node.js version
if (typeof module !== "undefined" && module.exports) {

  module.exports =
    CommandExecutor;

}
