const { getPagination } = require('../common/pagination.util');
const { getSort } = require('../common/sort.util');
const { buildFilters } = require('../common/filters.util');
const response = require('../common/response.util');
const model = require('./centre.model');

exports.listCentres = async (req, res, next) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const { sortBy, sortOrder } = getSort(req.query, ['centre', 'centrecode', 'centreid']);

    const { whereClause, values } = buildFilters(req.query, [
      'stateid',
      'cityid',
      'isactive'
    ]);

    const data = await model.getCentres({
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
