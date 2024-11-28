const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const list = require('./list.js');
const transfer = require('./transfer.js');


router.post('/list', list);
router.post('/transfer', transfer);



module.exports = router;
