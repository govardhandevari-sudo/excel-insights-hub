exports.getSort = (query, allowedFields = []) => {
  const sortBy = allowedFields.includes(query.sortBy)
    ? query.sortBy
    : allowedFields[0];

  const sortOrder =
    query.sortOrder && query.sortOrder.toUpperCase() === 'DESC'
      ? 'DESC'
      : 'ASC';

  return { sortBy, sortOrder };
};
