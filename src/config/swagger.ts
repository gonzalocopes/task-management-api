import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'; // Necesario para usar swagger-ui

// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación generada automáticamente con Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Cambia el URL según tu entorno
      },
    ],
  },
  apis: [
    './src/interfaces/*.ts', // Rutas de interfaces
    './src/application/*.ts', // Controladores si tienen anotaciones
  ],
};

// Función para configurar Swagger
const setupSwagger = (app: any) => {
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export { setupSwagger };
