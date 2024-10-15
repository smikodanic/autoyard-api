const { Op } = require('sequelize');
const timeLib = require('../../lib/timeLib.js');


/**
 * POST /theparking-eu/list?limit=10&skip=0&sort=updated_at
 {
  "make": "Volkswagen",
  "model": "Golf",
  "version": "Gte 1.4",
  "location": "Slovenia",
  "fuel": "Gasoline",
  "transmission": "manual",
  "color": "red",
  "doors": "5",
  "year_from": 2000,
  "year_to": 2010,
  "ad_title": "vw golf",
  "date_published_from": "2024-06-13"
  "date_published_to": "2024-09-15"
 }
 */
module.exports = async (req, res, next) => {

  try {
    const limit = req.query.limit > 50 ? 50 : +req.query.limit;
    const offset = +req.query.offset || 0;
    const order1 = req.query.order || ['crawled_at', 'ASC'];
    console.log(req.query);

    const where = {};
    if (!!req.body.make) { where.make = { [Op.iLike]: `%${req.body.make}%` }; }
    if (!!req.body.model) { where.model = { [Op.iLike]: `%${req.body.model}%` }; }
    if (!!req.body.version) { where.version = { [Op.iLike]: `%${req.body.version}%` }; }
    if (!!req.body.location) { where.location = { [Op.iLike]: `%${req.body.location}%` }; }
    if (!!req.body.fuel) { where.fuel = { [Op.iLike]: `%${req.body.fuel}%` }; }
    if (!!req.body.transmission) { where.transmission = { [Op.iLike]: `%${req.body.transmission}%` }; }
    if (!!req.body.color) { where.color = { [Op.iLike]: `%${req.body.color}%` }; }
    if (!!req.body.doors) { where.doors = { [Op.iLike]: `%${req.body.doors}%` }; }

    const year_from = req.body.year_from ?? 1900;
    const year_to = req.body.year_to ?? new Date().getFullYear();
    where.year = {
      [Op.gte]: year_from,
      [Op.lte]: year_to
    };

    if (!!req.body.ad_title) { where.ad_title = { [Op.iLike]: `%${req.body.ad_title}%` }; }

    let date_published_from = req.body.date_published_from ?? '2000-01-01';
    date_published_from = new Date(date_published_from);

    let date_published_to = req.body.date_published_to ?? timeLib.getCurrentYYYYMMDD();
    date_published_to = new Date(date_published_to);

    where.date_published = {
      [Op.between]: [date_published_from, date_published_to]
    };

    // console.log(where);

    const order = [order1];

    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const { count, rows } = await carsMD.findAndCountAll({ where, limit, offset, order });

    res.json({
      success: true,
      count,
      data: rows,
      where
    });


  } catch (err) {
    console.log(err);
    next(err);
  }

};



