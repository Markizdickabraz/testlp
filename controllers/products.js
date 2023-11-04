const { Pool } = require('pg');
const fetch = require('node-fetch');
const dbConfig = require('../dbConfig/dbConfig');

const pool = new Pool(dbConfig);

// productsById
const productsById = async (request, reply) => {
  const { id } = request.params;

  try {
    const cachedData = await pool.query('SELECT * FROM cached_data WHERE id = $1', [id]);
    if (cachedData.rows.length > 0) {
      reply.send(cachedData.rows[0]);
    } else {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();

      const insertQuery = {
        text: 'INSERT INTO cached_data (id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        values: [data.id, data.title, data.description, data.price, data.discountPercentage, data.rating, data.stock, data.brand, data.category, data.thumbnail, data.images]
      };

      await pool.query(insertQuery);

      reply.send(data);
    }
  } catch (error) {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
}

// products skip
const skipProducts = async (request, reply) => {
  const skip = request.params.skip;
  const limit = parseInt(request.params.limit);
  const id = parseInt(skip) + 1;

  try {
    const cachedData = await pool.query('SELECT * FROM cached_data WHERE id >= $1 LIMIT $2', [id, limit]);
    if (cachedData.rows.length > 0 && cachedData.rows.length >= limit) {
      reply.send(cachedData.rows);
    } else {
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      const data = await response.json();
      for (const item of data.products) {
        const existingRecord = cachedData.rows.find((record) => record.id === item.id);
        if (existingRecord) {
          // Виконати оновлення запису
          const updateQuery = {
            text: 'UPDATE cached_data SET title = $2, description = $3, price = $4, discountPercentage = $5, rating = $6, stock = $7, brand = $8, category = $9, thumbnail = $10, images = $11 WHERE id = $1',
            values: [item.id, item.title, item.description, item.price, item.discountPercentage, item.rating, item.stock, item.brand, item.category, item.thumbnail, item.images]
          };
          await pool.query(updateQuery);
        } else {
          // Виконати вставку нового запису
          const insertQuery = {
            text: 'INSERT INTO cached_data (id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            values: [item.id, item.title, item.description, item.price, item.discountPercentage, item.rating, item.stock, item.brand, item.category, item.thumbnail, item.images]
          };
          await pool.query(insertQuery);
        }
      }
      reply.send(data);
    }
  } catch (error) {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
}




module.exports = {productsById, skipProducts};
