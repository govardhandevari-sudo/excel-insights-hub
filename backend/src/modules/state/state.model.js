const baseRepo = require('../common/base.repository');

exports.getStates = async ({ whereClause, values, sortBy, sortOrder, limit, offset }) => {
  const sql = `
    SELECT id, state, isactive
    FROM state
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  return baseRepo.query(sql, [...values, limit, offset]);
};
