const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const list = require('./list.js');


router.post('/list', list);



module.exports = router;
