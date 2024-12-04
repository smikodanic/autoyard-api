const { Op } = require('sequelize');


/**
 * GET /proc/checker/grab-cars?checked_at_olderthan=2024-11-23&limit=100
 * - "checked_at_olderthan" - defines up to which "checked_at" date will be cars picked up. If checked_at_olderthan=null take cars with NULL value in the "cars" table.
 * - "limit" - how many cars should be listed (max 100)
 */
module.exports.grabCars = async (req, res, next) => {

  try {
    let limit = 100;
    if (req.query.limit > 100) { limit = 100; }

    const checked_at_olderthan = req.query.checked_at_olderthan;
    if (!checked_at_olderthan) { throw new Error('The "checked_at_olderthan" is not defined'); }

    // Build the `where` clause
    const where = {};
    if (checked_at_olderthan) {
      if (checked_at_olderthan.toLowerCase() === 'null') {
        where.checked_at = { [Op.is]: null }; // Filter rows where `checked_at` is NULL
      } else if (!isNaN(Date.parse(checked_at_olderthan))) {
        where.checked_at = { [Op.lt]: new Date(checked_at_olderthan) }; // Filter rows where `checked_at` is older
      } else {
        throw new Error('Invalid date format for "checked_at_olderthan".');
      }
    }

    const order = [['created_at', 'asc']];

    /* send request to DB */
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];
    const rows = await carsMD.findAll({
      where,
      limit,
      order,
      attributes: ['id', 'ad_url', 'ad_title', 'created_at', 'checked_at'],
    });

    /* send response */
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};





/**
 * GET /proc/checker/update-remove-car?car_id=12&action=update|remove
 * - "car_id" - field "id" of cars table
 * - "action" - if action is 'update' then set up checked_at with today date, if action is 'remove' then remove car row, if it's not defined do nothing
 */
module.exports.updateRemoveCar = async (req, res, next) => {

  try {
    const car_id = req.query.car_id;
    const action = req.query.action;
    const db = global.api.postgreSQL;
    const carsMD = db.sequelize.models['carsMD'];

    // validation
    if (!car_id) { throw new Error('The "car_id" is not defined'); }
    if (action !== 'update' && action !== 'remove') { throw new Error('Invalid action. Allowed actions are "update" and "remove".'); }

    if (action === 'update') {
      const currentDate = new Date();
      await carsMD.update({ checked_at: currentDate }, { where: { id: car_id } });
    } else if (action === 'remove') {
      await carsMD.destroy({ where: { id: car_id } });
    }

    /* send response */
    res.json({
      success: true,
      msg: `A car with id:${car_id} is ${action}ed.`
    });

  } catch (err) {
    console.log(err);
    next(err);
  }

};



