var debug = require('./debug')('request');
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

  debug('Sending a request to %s', url);

  return request(options, function(error, response, body){

    var redirect;

    if(response && response.headers.location){
      redirect = hostname + response.headers.location + qs;
      debug('Redirecting to: ', redirect);
      withOptions(redirect, callback);
      return;
    }

    if(error) {
      return callback(error);
    }

    if (response.statusCode == 200)
      return callback(undefined, body);

    if (response.statusCode >= 400)
      return callback(new Error('HTTP ' + response.statusCode));

  });
}
