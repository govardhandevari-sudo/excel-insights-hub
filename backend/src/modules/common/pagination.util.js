exports.getPagination = (query) => {
  const page =  Math.max(parseInt(query.page) || 1, 1);

  // Support both `limit` and `perPage`
  let perPage = query.limit === 'all' ? 1000 : parseInt(query.perPage || query.limit || 20);

  // Safety cap
  if (isNaN(perPage) || perPage <= 0) perPage = 20;
  if (perPage > 100) perPage = 100;

  const offset = (page - 1) * perPage;

  return {
    page,
    limit: perPage,
    perPage,
    offset
  };
};
