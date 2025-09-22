import swaggerJSDoc from 'swagger-jsdoc';
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
};
const options = {
    swaggerDefinition,
    apis: ['./src/modules/**/*.js', './src/routes/*.js', './src/routes/components.js'],
};
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
