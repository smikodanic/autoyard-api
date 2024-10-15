const morgan = require('morgan');
const passport = require('passport');
const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./middlewares/swaggerDocs.js');

const cors = require('./middlewares/cors.js');
const { defineStrategy4api } = require('./middlewares/auth/passportstrategy_bearer.js');
const logErrorApi = require('./middlewares/logErrorApi.js');



/***** MIDDLEWARES *****/
app.use(morgan('dev')); // must be first to log each request
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors);


// auth middlewares
app.use(passport.initialize()); // initialize passport module
defineStrategy4api();



/***** GLOBAL  ****/
app.use((req, res, next) => { global.api.req = req; global.api.res = res; next(); }); // save req to global variable for use in logErrorApi.js



/***** API ROUTES *****/
app.use('/info', require('./routes/info.js'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/theparking-eu', require('./routes/theparking-eu/index.js'));




/******************** ERROR HANDLERS *******************/
const onBadURL = logErrorApi.onBadURL.bind(logErrorApi);
const onEndpointError = logErrorApi.onEndpointError.bind(logErrorApi); // bind() because 'this' is used inside onEndpointError() method
const onUncaught = logErrorApi.onUncaught.bind(logErrorApi);
const onUnhandled = logErrorApi.onUnhandled.bind(logErrorApi);
app.use(onBadURL); // 404 not found middleware
app.use(onEndpointError); // send error to client, mongo or console
onUncaught(); // uncaught exceptions
onUnhandled(); // onUnhandled exception



module.exports = app;
