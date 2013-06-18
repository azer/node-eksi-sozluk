var debug   = require("debug")('page'),
    urlOf   = require('./url'),
    request = require('./request'),
    extract = require('./extract');

module.exports = page;

function page(title, n, callback){

  var url = urlOf(title, n);

  debug('Fetching %s', url);

  request(url, function(error, body){

    var origTitle = title,
        title, entries;

    if(error) return callback(error);

    if(body) {
      title   = extract.title(body);
      entries = extract.entries(body);

      debug('Extracted title: %s', title);
    }

    callback(undefined, entries);

  });

}
