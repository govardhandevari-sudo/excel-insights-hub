const router = require('express').Router();
const controller = require('./deptRevenue.controller');

router.get("/filters", controller.getDeptRevenueFilters);
router.get("/summary", controller.getDeptRevenueSummary);
router.get("/category-split", controller.getCategorySplit);
router.get("/category-breakdown", controller.getCategoryBreakdown);
router.get("/trend", controller.getTrendData);

router.get("/table", controller.getDeptRevenueTable);
router.get("/table/export-xlsx", controller.exportDeptRevenueTable);
module.exports = router;
