const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT, DB_ADDRESS } = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

mongoose.connect(DB_ADDRESS);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
