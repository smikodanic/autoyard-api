const { Sequelize } = require('sequelize');

/**
 * GET /stat/crawled-per-week?year=2024&month=10
 * Count number of scraped cars per week for a given year and month using the "crawled_at" field.
 */
module.exports = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    if (!year) { throw new Error('The "year" parameter is required'); }
    if (!month) { throw new Error('The "month" parameter is required'); }

    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];

    // Perform the query to count cars per week in the specified year and month
    /*
SELECT
  DATE_TRUNC('week', crawled_at) AS week,
  COUNT(car_id) AS count
FROM cars
WHERE EXTRACT(YEAR FROM crawled_at) = :year
  AND EXTRACT(MONTH FROM crawled_at) = :month
GROUP BY week
ORDER BY week ASC;

    */
    const countPerWeek = await carsMD.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'week', Sequelize.col('crawled_at')), 'week'], // Group by start of the week
        [Sequelize.fn('COUNT', Sequelize.col('car_id')), 'count'] // Count car_id per week
      ],
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "crawled_at"')), year),
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "crawled_at"')), month)
        ]
      },
      group: ['week'],
      order: [[Sequelize.literal('week'), 'ASC']],
      raw: true
    });

    // Send the response
    res.json({
      success: true,
      query: req.query,
      data: countPerWeek
    });

  } catch (err) {
    console.log(err);
    next(err);
  }
};
