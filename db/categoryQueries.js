const pool = require('./pool');

module.exports = {
  getAllCategories: async () => {
    const { rows } = await pool.query('select * from categories order by name');
    return rows;
  },

  getCategory: async (id) => {
    const { rows } = await pool.query(
      'select * from categories where id = $1',
      [id]
    );
    return rows[0];
  },

  createCategory: async (name, description) => {
    const { rows } = await pool.query(
      'insert into categories (name, description) values ($1, $2) returning *',
      [name, description]
    );
    return rows[0];
  },

  deleteCategory: async (id) => {
    const { rows } = await pool.query(
      'delete from categories where id = $1 returning *',
      [id]
    );
    return rows[0];
  },

  updateCategory: async (id, name, description) => {
    const { rows } = await pool.query(
      'update categories set name = $1, description = $2 where id = $3 returning *',
      [name, description, id]
    );
    return rows[0];
  },
};
