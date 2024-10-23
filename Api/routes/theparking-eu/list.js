const { Op } = require('sequelize');
const timeLib = require('../../lib/timeLib.js');


/**
 * POST /theparking-eu/list?limit=10&skip=0&sort=updated_at
 {
  "make": "Volkswagen",
  "model": "Golf",
  "version": "CONFORTLINE",
  "location": "Hungary",
  "price_from": 2000,
  "price_to": 6000,
  "has_image": true,
  "fuel": "gasoline",
  "transmission": "manual",
  "color": "grey",
  "doors": "5",
  "year_from": 2000,
  "year_to": 2023,
  "ad_title": "volkswagen golf",
  "date_published_from": "2024-06-13",
  "date_published_to": "2024-10-22"
}
 */
module.exports = async (req, res, next) => {

  try {
    const limit = req.query.limit > 50 ? 50 : +req.query.limit;
    const offset = +req.query.offset || 0;
    const order1 = req.query.order || ['crawled_at', 'ASC'];

    const where = {};
    if (!!req.body.make) { where.make = { [Op.iLike]: `%${req.body.make}%` }; }
    if (!!req.body.model) { where.model = { [Op.iLike]: `%${req.body.model}%` }; }
    if (!!req.body.version) { where.version = { [Op.iLike]: `%${req.body.version}%` }; }
    if (!!req.body.location) { where.location = req.body.location; }
    if (!!req.body.fuel) { where.fuel = req.body.fuel; }
    if (!!req.body.transmission) { where.transmission = req.body.transmission; }
    if (!!req.body.color) { where.color = req.body.color; }
    if (!!req.body.doors) { where.doors = req.body.doors; }

    // image
    if (req.body.has_image === true) { where.image_url = { [Op.ne]: null, [Op.ne]: '' }; }
    else if (req.body.has_image === false) { where.image_url = { [Op.eq]: null, [Op.eq]: '' }; }


    // price range
    const price_from = req.body.price_from ?? 0;
    const price_to = req.body.price_to ?? 1000000;
    where.price = {
      [Op.gte]: price_from,
      [Op.lte]: price_to
    };

    // year range
    const year_from = req.body.year_from ?? 1900;
    const year_to = req.body.year_to ?? new Date().getFullYear();
    where.year = {
      [Op.gte]: year_from,
      [Op.lte]: year_to
    };

    // ad_title contains
    if (!!req.body.ad_title) { where.ad_title = { [Op.iLike]: `%${req.body.ad_title}%` }; }

    // date_published range
    let date_published_from = req.body.date_published_from ?? '2000-01-01';
    date_published_from = new Date(date_published_from);
    let date_published_to = req.body.date_published_to ?? timeLib.getCurrentYYYYMMDD();
    date_published_to = new Date(date_published_to);
    where.date_published = {
      [Op.between]: [date_published_from, date_published_to]
    };


    /* order */
    const order = [order1];

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const { count, rows } = await carsMD.findAndCountAll({ where, limit, offset, order });

    /* send response */
    res.json({
      success: true,
      count,
      data: rows,
      query: req.body
    });


  } catch (err) {
    console.log(err);
    next(err);
  }

};



