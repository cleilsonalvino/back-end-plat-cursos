import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Cursos',
    version: '1.0.0',
    description: 'API para gerenciar cursos, com autenticação e controle de acesso.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento',
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.ts', './src/routes/*.ts', './src/routes/components.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec
