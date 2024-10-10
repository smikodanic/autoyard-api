const theparking_eu_model = require('../../models/theparking_eu.model.js');
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
    const limit = req.query.limit ?? 25;
    const skip = req.query.skip ?? 0;
    const sort = req.query.sort ?? 'updated_at';

    const moQuery = {};
    if (!!req.body.make) { moQuery.make = { $regex: req.body.make, $options: 'i' }; }
    if (!!req.body.model) { moQuery.model = { $regex: req.body.model, $options: 'i' }; }
    if (!!req.body.version) { moQuery.version = { $regex: req.body.version, $options: 'i' }; }
    if (!!req.body.location) { moQuery.location = { $regex: req.body.location, $options: 'i' }; }
    if (!!req.body.fuel) { moQuery.fuel = { $regex: req.body.fuel, $options: 'i' }; }
    if (!!req.body.transmission) { moQuery.transmission = { $regex: req.body.transmission, $options: 'i' }; }
    if (!!req.body.color) { moQuery.color = { $regex: req.body.color, $options: 'i' }; }
    if (!!req.body.doors) { moQuery.doors = req.body.doors; }

    const year_from = req.body.year_from ?? 1900;
    const year_to = req.body.year_to ?? new Date().getFullYear();
    moQuery.year = { $gte: year_from, $lte: year_to };

    if (!!req.body.ad_title) { moQuery.ad_title = { $regex: req.body.ad_title, $options: 'i' }; }

    const date_published_from = req.body.date_published_from ?? '2000-01-01';
    const date_published_to = req.body.date_published_to ?? timeLib.getCurrentYYYYMMDD();
    moQuery.date_published = { $gte: date_published_from, $lte: date_published_to };

    // console.log(moQuery);

    const results = await theparking_eu_model.list(moQuery, limit, skip, sort);

    res.json(results);

  } catch (err) {
    next(err);
  }

};



