const {productsById, skipProducts} = require('../../controllers/products');
const authenticate = require('../../middleware/auth');

function productsRoutes(fastify) { 
  fastify.get('/products/:id', { preHandler: [authenticate] }, productsById);
}

function skipRoutes(fastify) { 
fastify.get('/products/:limit/:skip', { preHandler: [authenticate] }, skipProducts);
}

module.exports = {productsRoutes, skipRoutes};
