const express = require('express');
const router = express.Router();
const authHand = require('../_handlers/authHand.js');

const list = require('./list.js');
// const getbyid = require('./getbyid.js');


router.post('/list', list);
// router.get('/:car_id', getbyid);



module.exports = router;
