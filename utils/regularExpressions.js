// Регулярные выражения

// для URL ()
// eslint-disable-next-line no-useless-escape
const validURL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/mi;

// для пароля
const validPassword = /^[a-zA-Z0-9]{8,30}$/;

module.exports = { validURL, validPassword };
