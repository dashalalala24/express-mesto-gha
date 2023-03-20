require('dotenv').config();

const { PORT = '3000' } = process.env;
const { DB_ADDRESS = 'mongodb://localhost:27017/mestodb' } = process.env;

module.exports = {
  PORT,
  DB_ADDRESS,
};
