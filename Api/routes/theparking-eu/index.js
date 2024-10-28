const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const makes = require('./makes.js');
const models = require('./models.js');
const versions = require('./versions.js');
const categories = require('./categories.js');
const locations = require('./locations.js');
const fuels = require('./fuels.js');

const list = require('./list.js');
const getbyid = require('./getbyid.js');



// fetch makes, models, categories, versions, locations and fuels
router.get('/makes', makes);
router.get('/models', models);
router.get('/categories', categories);
router.get('/versions', versions);
router.get('/locations', locations);
router.get('/fuels', fuels);

// theparking.eu
router.post('/list', list);
router.get('/:car_id', getbyid);



module.exports = router;
