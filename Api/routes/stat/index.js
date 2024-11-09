const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const crawledPerDay = require('./crawledPerDay.js');
const crawledPerMonth = require('./crawledPerMonth.js');


// count scraped cars per day, per month and per week
router.get('/crawled-per-day', crawledPerDay);
router.get('/crawled-per-month', crawledPerMonth);




module.exports = router;
