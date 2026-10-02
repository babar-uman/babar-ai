class ShortTermMemory {

  constructor(maxMessages = 50) {

    this.messages = [];

    this.maxMessages = maxMessages;

  }


  add(role, content, metadata = {}) {

    if (!role || !content) {

      throw new Error(
        "Role and content are required."
      );

    }


    const message = {

      id:
        this.generateId(),

      role:
        role,

      content:
        content,

      metadata:
        metadata,

      timestamp:
        new Date().toISOString()

    };


    this.messages.push(
      message
    );


    if (
      this.messages.length >
      this.maxMessages
    ) {

      this.messages.shift();

    }


    return {

      success: true,

      message:
        "Message added to short-term memory.",

      data:
        message

    };

  }


  addUserMessage(content, metadata = {}) {

    return this.add(
      "user",
      content,
      metadata
    );

  }


  addAssistantMessage(content, metadata = {}) {

    return this.add(
      "assistant",
      content,
      metadata
    );

  }


  addSystemMessage(content, metadata = {}) {

    return this.add(
      "system",
      content,
      metadata
    );

  }


  getAll() {

    return [
      ...this.messages
    ];

  }


  getRecent(limit = 10) {

    if (limit <= 0) {

      return [];

    }


    return this.messages.slice(
      -limit
    );

  }


  getLast() {

    if (
      this.messages.length === 0
    ) {

      return null;

    }


    return this.messages[
      this.messages.length - 1
    ];

  }


  getByRole(role) {

    return this.messages.filter(
      message =>
        message.role === role
    );

  }


  getCount() {

    return this.messages.length;

  }


  remove(id) {

    const index =
      this.messages.findIndex(
        message =>
          message.id === id
      );


    if (index === -1) {

      return {

        success: false,

        message:
          "Message not found."

      };

    }


    this.messages.splice(
      index,
      1
    );


    return {

      success: true,

      message:
        "Message removed."

    };

  }


  clear() {

    this.messages = [];


    return {

      success: true,

      message:
        "Short-term memory cleared."

    };

  }


  getStatus() {

    return {

      total_messages:
        this.messages.length,

      max_messages:
        this.maxMessages

    };

  }


  generateId() {

    return (

      "memory-" +

      Date.now().toString(36) +

      "-" +

      Math.random()
        .toString(36)
        .substring(2, 8)

    );

  }

}


// Browser / Web version
if (typeof window !== "undefined") {

  window.ShortTermMemory =
    ShortTermMemory;

}


// Node.js version
if (typeof module !== "undefined" && module.exports) {

  module.exports =
    ShortTermMemory;

}
