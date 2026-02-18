const router = require('express').Router();
const controller = require('./payments.controller');

router.get('/filters', controller.getPaymentFilters);
router.get('/summary', controller.getPaymentSummary);
router.get('/branch-distribution', controller.getBranchDistribution);
router.get('/branch-table', controller.getBranchPaymentTable);
router.get('/branch-table/export', controller.exportBranchPaymentTable);
router.get('/branch-table/export-xlsx', controller.exportBranchPaymentTableXlsx);

module.exports = router;
