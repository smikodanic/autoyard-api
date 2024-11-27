const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const info = require('./info.js');

router.get('/info', info);


module.exports = router;
