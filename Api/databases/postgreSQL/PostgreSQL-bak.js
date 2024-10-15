const { Sequelize, DataTypes } = require('sequelize');
const chalk = require('chalk');

// models
const homepages_model = require('./models/homepages.model.js');
const log_queries_model = require('./models/log_queries.model.js');
// const log_errors_api_model = require('./models/log_errors_api.model.js');



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
    await this.createHyperTables();
  }


  /**
   * Define models
   */
  defineModels() {
    homepages_model(this.sequelize, DataTypes);
    log_queries_model(this.sequelize, DataTypes);
  }


  /**
  * Create tables.
  */
  async syncTables() {
    // await this.sequelize.sync({ force: true }); // will drop the existing tables in the database and recreate them based on your model definitions
    await this.sequelize.sync(); // NOTICE: If you modify the model (e.g., by adding a new field), you must manually delete the table for the changes to take effect.
  }




  /************* TimeScaleDb [ https://www.timescale.com/ ] */

  /**
   * Convert regular table to TimeScaleDb hypertables
   * https://docs.timescale.com/api/latest/hypertable/create_hypertable/
   */
  async createHyperTables() {
    await this.__createHypertableIfNotExists('log_queries', 'time');
  }


  /**
   * Create TimeScaleDB hypertable (virtual table)
   * @param {string} tableName
   * @param {string} timeColumn
   */
  async __createHypertableIfNotExists(tableName, timeColumn) {
    const [results] = await this.sequelize.query(`
        SELECT EXISTS (
            SELECT 1
            FROM timescaledb_information.hypertable
            WHERE table_name = '${tableName}'
        ) AS is_hypertable;
    `);

    const isHypertable = results[0].is_hypertable;

    if (!isHypertable) {
      await this.sequelize.query(`SELECT create_hypertable('${tableName}', '${timeColumn}');`);
      console.log(chalk.cyan(`  +Hypertable '${tableName}' created successfully.`));
    } else {
      console.log(chalk.cyan(`  -Table '${tableName}' is already a hypertable.`));
    }
  }


}


module.exports = PostgreSQL;
