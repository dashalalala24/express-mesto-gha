const CREATED_CODE = 201;
const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

const validationErrorMessage = { message: 'Ошибка валидации' };
const serverErrorMessage = { message: 'Ошибка на стороне сервера' };
const userNotFoundMessage = { message: 'Пользователь не найден' };
const incorrectUserIdMessage = { message: 'Некорректный id пользователя' };
const cardNotFoundMessage = { message: 'Не удалось найти карточку' };
const incorrectCardIdMessage = { message: 'Некорректный id карточки' };
const pageNotFoundMessage = { message: 'Страница не существует' };

module.exports = {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  validationErrorMessage,
  serverErrorMessage,
  userNotFoundMessage,
  incorrectUserIdMessage,
  cardNotFoundMessage,
  incorrectCardIdMessage,
  pageNotFoundMessage,
};
