class ExecutionLogger {

  constructor(maxLogs = 1000) {

    this.logs = [];

    this.maxLogs = maxLogs;

  }


  log(record) {

    if (!record || typeof record !== "object") {

      throw new Error("Invalid execution record.");

    }


    const logEntry = {

      id:
        record.id ||
        this.generateId(),

      command_id:
        record.command_id || null,

      type:
        record.type || null,

      action:
        record.action || null,

      target:
        record.target || null,

      success:
        record.success === true,

      permission_required:
        record.permission_required || false,

      error:
        record.error || null,

      message:
        record.message || null,

      timestamp:
        record.timestamp ||
        new Date().toISOString()

    };


    this.logs.push(logEntry);


    if (this.logs.length > this.maxLogs) {

      this.logs.shift();

    }


    return {

      success: true,

      message: "Execution logged successfully.",

      log: logEntry

    };

  }


  createRecord(command, result) {

    if (!command) {

      throw new Error("Command is required.");

    }


    return {

      command_id:
        command.id || null,

      type:
        command.type || null,

      action:
        command.action || null,

      target:
        command.target || null,

      success:
        result?.success === true,

      permission_required:
        result?.permission_required || false,

      error:
        result?.error || null,

      message:
        result?.message || null,

      timestamp:
        new Date().toISOString()

    };

  }


  logCommand(command, result) {

    const record =
      this.createRecord(
        command,
        result
      );


    return this.log(record);

  }


  getLogs() {

    return [...this.logs];

  }


  getById(id) {

    return (
      this.logs.find(
        log => log.id === id
      ) || null
    );

  }


  getByCommandId(commandId) {

    return this.logs.filter(
      log =>
        log.command_id === commandId
    );

  }


  getRecent(limit = 20) {

    if (limit <= 0) {

      return [];

    }


    return this.logs.slice(
      -limit
    );

  }


  clear() {

    this.logs = [];


    return {

      success: true,

      message:
        "Execution logs cleared."

    };

  }


  getStatus() {

    return {

      total_logs:
        this.logs.length,

      max_logs:
        this.maxLogs

    };

  }


  generateId() {

    return (

      "log-" +

      Date.now().toString(36) +

      "-" +

      Math.random
