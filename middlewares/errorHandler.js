const errorHandler = (err, req, res) => {
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
