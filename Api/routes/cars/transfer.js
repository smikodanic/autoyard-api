const chalk = require('chalk');
const transferLib = require('../../lib/transferLib/index.js');




/**
 * POST /cars/transfer
{
  "scraperTable": "scraper_theparking_eu",
  "where": {"car_id": 150819, "transfered": false},
  "transferLimit": 1
}
 * Transfer rows from "scraper_..." table to "cars" table.
 * "scraperTable":string - the name of the scraper table, for example "scraper_theparking_eu"
 * "where":object - SQL where statement for scraper table
 * "transferLimit":number - how many rows from scraper table will be taken
 */
module.exports = async (req, res, next) => {

  try {
    const scraperTable = req.body.scraperTable;
    const where = req.body.where;
    const transferLimit = +req.body.transferLimit ?? 0;


    let scraperTableRow = await transferLib.scraperTable_fetchRow(scraperTable, where);

    if (!scraperTableRow) {
      const err_message = `No row found with the given criteria. ${JSON.stringify(where)}`;
      console.log(chalk.redBright(err_message));
      res.json({
        success: true,
        msg: 'The transfer completed with error',
        err_message,
        query: {
          body: req.body
        }
      });
    }

    let i = 1;
    while (scraperTableRow) {
      let err_message = '';
      try {
        // console.log(i, '--', scraperTableRow);

        /* mpping */
        const mapper = transferLib[`mapper_${scraperTable}`];

        // make mapper
        const makesRow = await mapper.map_makeField(scraperTableRow);
        const make_id = makesRow.make_id;
        // console.log('makesRow::', makesRow);

        // model mapper
        const modelsRow = await mapper.map_modelField(scraperTableRow, make_id);
        const model_id = modelsRow.model_id;
        // console.log('modelsRow::', modelsRow);

        // fuel mapper
        const fuel = await mapper.map_fuelField(scraperTableRow);
        // console.log('fuel::', fuel);

        // transmission mapper
        const transmission = await mapper.map_transmissionField(scraperTableRow);
        // console.log('transmission::', transmission);

        // country mapper
        const countryRow = await mapper.map_countryField(scraperTableRow);
        const country_id = countryRow.country_id;
        // console.log('countryRow::', countryRow);

        // price mapper
        const price_eur = await mapper.map_priceField(scraperTableRow);
        // console.log('price_eur::', price_eur);

        // all fields mapper
        const carsRow = await mapper.map_allFields(scraperTable, scraperTableRow, make_id, model_id, fuel, transmission, country_id, price_eur);
        // console.log('carsRow::', carsRow);


        /* save row in the "cars" table */
        const carsRow_upserted = await transferLib.carsTable_upsertRow(carsRow);
        // console.log('carsRow_upserted::', carsRow_upserted);


        /* update fields "transfered" and "transfer_car_id" in the scraper table */
        const scraperTable_car_id = scraperTableRow.car_id;
        const transfered = true;
        const transfer_id = carsRow_upserted.id;
        const transfer_error = null;
        await transferLib.scraperTable_updateTransferFields(scraperTable, scraperTable_car_id, transfered, transfer_id, transfer_error);


        /* log on success */
        console.log(chalk.greenBright(`${i}. + cars.id: ${carsRow_upserted.id} | ${carsRow_upserted.make} | ${carsRow_upserted.model} | ${carsRow_upserted.country} | ${carsRow_upserted.price_eur}€ | ${carsRow_upserted.fuel} | ${carsRow_upserted.year} | color:${carsRow_upserted.color} | ${carsRow_upserted.ad_title}`));

      } catch (err) {
        err_message = err.message;

        /* update fields "transfered" and "transfer_error" in the scraper table */
        const scraperTable_car_id = scraperTableRow.car_id;
        const transfered = true;
        const transfer_id = null;
        const transfer_error = `car_id:${scraperTableRow.car_id} -` + err.stack;
        await transferLib.scraperTable_updateTransferFields(scraperTable, scraperTable_car_id, transfered, transfer_id, transfer_error);

        /* log on error */
        console.log();
        console.log(chalk.redBright(`${i}. - ${err_message}`));
        console.log(chalk.red(err.stack));
        console.log(scraperTableRow);
        console.log();
      }


      /* send response after first fetched and transfered row */
      if (i === 1) {
        res.json({
          success: true,
          msg: 'The transfer started',
          err_message,
          query: {
            body: req.body
          }
        });
      }

      if (i >= transferLimit) break;

      scraperTableRow = await transferLib.scraperTable_fetchRow(scraperTable, where);
      i++;
    }



  } catch (err) {
    console.log(err);
  }

};




