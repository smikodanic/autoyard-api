const { Sequelize } = require('sequelize');


/**
 * GET /sys/makes
 */
module.exports = async (req, res, next) => {

  try {

    /* send request to DB */
    const db = global.api.postgreSQL;
    const makesMD = db.sequelize.models['makesMD'];
    const makes = await makesMD.findAll({
      order: [
        [
          Sequelize.literal(`CASE WHEN "name" = 'Other' THEN 1 ELSE 0 END`),
          'ASC'
        ],
        [Sequelize.col('name'), 'ASC']
      ],
      raw: true
    });

    const count = makes?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: makes
    });

  } catch (err) {
    next(err);
  }

};
