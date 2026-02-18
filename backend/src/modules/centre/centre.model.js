const db = require('../common/base.repository');

exports.getCentres = async ({ whereClause, values, sortBy, sortOrder, limit, offset }) => {
  const sql = `
    SELECT
      centreid,
      centrecode,
      centre,
      stateid,
      state,
      cityid,
      city,
      isactive
    FROM centre
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  return db.query(sql, [...values, limit, offset]);
};
