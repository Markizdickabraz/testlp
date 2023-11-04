async function authenticate(request, reply) {
  const authHeader = request.headers.authorization;
  
  if (!authHeader) {
    reply.code(401).send({ error: 'Необхідна автентифікація' });
    return;
  }
  
  const authHeaderParts = authHeader.split(' ');
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
    reply.code(401).send({ error: 'Невірний формат автентифікаційного заголовка' });
    return;
  }
  
  const token = authHeaderParts[1];
  

  if (!token) {
    reply.code(401).send({ error: 'Невірний токен' });
  }

}

module.exports = authenticate;
