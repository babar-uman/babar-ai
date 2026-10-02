class SkillManager {

  constructor(registry = null) {
    this.skills = new Map();
    this.registry = registry;
  }


  setRegistry(registry) {

    this.registry = registry;

    return {
      success: true,
      message: "Skill Registry connected."
    };

  }


  register(name, skill) {

    if (!name || !skill) {
      throw new Error("Invalid skill.");
    }

    if (this.skills.has(name)) {
      throw new Error(`Skill already registered: ${name}`);
    }

    this.skills.set(name, skill);

    // Also add skill to registry when available
    if (this.registry && !this.registry.has(name)) {

      this.registry.register({
        name: name,
        version: skill.version || "1.0.0",
        description: skill.description || "",
        category: skill.category || "general",
        permissions: skill.permissions || [],
        execute: skill.execute
      });

    }

    return {
      success: true,
      message: `Skill registered: ${name}`
    };

  }


  unregister(name) {

    if (!this.skills.has(name)) {

      return {
        success: false,
        message: `Skill not found: ${name}`
      };

    }

    this.skills.delete(name);

    if (this.registry && this.registry.has(name)) {
      this.registry.unregister(name);
    }

    return {
      success: true,
      message: `Skill removed: ${name}`
    };

  }


  get(name) {

    return this.skills.get(name) || null;

  }


  has(name) {

    return this.skills.has(name);

  }


  list() {

    return Array.from(this.skills.keys());

  }


  getInfo(name) {

    const skill = this.get(name);

    if (!skill) {
      return null;
    }

    return {
      name: name,
      version: skill.version || "1.0.0",
      description: skill.description || "",
      category: skill.category || "general",
      permissions: skill.permissions || []
    };

  }


  async execute(name, command) {

    const skill = this.get(name);

    if (!skill) {

      return {
        success: false,
        message: `Skill not found: ${name}`
      };

    }

    if (typeof skill.execute !== "function") {

      return {
        success: false,
        message: `Skill has no execute method: ${name}`
      };

    }

    try {

      const result = await skill.execute(command);

      // Preserve skill failures.
      // Do not convert success:false into success:true.
      if (result && result.success === false) {

        return {
          ...result,
          skill: name
        };

      }

      return {
        success: true,
        skill: name,
        data: result
      };

    } catch (error) {

      return {
        success: false,
        skill: name,
        error: error.message
      };

    }

  }

}


// Browser / Web version
if (typeof window !== "undefined") {
  window.SkillManager = SkillManager;
}


// Node.js version
if (typeof module !== "undefined" && module.exports) {
  module.exports = SkillManager;
}
