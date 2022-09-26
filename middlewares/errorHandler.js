function errorHandler(err, req, res, next) {
  // если у ошибки нет статуса, выставляем 500
  /* console.log(err); */
  const { statusCode = 500 } = err;
  const { message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500
      ? 'Произошла внутренняя ошибка сервера.'
      : message,
  });
  next();
}

module.exports = { errorHandler };
