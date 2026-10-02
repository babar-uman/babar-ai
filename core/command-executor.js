class CommandExecutor {

  constructor(router) {

    this.router = router;

    this.history = [];

  }


  async execute(command, confirmed = false) {

    if (!command || !command.type) {

      return {

        success: false,

        message:
          "Invalid command."

      };

    }


    const startTime =
      Date.now();


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
          command.target ||
