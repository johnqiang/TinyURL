module.exports = {
  mongoURL: process.env.MONGO_URL || 'mongodb://admin:admin@ds025263.mlab.com:25263/tinyurl-dev',
  port: process.env.PORT || 3000,
  host: 'http://tiny-url-qz.herokuapp.com',
};
