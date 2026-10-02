class SkillRegistry {

  constructor() {
    this.skills = new Map();
  }


  register(skill) {

    if (!skill || !skill.name) {
      throw new Error("Invalid skill definition.");
    }

    if (this.skills.has(skill.name)) {
      throw new Error(`Skill already registered: ${skill.name}`);
    }

    this.skills.set(skill.name, {
      name: skill.name,
      version: skill.version || "1.0.0",
      description: skill.description || "",
      category: skill.category || "general",
      permissions: skill.permissions || [],
      execute: skill.execute
    });

    return {
      success: true,
      message: `Skill registered: ${skill.name}`
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

    return Array.from(this.skills.values());

  }


  getNames() {

    return Array.from(this.skills.keys());

  }


  getInfo(name) {

    const skill = this.get(name);

    if (!skill) {
      return null;
    }

    return {
      name: skill.name,
      version: skill.version,
      description: skill.description,
      category: skill.category,
      permissions: skill.permissions
    };

  }


  clear() {

    this.skills.clear();

    return {
      success: true,
      message: "Skill registry cleared."
    };

  }


  count() {

    return this.skills.size;

  }


  getStatus() {

    return {
      success: true,
      count: this.skills.size,
      skills: this.getNames()
    };

  }

}


// Browser / Web version
if (typeof window !== "undefined") {
  window.SkillRegistry = SkillRegistry;
}


// Node.js version
if (typeof module !== "undefined" && module.exports) {
  module.exports = SkillRegistry;
}
