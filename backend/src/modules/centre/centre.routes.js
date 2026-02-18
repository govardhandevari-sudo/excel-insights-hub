const router = require('express').Router();
const controller = require('./centre.controller');

router.get('/', controller.listCentres);

module.exports = router;
