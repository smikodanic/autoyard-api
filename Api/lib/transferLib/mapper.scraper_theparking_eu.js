const { Op } = require('sequelize');


/*
Example of the scraper_theparking_eu table row:
{
car_id: 150819,
searchpage_num: 54,
searchpage_url: 'https://www.theparking.eu/used-cars/KIA.html',
car_detail_url: 'https://www.theparking.eu/used-cars-detail/kia-ceed/kia-ceed-1-0-tgdi-88kw-120cv-tech/PGX6V9Q2.html',
redirect_url: 'https://www.theparking.eu/tools/PGX6V9Q2/0/t.html',
external_url: null,
make: 'Kia',
model: 'Ceed',
version: '1.0',
price: 18800,
price_unit: '€',
image_url: 'https://scalethumb.leparking.fr/unsafe/268x225/https://cloud.leparking.fr/2024/11/26/16/05/kia-ceed-kia-ceed-1-0-tgdi-88kw-120cv-tech-blanco_9228776399.jpg',
date_published: 2024-11-26T00:00:00.000Z,
location: 'Spain',
fuel: 'gasoline',
mileage_km: 43000,
year: 2022,
transmission: 'manual',
color: 'white',
doors: '5',
category: 'compact',
ad_title: 'kia - ceed 1.0 tgdi 88kw 120cv tech',
scraped_at: 2024-11-27T00:52:06.884Z,
transfered: false
}
 */



/**
 * Find corresponding make in the "makes" table. If none is found then return 'Other'.
 * @param {object} scraperTableRow
 * @returns
 */
module.exports.map_makeField = async (scraperTableRow) => {
  const make_source = scraperTableRow.make;

  // find corresponding make in "makes" table
  const db = global.api.postgreSQL;
  const makesMD = db.sequelize.models['makesMD'];

  const where = { name: { [Op.iLike]: `%${make_source}%` } };
  const makesRow = await makesMD.findOne({
    where,
    raw: true // Return plain JavaScript object instead of Sequelize instance
  });

  /*** If make is not found, create make and return it ***/
  // if (!makesRow) {
  //   makesRow = await makesMD.create(
  //     {
  //       name: make_source
  //     },
  //     {
  //       returning: true, // Ensure the created row is returned
  //     }
  //   );
  //   makesRow = makesRow.get({ plain: true }); // Convert Sequelize instance to plain object
  // }

  if (!makesRow) { throw new Error(`Map error -make:"${make_source}" table:"scraper_theparking_eu" car_id=${scraperTableRow.car_id}`); }
  return makesRow;
};



/**
 * Find corresponding model in the "models" table. If none is found then return 'Other'.
 * @param {object} scraperTableRow
 * @param {number} make_id - makes.make_id number
 * @returns {object} - The matching or created model row including make_id
 */
module.exports.map_modelField = async (scraperTableRow, make_id) => {
  const model_source = scraperTableRow.model;

  /*** Find corresponding model in "models" table ***/
  const db = global.api.postgreSQL;
  const modelsMD = db.sequelize.models['modelsMD'];

  const where = { make_id, name: { [Op.iLike]: `%${model_source}%` } };
  let modelsRow = await modelsMD.findOne({
    where,
    // attributes: ['model_id', 'make_id', 'name'], // Explicitly select these fields
    raw: true // Return plain JavaScript object instead of Sequelize instance
  });

  /*** If model is not found, create model and return it ***/
  if (!modelsRow) {
    modelsRow = await modelsMD.create(
      {
        make_id,
        name: model_source
      },
      {
        returning: true, // Ensure the created row is returned
      }
    );
    modelsRow = modelsRow.get({ plain: true }); // Convert Sequelize instance to plain object
  }

  if (!modelsRow) { throw new Error(`Map error -model:"${model_source}" table:"scraper_theparking_eu" car_id=${scraperTableRow.car_id}`); }
  return modelsRow;
};



/**
 * Find corresponding country in the "countries" table.
 * @param {object} scraperTableRow
 * @returns {Promise<object>}
 */
module.exports.map_countryField = async (scraperTableRow) => {
  let country_source = scraperTableRow.country;

  if (country_source === 'Moldavie') { country_source = 'Moldova'; }

  // find corresponding country in "countries" table
  const db = global.api.postgreSQL;
  const countriesMD = db.sequelize.models['countriesMD'];

  const where = {
    [Op.or]: [
      { name: { [Op.iLike]: `%${country_source}%` } },
      { other_names: { [Op.iLike]: `%${country_source}%` } }
    ]
  };

  const countriesRow = await countriesMD.findOne({
    where,
    raw: true // Return plain JavaScript object instead of Sequelize instance
  });

  if (!countriesRow) { throw new Error(`Map error country:"${scraperTableRow.country}" table:"scraper_theparking_eu" car_id=${scraperTableRow.car_id}`); }
  return countriesRow;
};



