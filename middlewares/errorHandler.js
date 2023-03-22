const errorHandler = (err, req, res, next) => {
  const { statusCode = 500 } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка на стороне сервера'
        : err.message,
    });
};

module.exports = errorHandler;
