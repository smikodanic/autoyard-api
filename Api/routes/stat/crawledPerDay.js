const { Sequelize } = require('sequelize');


/**
 * GET /stat/count-per-day?year=2024
 * Count number of scraped cars per day for a given year. Use field "crawled_at".
 */
module.exports = async (req, res, next) => {

  try {

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const fuels = await carsMD.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.cast(Sequelize.col('fuel'), 'TEXT')), 'fuel']],
      order: [[Sequelize.col('fuel'), 'ASC']],
      raw: true
    });
    const fuel_arr = fuels.map(item => item.fuel).filter(item => item !== '-');

    const count = fuels?.length ?? 0;

    /* send response */
    res.json({
      success: true,
      count,
      data: fuel_arr
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};


/**
 * GET /stat/crawled-per-day?year=2024&month=10
 * Count number of scraped cars per day for a given year and month. Uses the "crawled_at" field.
 */
module.exports = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    if (!year) { throw new Error('The "year" parameter is required'); }
    if (!month) { throw new Error('The "month" parameter is required'); }

    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];

    // Perform the query to count cars per day in the specified year
    /*
SELECT
  DATE(crawled_at) AS day,
  COUNT(car_id) AS count
FROM cars
WHERE EXTRACT(YEAR FROM crawled_at) = :year
GROUP BY day
ORDER BY day ASC;
    */
    const countPerDay = await carsMD.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('crawled_at')), 'day'], // Extract day from crawled_at: DATE(crawled_at) AS day
        [Sequelize.fn('COUNT', Sequelize.col('car_id')), 'count'] // Count car_id per day: COUNT(car_id) AS count
      ],
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "crawled_at"')), year),
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "crawled_at"')), month)
        ]
      },
      group: ['day'],
      order: [[Sequelize.literal('day'), 'ASC']],
      raw: true
    });

    // Send the response
    res.json({
      success: true,
      data: countPerDay
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

