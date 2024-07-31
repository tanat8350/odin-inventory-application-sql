const pool = require('./pool');

module.exports = {
  getAllCategories: async () => {
    const { rows } = await pool.query('select * from categories order by name');
    return rows;
  },

  // getItem: async (id) => {
  //   const { rows } = await pool.query(
  //     `select items.*, categories.name as categoryname from items
  //     inner join categories on items.categoryid = categories.id
  //     where items.id = $1`,
  //     [id]
  //   );
  //   return rows[0];
  // },
};
