const { Sequelize } = require('sequelize');


/**
 * GET /theparking-eu/locations
 */
module.exports = async (req, res, next) => {

  try {

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const locations = await carsMD.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.cast(Sequelize.col('location'), 'TEXT')), 'location']],
      order: [[Sequelize.col('location'), 'ASC']],
      raw: true
    });
    const location_arr = locations.map(item => item.location).filter(item => item !== '-');

    const count = locations?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: location_arr
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};
