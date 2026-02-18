const db = require('../../config/db');

exports.query = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows;
};
