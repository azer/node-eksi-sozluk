var debug = require('./debug')('request');
var https = require("https");

module.exports = withOptions;

function withOptions(url, callback){

  var options = {
    host: 'eksisozluk.com',
    path: url,
    followRedirect: false,
    headers: {
      'user-agent'       : 'Mozilla/5.0',
      'X-Requested-With' : 'XMLHttpRequest'
    }
  };

  var qs = url.match(/\?([\w\=\&]+)/);

  qs = qs ? '?' + qs[1] : '';

  debug('Sending a request to %s', url);

  function done(error, response, body){
    var redirect;

    if(response && response.headers.location){
      redirect = 'https://eksisozluk.com' + response.headers.location + qs;
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

  };

  https.request(options, function (response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('error', function (error) {
      done(error);
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      done(undefined, response, str);
    });
  }).end();
}
