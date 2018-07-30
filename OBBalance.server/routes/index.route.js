var express = require('express');
var router = express.Router();

const balance = require('../controllers').balance;
const attendance = require('../controllers').attendance;

router.get('/api/balance/current', balance.getCurrent);
router.get('/api/balance/old', balance.getOld);

router.get('/api/attendance/current', attendance.getCurrent);
router.get('/api/attendance/old', attendance.getOld);
// router.get('/api/oldbalance');

module.exports = router;