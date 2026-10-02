class ConversationMemory {

  constructor(memoryManager = null) {

    this.memoryManager =
      memoryManager;

    this.active =
      true;

  }


  setMemoryManager(memoryManager) {

    this.memoryManager =
      memoryManager;

    return {

      success: true,

      message:
        "Memory Manager connected."

    };

  }


  setActive(active) {

    this.active =
      active === true;

    return {

      success: true,

      active:
        this.active

    };

  }


  isActive() {

    return this.active === true;

  }


  recordUserMessage(
    content,
    metadata = {}
  ) {

    if (!this.isActive()) {

      return {

        success: false,

        message:
          "Conversation memory is disabled."

      };

    }


    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.addUserMessage(
      content,
      metadata
    );

  }


  recordAssistantMessage(
    content,
    metadata = {}
  ) {

    if (!this.isActive()) {

      return {

        success: false,

        message:
          "Conversation memory is disabled."

      };

    }


    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.addAssistantMessage(
      content,
      metadata
    );

  }


  recordSystemMessage(
    content,
    metadata = {}
  ) {

    if (!this.isActive()) {

      return {

        success: false,

        message:
          "Conversation memory is disabled."

      };

    }


    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.addConversationMessage(
      "system",
      content,
      metadata
    );

  }


  getRecentContext(
    limit = 10
  ) {

    if (!this.memoryManager) {

      return [];

    }


    return this.memoryManager.getRecentConversation(
      limit
    );

  }


  rememberImportant(
    key,
    value,
    category = "general",
    metadata = {}
  ) {

    if (!this.memoryManager) {

      return {

        success: false,

        message:
          "Memory Manager is not connected."

      };

    }


    return this.memoryManager.remember(
      key,
      value,
      category,
      metadata
    );

  }


  recallImportant(key) {

    if (!this.memoryManager) {

      return null;

    }


    return this.memoryManager.recall(
      key
    );

  }


  searchImportant(query) {

    if (!this.memoryManager) {

      return [];

    }


    return this.memoryManager.searchMemory(
      query
    );

  }


  getStatus() {

    return {

      active:
        this.active,

      memory_manager_connected:
        this.memoryManager !== null,

      recent_context_count:
        this.memoryManager
          ? this.memoryManager
              .getRecentConversation(1000)
              .length
          : 0

    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {

  window.ConversationMemory =
    ConversationMemory;

}


// Node.js version
if (
  typeof module !== "undefined" &&
  module.exports
) {

  module.exports =
    ConversationMemory;

      }
