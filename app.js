const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('./utils/constants');

// const userRouter = require('./routes/users');
// const cardRouter = require('./routes/cards');
const routes = require('./routes');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send(
//     `<html>
//     <body>
//       <p>тру ля ля!!!!!!!!!!</p>
//     </body>
//     </html>`,
//   );
// });

app.use((req, res, next) => {
  req.user = {
    _id: '641190bf6267ec3618d38492',
  };

  next();
});

app.use(routes);

app.use('*', (req, res, next) => {
  next(res.status(NOT_FOUND).send({ message: 'Страница не существует' }));
});

mongoose.connect(MONGO_URL);

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });
