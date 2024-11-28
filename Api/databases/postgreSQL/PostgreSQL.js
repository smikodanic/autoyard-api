const { Sequelize, DataTypes } = require('sequelize');
const chalk = require('chalk');

//// PostgreSQL models
const makes_model = require('./models/makes.model.js');
const models_model = require('./models/models.model.js');
const countries_model = require('./models/countries.model.js');
const cars_model = require('./models/cars.model.js');
const exchange_rates_model = require('./models/exchange_rates.model.js');
// scrapers
const scraper_theparking_eu_model = require('./models/scraper_theparking_eu.model.js');


class PostgreSQL {

  /**
   * @param {string} database
   * @param {string} username
   * @param {string} password
   * @param {string} host
   * @param {number} port
   * @param {boolean} logging
   * @param {object} sync -  { force: true } - force true will drop the existing tables in the database and recreate them based on your model definitions
   * @param {string} dialect -  'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle'
   */
  constructor(database, username, password, host, port, logging, sync = { force: false }, dialect = 'postgres') {
    this.sequelize = new Sequelize(database, username, password, {
      // options: https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor
      host,
      port,
      logging,
      dialect,
      sync
    });

    this._init();
    console.log(chalk.cyan(` postgresql ${host}:${port}/${database} synced with force: ${sync.force}`));
  }


  async _init() {
    this.defineModels();
    await this.syncTables();
  }


  /**
   * Define models
   */
  defineModels() {
    makes_model(this.sequelize, DataTypes);
    models_model(this.sequelize, DataTypes);
    countries_model(this.sequelize, DataTypes);
    exchange_rates_model(this.sequelize, DataTypes);

    cars_model(this.sequelize, DataTypes);

    scraper_theparking_eu_model(this.sequelize, DataTypes);
  }



  /**
  * Create tables.
  */
  async syncTables() {
    // await this.sequelize.sync({ force: true }); // will drop the existing tables in the database and recreate them based on your model definitions
    await this.sequelize.sync(); // NOTICE: If you modify the model (e.g., by adding a new field), you must manually delete the table for the changes to take effect.
  }



  /******* FIELD CORRECTORS **********/
  /**
   * Correct value which should be entered into table column.
   * @param {string[]} val - text to be inserted
   * @returns {string[]}
   */
  correctValue(val) {
    val = val.replace(/\'|\|\`"/g, '');
    return val;
  }

  /**
   * Correct values which should be entered into table columns.
   * @param {string[]} vals - array of texts to be inserted
   * @returns {string[]}
   */
  correctValues(vals) {
    vals = vals.map(val => {
      val = this.correctValue(val);
      return val;
    });
    return vals;
  }

  /**
   * Convert javascript array to postgresql array.
   * the postgres array has curly brackets.
   * ['a', 'b'] --> {'a', 'b'}
   * @param js_arr [Array] - javascript array
   */
  jsArray_to_pgArray(js_arr = []) {
    const joined = js_arr.join(', ').trim().replace(/^\,/, '').replace(/\,$/, '').replace(/\s+/g, ' ');
    const pg_arr = `{${joined}}`;
    return pg_arr;
  }




}


module.exports = PostgreSQL;
