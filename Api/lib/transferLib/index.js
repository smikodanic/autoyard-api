const scraperTable_fetchRow = require('./scraperTable_fetchRow.js');
const scraperTable_updateTransferFields = require('./scraperTable_updateTransferFields.js');
const carsTable_upsertRow = require('./carsTable_upsertRow.js');

const mapper_scraper_theparking_eu = require('./mapper.scraper_theparking_eu.js');


/**
 * Libs to transfer and map rows from "scraper_..." table to "cars" table.
 */
module.exports = {
  scraperTable_fetchRow,
  scraperTable_updateTransferFields,
  carsTable_upsertRow,

  mapper_scraper_theparking_eu
};
