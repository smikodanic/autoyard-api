const { Sequelize } = require('sequelize');



/**
 * GET /stat/crawled-per-month?year=2024
 * Count number of scraped cars per month for a given year. Used "crawled_at" field.
 */
module.exports = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    if (!year) { throw new Error('The "year" parameter is required'); }

    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];

    // perform the query to count cars per month in the specified year
    /*
SELECT
    EXTRACT(MONTH FROM crawled_at) AS month,
    COUNT(car_id) AS count
FROM
    cars
WHERE
    EXTRACT(YEAR FROM crawled_at) = :year
GROUP BY
    month
ORDER BY
    month ASC;
    */
    const countPerMonth = await carsMD.findAll({
      attributes: [
        [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "crawled_at"')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('car_id')), 'count']
      ],
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "crawled_at"')), year)
        ]
      },
      group: ['month'],
      order: [[Sequelize.literal('month'), 'ASC']],
      raw: true
    });


    res.json({
      success: true,
      query: req.query,
      data: countPerMonth
    });

  } catch (err) {
    next(err);
  }

};

