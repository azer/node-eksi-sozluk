var request = require("./request"),
    url     = require('./url'),
    extract = require('./extract').pageCount;

module.exports = count;

function count(title, callback){
  request(url(title), function(error, body){

    if(error) return callback(error);

    callback(undefined, extract(body));
  });
}
