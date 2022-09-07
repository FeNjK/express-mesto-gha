const DB_URL = 'mongodb://localhost:27017/mestodb';

const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // целесообразно ли ?!.
};

// Если я правильно понял документацию,
// то спустя какое-то время следует добавить
// ещё один параметр, а именно
// capped: 1024 - где 1024 размер коллекции в байтах

module.exports = { DB_URL, DB_OPTIONS };
