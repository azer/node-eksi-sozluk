var debug   = require('./debug')('suggestions'),
    url     = require('./url').suggestions,
    request = require("./request");

module.exports = suggestions;

function suggestions(keyword, callback){
  request(url(keyword), function(error, result){

    if(error) return callback(error);

    callback(undefined, JSON.parse(result).Titles);

  });
}
