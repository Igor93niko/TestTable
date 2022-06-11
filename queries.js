const Pool = require('pg').Pool;
require('dotenv').config();


const pool = new Pool({
  user: process.env.BD_USER,
  host: process.env.BD_HOST,
  database: process.env.BD_BASEDATE,
  password: process.env.BD_PASSWORD,
  port: process.env.BD_PORT,
});

module.exports = pool;