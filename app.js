const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');

const routes = require('./routes');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

mongoose.connect(MONGO_URL);

// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   res.send({ message: err.message });
// });

// app.use((err, req, res) => {
//   const { statusCode = 500 } = err;

//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? 'Выставилось 500'
//         : 'Че-то другое',
//     });
// });

// app.get((res) => {
//   console.log(res.cookie);
// });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
