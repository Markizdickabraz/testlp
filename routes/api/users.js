const { createUser, login } = require('../../controllers/user');

function userRoutes(fastify) {
  fastify.post('/register', createUser);
}

function loginRoutes(fastify) {
  fastify.post('/login', login);
 }

module.exports = {userRoutes, loginRoutes};
