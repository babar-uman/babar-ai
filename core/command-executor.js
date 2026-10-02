class CommandExecutor {

  constructor(router, logger = null) {

    this.router = router;

    this.logger = logger;

    this.history = [];

  }


  setLogger(logger) {

    this.logger = logger;

    return {
      success: true,
      message: "Execution Logger connected."
    };

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


      // Send execution record to logger
      if (this.logger) {

        this.logger.log(
          executionRecord
        );

      }


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


      // Log failed execution
      if (this.logger) {

        this.logger.log(
          executionRecord
        );

      }


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
        this.router !== null,

      logger_connected:
        this.logger !== null

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
