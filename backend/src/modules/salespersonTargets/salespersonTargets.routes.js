const router = require('express').Router();
const controller = require('./salespersonTargets.controller');

router.get('/filters', controller.getSalespersonFilters);
router.get('/salespersons', controller.getSalespersons);
router.get('/history', controller.getTargetHistory);
router.post('/', controller.addTarget);
router.delete('/:id', controller.deleteTarget);

module.exports = router;
