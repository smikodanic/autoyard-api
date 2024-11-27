const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const makes = require('./makes.js');
const models = require('./models.js');


// count scraped cars per day, per month and per week
router.get('/makes', makes);
router.get('/models', models);




module.exports = router;
