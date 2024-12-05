const { Sequelize } = require('sequelize');



/**
 * GET /stat/scraped-per-day?table=scraper_theparking_eu&year=2024&month=10
 * Count number of scraped cars per day for a given year and month. Uses the "scraped_at" field.
 */
module.exports = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    if (!year) { throw new Error('The "year" parameter is required'); }
    if (!month) { throw new Error('The "month" parameter is required'); }

    const db = global.api.postgreSQL;
    const table = req.query.table; // scraper_theparking_eu
    const scraperTableMD = db.sequelize.models[`${table}MD`];
    if (!scraperTableMD) { throw new Error(`The table "${table}" doesn't exist`); }

    // Perform the query to count cars per day in the specified year
    /*
SELECT
  DATE(scraped_at) AS day,
  COUNT(car_id) AS count
FROM cars
WHERE EXTRACT(YEAR FROM scraped_at) = :year
GROUP BY day
ORDER BY day ASC;
    */
    const countPerDay = await scraperTableMD.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('scraped_at')), 'day'], // Extract day from scraped_at: DATE(scraped_at) AS day
        [Sequelize.fn('COUNT', Sequelize.col('car_id')), 'count'] // Count car_id per day: COUNT(car_id) AS count
      ],
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "scraped_at"')), year),
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "scraped_at"')), month)
        ]
      },
      group: ['day'],
      order: [[Sequelize.literal('day'), 'ASC']],
      raw: true
    });

    // Send the response
    res.json({
      success: true,
      query: req.query,
      data: countPerDay
    });

  } catch (err) {
    next(err);
  }

};

