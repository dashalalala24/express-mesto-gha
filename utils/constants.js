const CREATED_CODE = 201;
const BAD_REQUEST_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const NOT_FOUND_CODE = 404;
const CONFLICT_CODE = 409;
const SERVER_ERROR_CODE = 500;

const validationErrorMessage = { message: 'Ошибка валидации' };
const serverErrorMessage = { message: 'Ошибка на стороне сервера' };
const unauthorizedErrorMessage = { message: 'Ошибка авторизации' };
const userNotFoundMessage = { message: 'Пользователь не найден' };
const incorrectUserIdMessage = { message: 'Некорректный id пользователя' };
const cardNotFoundMessage = { message: 'Не удалось найти карточку' };
const incorrectCardIdMessage = { message: 'Некорректный id карточки' };
const pageNotFoundMessage = { message: 'Страница не существует' };
const conflictErrorMessage = { message: 'Пользователь с таким email уже зарегистрирован' };

module.exports = {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  NOT_FOUND_CODE,
  CONFLICT_CODE,
  SERVER_ERROR_CODE,
  validationErrorMessage,
  serverErrorMessage,
  unauthorizedErrorMessage,
  userNotFoundMessage,
  incorrectUserIdMessage,
  cardNotFoundMessage,
  incorrectCardIdMessage,
  pageNotFoundMessage,
  conflictErrorMessage,
};
