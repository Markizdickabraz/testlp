const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dbConfig = require('../dbConfig/dbConfig');
const jwt = require('jsonwebtoken');    

const pool = new Pool(dbConfig);

// новий коритсувач
const createUser = async (request, reply) => {
  try {
    const { username, email, password } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
    const result = await pool.query(insertUserQuery, [username, email, hashedPassword]);
    const userId = result.rows[0].id;

    reply.code(201).send({ userId, message: 'Користувача зареєстровано' });
  } catch (error) {
    console.error('Помилка при реєстрації користувача:', error);
    reply.code(500).send({ message: 'Помилка сервера' });
  }
};

// loginUser
const login = async (request, reply) => {
  try {
    const { username, password } = request.body;

    const userQuery = 'SELECT id, username, password FROM users WHERE username = $1';
    const result = await pool.query(userQuery, [username]);

    if (result.rows.length === 0) {
      reply.code(401).send({ message: 'Неправильне ім\'я користувача або пароль' });
      return;
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      reply.code(401).send({ message: 'Неправильне ім\'я користувача або пароль' });
      return;
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, '0ViyG4VRl6', { expiresIn: '1h' });

    reply.send({ message: 'Ви успішно увійшли в систему', token });
  } catch (error) {
    console.error('Помилка під час авторизації користувача:', error);
    reply.code(500).send({ message: 'Помилка сервера' });
  }
};


module.exports = { createUser, login };
