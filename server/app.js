"use strict";

let express = require("express");
let app = express();
let path = require('path');
let crypto = require('crypto');
let config = require('./config');

let mongoUtil = require('./mongoUtil');
mongoUtil.connect();

app.use( express.static(__dirname + "/../client") );

let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post("/encode", (request, response) => {
  let longURL = request.body.longURL;
  let urls = mongoUtil.urls();
  urls.find({"longURL": longURL}).limit(1).next((err, doc) => {
    if(err) {
      return response.json({status: 400, result: err.message});
    }
    if(doc) {
      return response.json({status: 200, result: config.host + '/' + doc.shortURL});
    }else {
      urls.insert({"longURL": longURL, "shortURL": encode(longURL)}, (err, doc) => {
        if(err) {
          return response.json({status: 400, result: err.message});
        }
        return response.json({status: 200, result: config.host + '/' + doc.ops[0].shortURL});
      })
    }
  })
})

app.get("/:short_url", (request, response) => {
  let shortURL = request.params.short_url;
  let urls = mongoUtil.urls();
  urls.find({"shortURL": shortURL}).limit(1).next((err, doc) => {
    if(err) {
      return response.json({status: 400, result: err.message});
    }
    if(!doc) {
      return response.json({status: 404, result: 'URL not found!'});
    }else {
      const pattern = /^((http|https|ftp):\/\/)/;
      let longURL = doc.longURL;
      if(!pattern.test(longURL)) {
        longURL = "http://" + longURL;
      }
      return response.redirect(longURL);
    }
  })
})

app.all('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/../client/index.html'));
});

// shorten long URL to short URL
let encode = function(longURL) {
  const base64 = "abcdefjhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345789";
  let hex = crypto.createHash('md5').update(longURL).digest('hex');
  let subHex = hex.substring(0, 8);
  let output = '';
  let hexint = 0x3FFFFFFF & parseInt(subHex, 16);
  for (let i = 0; i < 5; i++){
    // get index of base64 table
    let index = 0x0000003D & hexint;
    output += base64.charAt(index);
    //right shift five bits
    hexint = hexint >> 5;
  }
  return output;
}

app.listen(config.port, () => console.log( "Listening on " + config.port ));
