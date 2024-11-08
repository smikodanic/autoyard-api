const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const countPerDay = require('./crawledPerDay.js');


// count scraped cars per day, per week and per year
router.get('/crawled-per-day', countPerDay);




module.exports = router;
