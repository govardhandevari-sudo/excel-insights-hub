const router = require('express').Router();
const controller = require('./health.controller');

router.get('/', controller.healthCheck);

module.exports = router;
