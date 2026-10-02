class LongTermMemory {

  constructor(options = {}) {

    this.storageKey =
      options.storageKey || "babar_ai_long_term_memory";

    this.storage =
      options.storage ||
      (typeof localStorage !== "undefined"
        ? localStorage
        : null);

    this.memories = new Map();

    this.load();

  }


  generateId() {

    return (
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).substring(2, 10)
    );

  }


  load() {

    if (!this.storage) {
      return;
    }

    try {

      const saved =
        this.storage.getItem(this.storageKey);

      if (!saved) {
        return;
      }

      const data =
        JSON.parse(saved);

      if (!Array.isArray(data)) {
        return;
      }

      this.memories.clear();

      for (const memory of data) {

        if (
          memory &&
          memory.id &&
          memory.key
        ) {

          this.memories.set(
            memory.key,
            memory
          );

        }

      }

    } catch (error) {

      console.error(
        "Failed to load long-term memory:",
        error
      );

    }

  }


  save() {

    if (!this.storage) {
      return;
    }

    try {

      const data =
        Array.from(this.memories.values());

      this.storage.setItem(
        this.storageKey,
        JSON.stringify(data)
      );

    } catch (error) {

      console.error(
        "Failed to save long-term memory:",
        error
      );

    }

  }


  add(key, value, category = "general", metadata = {}) {

    if (!key) {

      return {
        success: false,
        message: "Memory key is required."
      };

    }

    if (this.memories.has(key)) {

      return {
        success: false,
        message: `Memory already exists: ${key}`
      };

    }

    const memory = {

      id: this.generateId(),

      key: key,

      value: value,

      category: category,

      metadata: metadata,

      created_at: new Date().toISOString(),

      updated_at: new Date().toISOString()

    };


    this.memories.set(
      key,
      memory
    );

    this.save();


    return {

      success: true,

      memory: memory

    };

  }


  update(key, value, category, metadata) {

    const memory =
      this.memories.get(key);


    if (!memory) {

      return {

        success: false,

        message:
          `Memory not found: ${key}`

      };

    }


    memory.value = value;


    // Category is now updated when provided.
    if (
      category !== undefined &&
      category !== null
    ) {

      memory.category =
        category;

    }


    // Metadata is updated when provided.
    if (
      metadata !== undefined &&
      metadata !== null
    ) {

      memory.metadata =
        metadata;

    }


    memory.updated_at =
      new Date().toISOString();


    this.memories.set(
      key,
      memory
    );

    this.save();


    return {

      success: true,

      memory: memory

    };

  }


  set(
    key,
    value,
    category = "general",
    metadata = {}
  ) {

    if (this.memories.has(key)) {

      return this.update(
        key,
        value,
        category,
        metadata
      );

    }


    return this.add(
      key,
      value,
      category,
      metadata
    );

  }


  get(key) {

    return (
      this.memories.get(key) ||
      null
    );

  }


  has(key) {

    return this.memories.has(key);

  }


  getAll() {

    return Array.from(
      this.memories.values()
    );

  }


  getByCategory(category) {

    return this.getAll().filter(
      memory =>
        memory.category === category
    );

  }


  search(query) {

    if (!query) {

      return [];

    }


    const searchText =
      String(query).toLowerCase();


    return this.getAll().filter(
      memory => {

        const key =
          String(memory.key || "")
            .toLowerCase();

        const value =
          String(memory.value || "")
            .toLowerCase();

        const category =
          String(memory.category || "")
            .toLowerCase();


        return (
          key.includes(searchText) ||
          value.includes(searchText) ||
          category.includes(searchText)
        );

      }
    );

  }


  remove(key) {

    if (!this.memories.has(key)) {

      return {

        success: false,

        message:
          `Memory not found: ${key}`

      };

    }


    this.memories.delete(key);

    this.save();


    return {

      success: true,

      message:
        `Memory removed: ${key}`

    };

  }


  clear() {

    this.memories.clear();

    this.save();


    return {

      success: true,

      message:
        "Long-term memory cleared."

    };

  }


  getStatus() {

    return {

      enabled: true,

      count:
        this.memories.size,

      storage:
        this.storage
          ? "localStorage"
          : "memory-only"

    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {

  window.LongTermMemory =
    LongTermMemory;

}


// Node.js version
if (
  typeof module !== "undefined" &&
  module.exports
) {

  module.exports =
    LongTermMemory;

}
