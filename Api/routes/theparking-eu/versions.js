const { Sequelize } = require('sequelize');


/**
 * GET /theparking-eu/versions?make=Volkswagen&model=Golf%20sw
 */
module.exports = async (req, res, next) => {

  try {
    const make = req.query.make;
    const model = req.query.model;
    if (!make) { throw new Error('The "make" is not selected.'); }
    if (!model) { throw new Error('The "model" is not selected.'); }

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const versions = await carsMD.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.cast(Sequelize.col('version'), 'TEXT')), 'version']],
      where: { make, model },
      order: [[Sequelize.col('version'), 'ASC']],
      raw: true
    });
    const versions_arr = versions.map(item => item.version);

    const count = versions?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: versions_arr
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};
