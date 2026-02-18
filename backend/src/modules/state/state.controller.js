const { getPagination } = require('../common/pagination.util');
const { getSort } = require('../common/sort.util');
const { buildFilters } = require('../common/filters.util');
const response = require('../common/response.util');
const repo = require('./state.model');

exports.listStates = async (req, res, next) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const { sortBy, sortOrder } = getSort(req.query, ['state', 'id']);
    const { whereClause, values } = buildFilters(req.query, ['isactive']);

    const data = await repo.getStates({
      whereClause,
      values,
      sortBy,
      sortOrder,
      limit,
      offset
    });

    return response.success(res, data);
  } catch (err) {
    next(err);
  }
};
