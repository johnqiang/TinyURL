module.exports = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/tinyURL-dev',
  port: process.env.PORT || 3000,
  host: 'http://localhost:3000',
};
