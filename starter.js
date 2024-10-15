require('dotenv').config();
const PostgreSQL = require('./Api/databases/postgreSQL/PostgreSQL.js');

/*** Globals ***/
global.api = {
  req: null, // defined in Api/app.js for logErrorApi.js
  res: null, // defined in Api/app.js for logErrorApi.js
};


/*** start HTTP Server i.e. API ***/
const Api = require('./Api');
const api = new Api();
api.start(process.env.API_PORT);


/*** PostgreSQL ***/
const { PG_DATABASE, PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;
global.api.postgreSQL = new PostgreSQL(PG_DATABASE, PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT, false, { force: false }, 'postgres');