/**
 * Transform fuel from "scraper_..." table to "cars" table.
 * @param {object} scraperTableRow
 * @returns {string}
 */
module.exports.map_fuelField = async (scraperTableRow) => {
  // carsTable_fuel:scraperTable_fuel
  const mapperObj = {
    'gasoline': 'gasoline',
    'diesel': 'diesel',
    'electric': 'electric',
    'hydrogen': undefined,
    'hybrid': 'hybrid',
    'ethanol': 'ethanol',
    'methanol': undefined,
    'solar': undefined,
    'LPG (Liquefied Petroleum Gas)': 'lpg',
    'NGV (Natural Gas Vehicle)': 'ngv',
    'CNG (Compressed Natural Gas)': undefined,
    'PHEV (Plug In Hybrid Electric Vehicle)': undefined,
    'DME (Dimethyl Ether)': undefined,
  };

  let fuel = 'other';
  for (const [carsTable_fuel, scraperTable_fuel] of Object.entries(mapperObj)) {
    if (scraperTable_fuel === scraperTableRow.fuel) { fuel = carsTable_fuel; }
  }

  return fuel;
};



/**
 * Transform transmission from "scraper_..." table to "cars" table.
 * @param {object} scraperTableRow
 * @returns {string}
 */
module.exports.map_transmissionField = async (scraperTableRow) => {
  // carsTable_transmission:scraperTable_transmission
  const mapperObj = {
    'manual': 'maual',
    'automatic': 'automatic'
  };

  let transmission = 'other';
  for (const [carsTable_transmission, scraperTable_transmission] of Object.entries(mapperObj)) {
    if (scraperTable_transmission === scraperTableRow.transmission) { transmission = carsTable_transmission; }
  }

  return transmission;
};


/**
 * Transform price from "scraper_..." table to "cars" table.
 * @param {object} scraperTableRow
 * @returns {number}
 * @throws {Error} If exchange rate is not found or price is invalid
 */
module.exports.map_priceField = async (scraperTableRow) => {
  const base_currency = 'EUR'; // ONLY CHANGE THIS, for example 'BAM'
  const target_currency = 'EUR';

  const db = global.api.postgreSQL;
  const exchange_ratesMD = db.sequelize.models['exchange_ratesMD'];

  // Fetch exchange rate from the database
  const exchange_ratesRow = await exchange_ratesMD.findOne({
    where: { base_currency, target_currency },
    raw: true // Return plain JavaScript object instead of Sequelize instance
  });

  // Check if exchange rate exists
  if (!exchange_ratesRow) {
    throw new Error(`Exchange rate not found for ${base_currency} to ${target_currency}`);
  }

  // Validate scraperTableRow.price
  if (!!scraperTableRow.price && (typeof scraperTableRow.price !== 'number' || isNaN(scraperTableRow.price))) {
    throw new Error(`Invalid price value "${scraperTableRow.price}" in car_id:${scraperTableRow.car_id}`);
  }

  // Convert price using the exchange rate
  const price = +(exchange_ratesRow.rate * scraperTableRow.price).toFixed(2);
  return price;
};





/**
 * Map all fields from scraperTableRow to the appropriate field in the "cars" table.
 * @param {string} scraperTable - the scraper_... table name
 * @param {object} scraperTableRow - row (object) from the scraper_... table
 * @param {number} make_id - makes.make_id number
 * @param {number} model_id - models.model_id number
 * @param {string} fuel - gasoline,diesel, ...
 * @param {'manual'|'automatic'|'other'} transmission
 * @param {number} country_id - countries.country_id number
 * @param {number} price_eur - price in EUR
 * @returns {Promise<object>}
 */
module.exports.map_allFields = async (scraperTable, scraperTableRow, make_id, model_id, fuel, transmission, country_id, price_eur) => {
  const carsRow = {
    ad_url: scraperTableRow.car_detail_url,
    ad_title: scraperTableRow.ad_title,
    ad_text: null,
    ad_date: scraperTableRow.date_published,
    make_id: make_id,
    model_id: model_id,
    version: scraperTableRow.version,
    fuel,
    mileage_km: scraperTableRow.mileage_km,
    power_kw: null,
    engine_cc: null,
    year: scraperTableRow.year,
    transmission,
    color: scraperTableRow.color,
    doors: scraperTableRow.doors ? parseInt(scraperTableRow.doors, 10) : null,
    country_id,
    price_eur,
    image_url: scraperTableRow.image_url,
    created_at: new Date(),
    scraper_table_row: `${scraperTable}-${scraperTableRow.car_id}`,
  };

  return carsRow;
};


