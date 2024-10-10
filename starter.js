const envName = process.env.NODE_ENV; // lokal, development, production
const env = require(`./tmp/envs/${envName}.env.js`);


/*** 2. Globals ***/
global.ms_api = {
  DEBUG: envName !== 'production',
  env,
  req: null, // defined in Api/app.js for logErrorApi.js
  res: null, // defined in Api/app.js for logErrorApi.js
};


/*** 3. start HTTP Server i.e. API ***/
const Api = require('./Api');
const api = new Api();
api.start(env.port);
