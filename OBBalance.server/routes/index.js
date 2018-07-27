var express = require('express');
var router = express.Router();

const balance = require('../controllers').balance;

router.get('/api/balance/current', balance.getCurrent);
router.get('/api/balance/old', balance.getOld);
// router.get('/api/oldbalance');

module.exports = router;