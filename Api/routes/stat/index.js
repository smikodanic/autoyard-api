const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const scrapedPerDay = require('./scrapedPerDay.js');
const scrapedPerMonth = require('./scrapedPerMonth.js');
const scrapedPerWeek = require('./scrapedPerWeek.js');


// count scraped cars per day, per month and per week
router.get('/scraped-per-day', scrapedPerDay);
router.get('/scraped-per-month', scrapedPerMonth);
router.get('/scraped-per-week', scrapedPerWeek);




module.exports = router;
