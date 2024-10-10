/**
 * Mongoose middleware for mongoDB
 */

const mongoose = require('mongoose');
const util = require('util');


const connOpts = {
  // mongoose
  autoIndex: true, // create indexes when client is connected to db, set to false for production
  maxPoolSize: 100, // maximum number of sockets the MongoDB driver will keep open for this connection
  minPoolSize: 1, // minimum number of sockets the MongoDB driver will keep open for this connection
  socketTimeoutMS: 21000, // how long the MongoDB driver will wait before killing a socket due to inactivity
  family: 4, // 4 - IPv4 , 6 -IPv6
  heartbeatFrequencyMS: 5000, // MongoDB driver sends a heartbeat every heartbeatFrequencyMS to check on the status of the connection

  // mongodb - https://mongodb.github.io/node-mongodb-native/4.2/interfaces/MongoClientOptions.html
  keepAlive: true, // TCP Connection keep alive enabled
  keepAliveInitialDelay: 300000, // The number of milliseconds to wait before initiating keepAlive on the TCP socket
  connectTimeoutMS: 30 * 1000, // The time in milliseconds to attempt a connection before timing out.
};



//events
const onEvent = (conn, uri) => {
  const sigint_cb = () => {
    mongoose.disconnect(() => {
      console.log(`${uri} -disconnected on app termination by SIGINT`.cliBoja('blue'));
      process.exit(0);
    });
  };

  //events mongoose.connection or db
  conn.on('error', (err) => {
    console.log(uri, err, 'readyState:' + conn.readyState);
  });

  conn.on('connected', () => {
    console.log(`${uri} -connected`.cliBoja('blue'));
  });

  // conn.on('open', () => {
  //   console.info(uri, '-connection open');
  // });

  conn.on('reconnected', () => {
    console.log(`${uri} -reconnected`.cliBoja('blue'));
  });

  conn.on('disconnected', () => {
    console.log(`${uri} -disconnected`.cliBoja('blue'));
    process.off('SIGINT', sigint_cb);
  });

  process.on('SIGINT', sigint_cb);
};


// make default connection when nodejs app is started (see: server/app/index.js)
module.exports.connectDefault = (uri) => {
  mongoose.set('strictQuery', false);

  // establish mongoose connection (use 'mongoose.connection')
  const db = mongoose.connect(uri, connOpts);
  // console.log(util.inspect(db));

  onEvent(mongoose.connection, uri);

  return db;
};


// create connection on demand
module.exports.connect = (uri) => {

  // establish mongoose connection (use 'db')
  const db = mongoose.createConnection(uri, connOpts);
  // console.log(util.inspect(db));

  onEvent(db, uri);

  return db;
};


// default schema plugins
module.exports.pluginsDefault = (schema, pluginOpts) => {
  //mongoose.plugin((schema. pluginOpts) {
  //  schema.add({datum: Date});
  //});
};
