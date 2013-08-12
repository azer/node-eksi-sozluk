var request = require("./request"),
    urlOf = require('./url'),
    extract = require('./extract').pageCount;

module.exports = count;

function count(title, callback){
  request(urlOf(title, 1), function(error, body){

    if(error) return callback(error);

    callback(undefined, extract(body));
  });
}
