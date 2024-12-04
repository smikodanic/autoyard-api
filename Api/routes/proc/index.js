const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const checker = require('./checker.js');


// check scraped cars
router.get('/checker/grab-cars', authHand.authCheck('scraper-checker'), checker.grabCars);
router.get('/checker/update-remove-car', authHand.authCheck('scraper-checker'), checker.updateRemoveCar);



module.exports = router;
