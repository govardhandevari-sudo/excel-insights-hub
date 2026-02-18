const router = require('express').Router();
const controller = require('./city.controller');

router.get('/', controller.listCities);

module.exports = router;
