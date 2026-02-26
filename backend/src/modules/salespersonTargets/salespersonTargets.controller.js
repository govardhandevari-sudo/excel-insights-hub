const response = require('../common/response.util');
const model = require('./salespersonTargets.model');


exports.getSalespersonFilters = async (req, res, next) => {
  try {
    const { stateid, cityid } = req.query;
    const filters = await model.getSalespersonFilters({ stateid, cityid });
    return response.success(res, { filters });
  } catch (err) {
    next(err);
  }
};

exports.getSalespersons = async (req, res, next) => {
  try {
    const rows = await model.getSalespersons(req.query);
    return response.success(res, { rows });
  } catch (err) {
    next(err);
  }
};

exports.getTargetHistory = async (req, res, next) => {
  try {
    const { salespersonId } = req.query;

    if (!salespersonId) {
      return response.error(res, 'salespersonId is required', 400);
    }

    const rows = await model.getTargetHistory({ salespersonId });
    return response.success(res, { rows });
  } catch (err) {
    next(err);
  }
};

exports.addTarget = async (req, res, next) => {
  try {
    const {
      salespersonId,
      salespersonName,
      branch,
      region,
      startDate,
      endDate,
      targetAmount,
      notes
    } = req.body;

    if (
      !salespersonId ||
      !salespersonName ||
      !startDate ||
      !endDate ||
      !targetAmount
    ) {
      return response.error(
        res,
        'salespersonId, salespersonName, startDate, endDate and targetAmount are required',
        400
      );
    }

    if (new Date(endDate) < new Date(startDate)) {
      return response.error(res, 'endDate must be on/after startDate', 400);
    }

    const insertId = await model.addTarget({
      salespersonId,
      salespersonName,
      branch,
      region,
      startDate,
      endDate,
      targetAmount,
      notes
    });

    return response.success(res, { id: insertId }, 'Target saved');
  } catch (err) {
    next(err);
  }
};

exports.deleteTarget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await model.deleteTarget({ id });

    if (!deleted) {
      return response.error(res, 'Target not found', 404);
    }

    return response.success(res, null, 'Target deleted');
  } catch (err) {
    next(err);
  }
};
