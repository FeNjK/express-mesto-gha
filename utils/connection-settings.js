// Я не знаю почему автотесты не видят этот файл.
// Пришлось подключаться к серверу в app.js напрямую, а не через константы
// оставлю наа 14 спринт, вдруг там заработают настройки.

const DB_URL = 'mongodb://localhost:27017/mestodb';

const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  serverSelectionTimeoutMS: 5000, // целесообразно ли ?!.
};

// Если я правильно понял документацию,
// то спустя какое-то время следует добавить
// ещё один параметр, а именно
// capped: 1024 - где 1024 размер коллекции в байтах

module.exports = { DB_URL, DB_OPTIONS };
