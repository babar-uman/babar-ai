class MemoryManager {

  constructor(shortTermMemory = null, longTermMemory = null) {
    this.shortTerm = shortTermMemory;
    this.longTerm = longTermMemory;
  }

  setShortTermMemory(memory) {
    this.shortTerm = memory;

    return {
      success: true,
      message: "Short-Term Memory connected."
    };
  }

  setLongTermMemory(memory) {
    this.longTerm = memory;

    return {
      success: true,
      message: "Long-Term Memory connected."
    };
  }

  addUserMessage(content, metadata = {}) {
    if (!this.shortTerm) {
      return {
        success: false,
        message: "Short-Term Memory is not connected."
      };
    }

    return this.shortTerm.addUserMessage(
      content,
      metadata
    );
  }

  addAssistantMessage(content, metadata = {}) {
    if (!this.shortTerm) {
      return {
        success: false,
        message: "Short-Term Memory is not connected."
      };
    }

    return this.shortTerm.addAssistantMessage(
      content,
      metadata
    );
  }

  getRecentConversation(limit = 10) {
    if (!this.shortTerm) {
      return [];
    }

    return this.shortTerm.getRecent(limit);
  }

  remember(
    key,
    value,
    category = "general",
    metadata = {}
  ) {
    if (!this.longTerm) {
      return {
        success: false,
        message: "Long-Term Memory is not connected."
      };
    }

    return this.longTerm.set(
      key,
      value,
      category,
      metadata
    );
  }

  recall(key) {
    if (!this.longTerm) {
      return null;
    }

    return this.longTerm.get(key);
  }

  knows(key) {
    if (!this.longTerm) {
      return false;
    }

    return this.longTerm.has(key);
  }

  searchMemory(query) {
    if (!this.longTerm) {
      return [];
    }

    return this.longTerm.search(query);
  }

  getMemoryByCategory(category) {
    if (!this.longTerm) {
      return [];
    }

    return this.longTerm.getByCategory(category);
  }

  getLongTermMemories() {
    if (!this.longTerm) {
      return [];
    }

    return this.longTerm.getAll();
  }

  forget(key) {
    if (!this.longTerm) {
      return {
        success: false,
        message: "Long-Term Memory is not connected."
      };
    }

    return this.longTerm.remove(key);
  }

  clearShortTermMemory() {
    if (!this.shortTerm) {
      return {
        success: false,
        message: "Short-Term Memory is not connected."
      };
    }

    return this.shortTerm.clear();
  }

  clearLongTermMemory() {
    if (!this.longTerm) {
      return {
        success: false,
        message: "Long-Term Memory is not connected."
      };
    }

    return this.longTerm.clear();
  }

  clearAllMemory() {

    const shortTermResult =
      this.shortTerm
        ? this.shortTerm.clear()
        : null;

    const longTermResult =
      this.longTerm
        ? this.longTerm.clear()
        : null;

    return {
      success: true,
      message: "All memory cleared.",
      short_term: shortTermResult,
      long_term: longTermResult
    };
  }

  getStatus() {

    return {
      short_term_connected:
        this.shortTerm !== null,

      long_term_connected:
        this.longTerm !== null,

      short_term:
        this.shortTerm
          ? this.shortTerm.getStatus()
          : null,

      long_term:
        this.longTerm
          ? this.longTerm.getStatus()
          : null
    };
  }
}


if (typeof window !== "undefined") {
  window.MemoryManager = MemoryManager;
}


if (typeof module !== "undefined" && module.exports) {
  module.exports = MemoryManager;
}
