/**
 * Fetch o asingle row from scraper_... table.
* Notice returned object must contain fields defined i
* Example of the returned object:
* {
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
* @param {string} scraperTable - scraper_theparking_eu
* @param {object} where - sql where for scraperTable: {"car_id": 150819, "transfered": false}
* @returns {Promise<object>}
*/
module.exports = async (scraperTable, where) => {
  const db = global.api.postgreSQL;
  const modelName = `${scraperTable}MD`;
  const scraperTableMD = db.sequelize.models[modelName];

  if (!scraperTableMD) { throw new Error(`Model ${modelName} does not exist in Sequelize models.`); }

  // Find one row with given criteria
  const scraperTableRow = await scraperTableMD.findOne({
    where,
    raw: true, // Return plain JavaScript object instead of Sequelize instance
  });

  return scraperTableRow;
};


