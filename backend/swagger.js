const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevStack Hub API',
      version: '1.0.0',
      description: 'Documentación de la API de DevStack Hub',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Rutas a los archivos con anotaciones Swagger
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
