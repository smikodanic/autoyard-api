const { Sequelize } = require('sequelize');


/**
 * GET /theparking-eu/fuels
 */
module.exports = async (req, res, next) => {

  try {

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const fuels = await carsMD.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.cast(Sequelize.col('fuel'), 'TEXT')), 'fuel']],
      raw: true
    });
    const fuel_arr = fuels.map(item => item.fuel).filter(item => item !== '-');

    const count = fuels?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: fuel_arr
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};
