const pool = require('../utils/pool');

module.exports = class User {
  id;
  first_name;
  last_name;
  email;
  #password;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.first_name = row.first_name;
    this.last_name = row.last_name;
    this.email = row.email;
    this.#password = row.password;
    this.user_id = row.user_id;
  }

  static async insert({ first_name, last_name, email, password }) {
    const { rows } = await pool.query(
      `
          INSERT INTO users(first_name, last_name, email, password)
          VALUES ($1, $2, $3, $4)
          RETURNING *
          `,
      [first_name, last_name, email, password]
    );
    return new User(rows[0]);
  }
};
