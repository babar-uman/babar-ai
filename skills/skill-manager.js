class SkillManager {
  constructor() {
    this.skills = new Map();
  }

  register(name, skill) {
    if (!name || !skill) {
      throw new Error("Invalid skill.");
    }

    if (this.skills.has(name)) {
      throw new Error(`Skill already registered: ${name}`);
    }

    this.skills.set(name, skill);

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

if (typeof module !== "undefined" && module.exports) {
  module.exports = SkillManager;
}
