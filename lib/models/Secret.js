const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.created_at = row.created_at;
    this.title = row.title;
    this.description = row.description;
  }

  static async create(title, description) {
    const { rows } = await pool.query(
      `
          INSERT INTO secrets (title, description) VALUES ($1, $2) RETURNING *
          `,
      [title, description]
    );
    if (!rows[0]) return null;
    return new Secret(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM secrets');
    if (!rows) return null;
    return rows.map((row) => new Secret(row));
  }
};
