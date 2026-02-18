exports.buildFilters = (filters = {}, allowedFilters = []) => {
  let where = [];
  let values = [];

  for (const key of allowedFilters) {
    if (filters[key] !== undefined && filters[key] !== '') {
      where.push(`${key} = ?`);
      values.push(filters[key]);
    }
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  return { whereClause, values };
};
