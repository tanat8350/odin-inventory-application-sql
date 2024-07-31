const pool = require('./pool');

module.exports = {
  getAllItems: async () => {
    const { rows } = await pool.query(
      'select items.*, categories.name as categoryname from items inner join categories on items.categoryid = categories.id order by items.id'
    );
    return rows;
  },

  getItem: async (id) => {
    const { rows } = await pool.query(
      `select items.*, categories.name as categoryname from items
      inner join categories on items.categoryid = categories.id
      where items.id = $1`,
      [id]
    );
    return rows[0];
  },

  createItem: async (
    name,
    description,
    category,
    price,
    instock,
    image_url
  ) => {
    const { rows } = await pool.query(
      'insert into items (name, description, categoryid, price, instock, image_url) values ($1, $2, $3, $4, $5, $6) returning *',
      [name, description, category, price, instock, image_url]
    );
    return rows[0];
  },

  updateItem: async (
    id,
    name,
    description,
    category,
    price,
    instock,
    image_url
  ) => {
    const { rows } = await pool.query(
      'update items set name = $1, description = $2, categoryid = $3, price = $4, instock = $5, image_url = $6 where id = $7 returning *',
      [name, description, category, price, instock, image_url, id]
    );
    return rows[0];
  },

  deleteItem: async (id) => {
    const { rows } = await pool.query(
      'delete from items where id = $1 returning *',
      [id]
    );
    return rows[0];
  },
};
