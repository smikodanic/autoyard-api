const http = require('http');
const app = require('./app.js');

const StringExt = require('./lib/StringExt.js');
new StringExt();



class Api {

  start(port) {
    // create HTTP server
    this.httpServer = http.createServer(app);
    this.httpServer.listen(port);

    // server events
    this.onError();
    this.onListening();
  }


  /**
   * Event listener for HTTP server "error" event.
   */
  onError() {

    this.httpServer.on('error', error => {
      if (error.syscall !== 'listen') { throw error; }

      if (error.code === 'EACCES') {
        console.log('Port requires elevated privileges'.cliBoja('red', 'italic'));
        console.log(error);
        process.exit(1);
      } else if (error.code === 'EADDRINUSE') {
        console.log('Port is already in use'.cliBoja('red', 'italic'));
        process.exit(1);
      }

    });

  }


  /**
   * Event listener for HTTP server "listening" event.
   */
  onListening() {
    this.httpServer.on('listening', () => {
      const addr = this.httpServer.address();
      console.log(` +API is listening on port ${addr.port}`.cliBoja('green'));
    });
  }


}



module.exports = Api;
