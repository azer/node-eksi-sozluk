var request = require("request");

module.exports = withOptions;

function withOptions(url, callback){

  var options = {
    url: url,
    followRedirect: false,
    headers: {
      'user-agent'       : 'Mozilla/5.0',
      'X-Requested-With' : 'XMLHttpRequest'
    }
  };

  var qs       = url.match(/\?([\w\=\&]+)/),
      hostname = url.match(/(\w+:\/\/[^\/]+)/)[1];

  qs = qs ? '?' + qs[1] : '';

  return request(options, function(error, response, body){

    if(response.headers.location){
      withOptions(hostname + response.headers.location + qs, callback);
      return;
    }

    if(error)
      callback(error);

    if (response.statusCode == 200)
      callback(undefined, body);

    if (response.statusCode >= 400)
      callback(new Error('HTTP ' + response.statusCode));

  });
}
