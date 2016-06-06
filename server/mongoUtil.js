"use strict";

let mongo = require('mongodb');
let config = require('./config');
let client = mongo.MongoClient;
let _db;

module.exports = {
  connect() {
    client.connect(config.mongoURL, (err, db) => {
      if(err) {
        console.log("Error connecting to Mongo - check mongod connection");
        process.exit(1);
      }
      _db = db;
      console.log("Connected to Mongo");
    });
  },
  urls(){
    return _db.collection('urls');
  }
}
