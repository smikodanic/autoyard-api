const { Sequelize } = require('sequelize');



/**
 * GET /stat/scraped-per-month?year=2024
 * Count number of scraped cars per month for a given year. Used "scraped_at" field.
 */
module.exports = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    if (!year) { throw new Error('The "year" parameter is required'); }

    const db = global.api.postgreSQL;
    const table = req.query.table; // scraper_theparking_eu
    const scraperTableMD = db.sequelize.models[`${table}MD`];
    if (!scraperTableMD) { throw new Error(`The table "${table}" doesn't exist`); }

    // perform the query to count cars per month in the specified year
    /*
SELECT
    EXTRACT(MONTH FROM scraped_at) AS month,
    COUNT(car_id) AS count
FROM
    cars
WHERE
    EXTRACT(YEAR FROM scraped_at) = :year
GROUP BY
    month
ORDER BY
    month ASC;
    */
    const countPerMonth = await scraperTableMD.findAll({
      attributes: [
        [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "scraped_at"')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('car_id')), 'count']
      ],
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "scraped_at"')), year)
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

