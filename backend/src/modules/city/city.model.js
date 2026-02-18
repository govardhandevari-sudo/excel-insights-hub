const db = require('../common/base.repository');

exports.getCities = async ({ whereClause, values, sortBy, sortOrder, limit, offset }) => {
  const sql = `
    SELECT id, city, stateid, isactive
    FROM city
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  return db.query(sql, [...values, limit, offset]);
};
