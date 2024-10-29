const { Sequelize } = require('sequelize');


/**
 * GET /theparking-eu/models?make=Volkswagen
 */
module.exports = async (req, res, next) => {

  try {
    const make = req.query.make;
    if (!make) { throw new Error('The "make" is not selected.'); }

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const models = await carsMD.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.cast(Sequelize.col('model'), 'TEXT')), 'model']],
      order: [[Sequelize.col('model'), 'ASC']],
      where: { make },
      raw: true
    });
    const models_arr = models.map(item => item.model);

    const count = models?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: models_arr
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};
