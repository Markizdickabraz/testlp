const fastify = require('fastify')();

const {userRoutes,loginRoutes} = require('./routes/api/users');
const {skipRoutes, productsRoutes} = require('./routes/api/products');

userRoutes(fastify);
loginRoutes(fastify);
productsRoutes(fastify);
skipRoutes(fastify);

// Запуск сервера
fastify.listen({ port: 3005 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server is running on port 3005');
});


