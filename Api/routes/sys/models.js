const { Sequelize } = require('sequelize');

/**
 * GET /sys/models?make_id=12
 */
module.exports = async (req, res, next) => {
  try {
    const { make_id } = req.query;  // Retrieve make_id from query parameters

    if (!make_id) {
      return res.status(400).json({
        success: false,
        message: 'make_id query parameter is required'
      });
    }

    /* send request to DB */
    const db = global.api.postgreSQL;
    const modelsMD = db.sequelize.models['modelsMD'];
    const models = await modelsMD.findAll({
      where: {
        make_id: make_id,  // Filter by make_id
      },
      order: [[Sequelize.col('name'), 'ASC']],  // Sort by name alphabetically
      raw: true
    });

    const count = models?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: models
    });

  } catch (err) {
    console.log(err);
    next(err);
  }
};
