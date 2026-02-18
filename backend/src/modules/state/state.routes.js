const router = require('express').Router();
const controller = require('./state.controller');

router.get('/', controller.listStates);

module.exports = router;
