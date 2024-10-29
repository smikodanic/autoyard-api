const { Sequelize } = require('sequelize');


/**
 * GET /theparking-eu/makes
 */
module.exports = async (req, res, next) => {

  try {

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const makes = await carsMD.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.cast(Sequelize.col('make'), 'TEXT')), 'make']],
      order: [[Sequelize.col('make'), 'ASC']],
      raw: true
    });
    const make_arr = makes.map(item => item.make);

    const count = makes?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: make_arr
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};
