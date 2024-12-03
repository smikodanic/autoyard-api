/**
 * Update "transfered" and "transfer_error" fields in the scraper_... table
 *
 * @param {string} scraperTable - scraper_theparking_eu
 * @param {number} scraperTable_car_id - the id of the scraper table: scraper_theparking_eu.car_id
 * @param {boolean} transfered - successful or unsuccessful transfer: true|false
 * @param {number} transfer_id - ID from the cars table, i.e., cars.id  (when transferd:true)
 * @param {string} transfer_error - error.stack if error happens during transfer
 * @returns {Promise<void>}
 */
module.exports = async (scraperTable, scraperTable_car_id, transfered = false, transfer_id = '', transfer_error = '') => {
  const db = global.api.postgreSQL;
  const modelName = `${scraperTable}MD`;
  const scraperTableMD = db.sequelize.models[modelName];

  if (!scraperTableMD) {
    throw new Error(`Model ${modelName} does not exist in Sequelize models.`);
  }

  transfer_error = transfer_error?.slice(0, 100);

  // Perform the update operation
  await scraperTableMD.update(
    {
      transfered,
      transfer_id,
      transfer_error,
    },
    {
      where: { car_id: scraperTable_car_id },
    }
  );
};
