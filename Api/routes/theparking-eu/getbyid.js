const { Op } = require('sequelize');


/**
 * GET /theparking-eu/:car_id
 */
module.exports = async (req, res, next) => {

  try {
    const car_id = req.params.car_id;
    if (!car_id) { throw new Error('The "car_id" is not defined'); }

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const where = { car_id };
    const data = await carsMD.findOne({ where });

    /* send response */
    res.json({
      success: true,
      data,
      query: req.params
    });


  } catch (err) {
    next(err);
  }

};



