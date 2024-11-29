/**
 * Save mapped row in the "cars" table
* The "carsRow" example:
*  {
  ad_url: 'https://www.theparking.eu/used-cars-detail/hyundai-kona/1-6-gdi-hev-premium-sky-navi-leder-18/9X8W213Q.html',
  ad_title: '1.6 gdi hev premium sky navi/leder/18',
  ad_text: '1.6 PREMIUM',
  ad_date: 2024-11-26T00:00:00.000Z,
  make_id: 63,
  model_id: 807,
  version: '1.6 PREMIUM',
  fuel: 'hybrid',
  mileage_km: 2763,
  power_kw: null,
  engine_cc: null,
  year: 2024,
  transmission: 'other',
  color: 'black',
  doors: 5,
  country_id: 125,
  price_eur: 39950,
  image_url: '/lng/en/images/visuel_generique.jpg',
  created_at: 2024-11-29T10:39:50.536Z,
  scraper_table_row: 'scraper_theparking_eu-152274'
}
* @param {string} carsRow
* @returns {Promise<object>} - saved car object
*/
module.exports = async (carsRow) => {
  const db = global.api.postgreSQL;
  const carsMD = db.sequelize.models['carsMD'];
  if (!carsMD) { throw new Error(`Model ${carsMD} does not exist in Sequelize models.`); }
  const results = await carsMD.upsert(carsRow);
  const carsRow_upserted = results?.length ? results[0].dataValues : null;

  // get car make
  const makesMD = db.sequelize.models['makesMD'];
  const make_result = await makesMD.findOne({ where: { make_id: carsRow_upserted.make_id } });
  carsRow_upserted.make = make_result.name;

  // get car model
  const modelsMD = db.sequelize.models['modelsMD'];
  const model_result = await modelsMD.findOne({ where: { model_id: carsRow_upserted.model_id } });
  carsRow_upserted.model = model_result.name;

  // get country
  const countriesMD = db.sequelize.models['countriesMD'];
  const countries_result = await countriesMD.findOne({ where: { country_id: carsRow_upserted.country_id } });
  carsRow_upserted.country = countries_result.name;

  return carsRow_upserted;
};


