require('dotenv').config();

/*** Globals ***/
global.ms_api = {
  req: null, // defined in Api/app.js for logErrorApi.js
  res: null, // defined in Api/app.js for logErrorApi.js
};


/*** start HTTP Server i.e. API ***/
const Api = require('./Api');
const api = new Api();
api.start(process.env.API_PORT);
