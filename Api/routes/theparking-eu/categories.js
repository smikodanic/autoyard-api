const { Sequelize } = require('sequelize');


/**
 * GET /theparking-eu/categories?make=Volkswagen&model=Golf%20sw
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
    const categories = await carsMD.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.cast(Sequelize.col('category'), 'TEXT')), 'category']],
      where: { make, model },
      order: [[Sequelize.col('category'), 'ASC']],
      raw: true
    });
    const categories_arr = categories.map(item => item.category).filter(item => !!item && item !== '-');

    const count = categories?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: categories_arr
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};
