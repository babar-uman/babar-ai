class LongTermMemory {

  constructor(storageKey = "babar-ai-memory") {

    this.storageKey =
      storageKey;

    this.memories =
      this.load();

  }


  add(
    key,
    value,
    category = "general",
    metadata = {}
  ) {

    if (!key || value === undefined) {

      throw new Error(
        "Memory key and value are required."
      );

    }


    const memory = {

      id:
        this.generateId(),

      key:
        key,

      value:
        value,

      category:
        category,

      metadata:
        metadata,

      created_at:
        new Date().toISOString(),

      updated_at:
        new Date().toISOString()

    };


    this.memories.push(
      memory
    );


    this.save();


    return {

      success: true,

      message:
        "Long-term memory saved.",

      memory:
        memory

    };

  }


  update(
    key,
    value,
    metadata = {}
  ) {

    const memory =
      this.memories.find(
        item =>
          item.key === key
      );


    if (!memory) {

      return {

        success: false,

        message:
          "Memory not found."

      };

    }


    memory.value =
      value;


    memory.metadata =
      metadata;


    memory.updated_at =
      new Date().toISOString();


    this.save();


    return {

      success: true,

      message:
        "Long-term memory updated.",

      memory:
        memory

    };

  }


  set(
    key,
    value,
    category = "general",
    metadata = {}
  ) {

    const existing =
      this.memories.find(
        item =>
          item.key === key
      );


    if (existing) {

      return this.update(
        key,
        value,
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

    const memory =
      this.memories.find(
        item =>
          item.key === key
      );


    return memory || null;

  }


  has(key) {

    return (
      this.get(key) !== null
    );

  }


  getAll() {

    return [
      ...this.memories
    ];

  }


  getByCategory(category) {

    return this.memories.filter(
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


    return this.memories.filter(
      memory => {

        const key =
          String(
            memory.key
          ).toLowerCase();


        const value =
          String(
            memory.value
          ).toLowerCase();


        const category =
          String(
            memory.category
          ).toLowerCase();


        return (

          key.includes(searchText) ||

          value.includes(searchText) ||

          category.includes(searchText)

        );

      }
    );

  }


  remove(key) {

    const index =
      this.memories.findIndex(
        memory =>
          memory.key === key
      );


    if (index === -1) {

      return {

        success: false,

        message:
          "Memory not found."

      };

    }


    this.memories.splice(
      index,
      1
    );


    this.save();


    return {

      success: true,

      message:
        "Long-term memory removed."

    };

  }


  clear() {

    this.memories = [];

    this.save();


    return {

      success: true,

      message:
        "Long-term memory cleared."

    };

  }


  count() {

    return this.memories.length;

  }


  getStatus() {

    return {

      storage_key:
        this.storageKey,

      total_memories:
        this.memories.length,

      persistent:
        this.isPersistentStorageAvailable()

    };

  }


  isPersistentStorageAvailable() {

    return (
      typeof localStorage !==
      "undefined"
    );

  }


  save() {

    if (
      !this.isPersistentStorageAvailable()
    ) {

      return false;

    }


    try {

      localStorage.setItem(

        this.storageKey,

        JSON.stringify(
          this.memories
        )

      );


      return true;

    }

    catch (error) {

      return false;

    }

  }


  load() {

    if (
      !this.isPersistentStorageAvailable()
    ) {

      return [];

    }


    try {

      const stored =
        localStorage.getItem(
          this.storageKey
        );


      if (!stored) {

        return [];

      }


      const parsed =
        JSON.parse(
          stored
        );


      return Array.isArray(parsed)
        ? parsed
        : [];

    }

    catch (error) {

      return [];

    }

  }


  generateId() {

    return (

      "long-memory-" +

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

  window.LongTermMemory =
    LongTermMemory;

}


// Node.js version
if (typeof module !== "undefined" && module.exports) {

  module.exports =
    LongTermMemory;

        }
