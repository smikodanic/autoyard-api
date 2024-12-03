const { Op } = require('sequelize');
const timeLib = require('../../lib/timeLib.js');


/**
 * POST /cars/list?limit=10&offset=0&order=created_at&order_type=DESC
 {
  "ad_title_contains": "volkswagen golf",
  "ad_text_contains": "something",
  "ad_date_from": "2024-06-13",
  "ad_date_to": "2024-10-22"
  "make_id": "1",
  "model_id": "5",
  "version": "CONFORTLINE",
  "fuel": "gasoline",
  "mileage_km_from": 10000,
  "mileage_km_to": 23000,
  "power_kw_from": 0,
  "power_kw_to": 1000,
  "engine_cc_from": 0,
  "engine_cc_to": 10000,
  "year_from": 2000,
  "year_to": 2023,
  "transmission": "manual",
  "color": "grey",
  "doors": "5",
  "country": "Hungary",
  "price_eur_from": 2000,
  "price_eur_to": 6000,
  "has_image": true
}
 */
module.exports = async (req, res, next) => {

  try {
    const limit = req.query.limit > 50 ? 50 : +req.query.limit;
    const offset = +req.query.offset || 0;
    const order1 = req.query.order || 'created_at';
    const order_type = req.query.order_type || 'ASC';
    const db = global.api.postgreSQL;


    /*** find country_id ***/
    let country_id;
    if (req.body.country) {
      const countriesMD = db.sequelize.models['countriesMD'];
      const where_country = { name: { [Op.iLike]: `%${req.body.country}%` } };
      const countriesRow = await countriesMD.findOne({
        where_country,
        raw: true
      });
      country_id = countriesRow ? countriesRow.country_id : null;
    }




    /*** find cars ***/
    const where = {};

    // ad title and text
    if (!!req.body.ad_title_contains) { where.ad_title = { [Op.iLike]: `%${req.body.ad_title_contains}%` }; }
    if (!!req.body.ad_text_contains) { where.ad_title = { [Op.iLike]: `%${req.body.ad_text_contains}%` }; }

    // ad_date range
    if (req.body.ad_date_from && req.body.ad_date_to) {
      const ad_date_from = new Date(req.body.ad_date_from);
      const ad_date_to = new Date(req.body.ad_date_to);
      where.ad_date = {
        [Op.between]: [ad_date_from, ad_date_to]
      };
    }


    // make_id, model_id, version, fuel
    if (!!req.body.make_id) { where.make = req.body.make_id; }
    if (!!req.body.model_id) { where.model = req.body.model_id; }
    if (!!req.body.version) { where.version = { [Op.iLike]: `%${req.body.version}%` }; }
    if (!!req.body.fuel) { where.fuel = req.body.fuel; }

    // mileage range
    const mileage_km_from = req.body.mileage_km_from;
    const mileage_km_to = req.body.mileage_km_to;
    if ((mileage_km_from === 0 || mileage_km_from) && mileage_km_to) {
      where.mileage_km = {
        [Op.gte]: mileage_km_from,
        [Op.lte]: mileage_km_to
      };
    }


    // power range
    const power_kw_from = req.body.power_kw_from;
    const power_kw_to = req.body.power_kw_to;
    if ((power_kw_from === 0 || power_kw_from) && power_kw_to) {
      where.power_kw = {
        [Op.gte]: power_kw_from,
        [Op.lte]: power_kw_to
      };
    }


    // engine_cc range
    const engine_cc_from = req.body.engine_cc_from;
    const engine_cc_to = req.body.engine_cc_to;
    if ((engine_cc_from === 0 || engine_cc_from) && engine_cc_to) {
      where.engine_cc = {
        [Op.gte]: engine_cc_from,
        [Op.lte]: engine_cc_to
      };
    }


    // year range
    const year_from = req.body.year_from;
    const year_to = req.body.year_to;
    if ((year_from === 0 || year_from) && year_to) {
      where.year = {
        [Op.gte]: year_from,
        [Op.lte]: year_to
      };
    }


    if (!!req.body.transmission) { where.transmission = req.body.transmission; }
    if (!!req.body.color) { where.color = req.body.color; }
    if (!!req.body.doors) { where.doors = req.body.doors; }
    if (!!req.body.country_id) { where.country_id = country_id; }

    // price range
    const price_eur_from = req.body.price_eur_from;
    const price_eur_to = req.body.price_eur_to;
    if ((price_eur_from === 0 || price_eur_from) && price_eur_to) {
      where.price_eur = {
        [Op.gte]: price_eur_from,
        [Op.lte]: price_eur_to
      };
    }

    // has image
    if (req.body.has_image === true) { where.image_url = { [Op.ne]: null, [Op.ne]: '' }; }
    else if (req.body.has_image === false) { where.image_url = { [Op.eq]: null, [Op.eq]: '' }; }


    /* order */
    const order = [[order1, order_type]];

    /* send request to DB */
    const carsMD = db.sequelize.models['carsMD'];
    const { count, rows } = await carsMD.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: db.sequelize.models['makesMD'],
          as: 'make', // Use the alias defined in the association
          attributes: ['make_id', 'name'] // Select specific fields
        },
        {
          model: db.sequelize.models['modelsMD'],
          as: 'model', // Use the alias defined in the association
          attributes: ['model_id', 'name'] // Select specific fields
        },
        {
          model: db.sequelize.models['countriesMD'],
          as: 'country', // Use the alias defined in the association
          attributes: ['country_id', 'name'] // Select specific fields
        }
      ],
    });

    const data = rows.map(row => ({
      ...row.toJSON(),
      make: row.make?.name,
      model: row.model?.name,
      country: row.country?.name,
    }));


    /* send response */
    console.log('where::', where);
    // console.log('data::', data);
    res.json({
      success: true,
      count,
      data,
      query: {
        body: req.body,
        where,
        order
      }
    });


  } catch (err) {
    console.log(err);
    next(err);
  }

};



