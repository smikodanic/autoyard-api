const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const crawledPerDay = require('./crawledPerDay.js');
const crawledPerMonth = require('./crawledPerMonth.js');
const crawledPerWeek = require('./crawledPerWeek.js');


// count scraped cars per day, per month and per week
router.get('/crawled-per-day', crawledPerDay);
router.get('/crawled-per-month', crawledPerMonth);
router.get('/crawled-per-week', crawledPerWeek);




module.exports = router;
