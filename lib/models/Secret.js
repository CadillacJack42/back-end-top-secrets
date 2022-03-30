const pool = require('../utils/pool');

module.exports = class Secret {
  title;
  description;

  constructor(row) {
    this.title = row.title;
    this.description = row.description;
  }

  static async getAll() {
    const { rows } = pool.query('SELECT * FROM secrets');
    if (!rows) return null;
    return rows.map((row) => new Secret(row));
  }
};
