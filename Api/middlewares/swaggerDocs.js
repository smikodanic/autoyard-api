const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');


// Function to merge all YAML files into a single Swagger document
const loadSwaggerDocs = (directory) => {
  const swaggerDocs = {
    openapi: '3.0.0',
    info: {
      title: 'AutoYard API',
      version: '1.0.0',
      description: 'Car search engine.',
    },
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: process.env.API_ENV === 'development' ? 'http' : 'https',
          scheme: 'bearer',
          bearerFormat: 'Bearer',
        }
      }
    },
    servers: [
      {
        url: process.env.API_ENV === 'development' ? 'http://localhost:3138' : 'https://api.autoyard.eu/'
        // url: process.env.API_ENV === 'development' ? 'http://localhost:3138' : 'http://38.242.251.114:3138'
      }
    ]
  };

  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const swaggerFile = YAML.load(filePath);
    Object.assign(swaggerDocs.paths, swaggerFile.paths);
  });

  return swaggerDocs;
};

// Load Swagger docs from the "swagger" directory
const swaggerDocs = loadSwaggerDocs(path.join(__dirname, '../swagger'));


module.exports = swaggerDocs;
