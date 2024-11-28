const transferLib = require('../../lib/transferLib/index.js');




/**
 * POST /cars/transfer
{
  "scraperTable": "scraper_theparking_eu",
  "where": {"car_id": 150819},
  "test": false
}
 * Transfer rows from "scraper_..." table to "cars" table.
 * If test:true then only one row will be transfered.
 */
module.exports = async (req, res, next) => {

  try {
    const scraperTable = req.body.scraperTable;
    const where = req.body.where;
    const test = req.body.test ? true : false;


    /* send response */
    res.json({
      success: true,
      msg: 'The transfer started',
      query: {
        body: req.body
      }
    });


    let i = 1;
    let scraperTableRow = await transferLib.scraperTable_fetchRow(scraperTable, where);
    while (scraperTableRow) {
      console.log(i, '--', scraperTableRow);

      const mapper = transferLib[`mapper_${scraperTable}`];

      // make mapper
      const makesRow = await mapper.map_makeField(scraperTableRow);
      const make_id = makesRow.make_id;
      console.log('makesRow::', makesRow);

      // model mapper
      const modelsRow = await mapper.map_modelField(scraperTableRow, make_id);
      const model_id = modelsRow.model_id;
      console.log('modelsRow::', modelsRow);

      // fuel mapper
      const fuel = await mapper.map_fuelField(scraperTableRow);
      console.log('fuel::', fuel);

      // transmission mapper
      const transmission = await mapper.map_transmissionField(scraperTableRow);
      console.log('transmission::', transmission);

      // country mapper
      const countryRow = await mapper.map_countryField(scraperTableRow);
      const country_id = countryRow.country_id;
      console.log('countryRow::', countryRow);

      // price mapper
      const price_eur = await mapper.map_priceField(scraperTableRow);
      console.log('price_eur::', price_eur);

      // all fields mapper
      const carsRow = await mapper.map_allFields(scraperTable, scraperTableRow, make_id, model_id, fuel, transmission, country_id, price_eur);
      console.log('carsRow::', carsRow);

      if (test) break;
      scraperTableRow = await transferLib.scraperTable_fetchRow(scraperTable, where);
      i++;
    }



  } catch (err) {
    console.log(err);
  }

};




