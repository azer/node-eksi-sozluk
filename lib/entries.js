var debug   = require('debug')('eksi-sozluk:entries'),
    range   = require('new-range'),
    extract = require('./extract'),
    request = require("./request"),
    urlOf   = require('./url');

module.exports = entries;

function entries(options, callback){

  var result, markAsDone;

  typeof options == 'string' && ( options = { title: options } );
  options.from   || ( options.from = 0 );
  options.to     || ( options.to = 10 );

  debug('Getting entries in "%s" from %d to %d', options.title, options.from, options.to);

  result       = {};
  result.pages = range(Math.floor(options.from / 10) + 1, Math.round(options.to / 10) + 1);

  result.pages.length || ( result.pages = [1] );

  markAsDone = done(result, callback);

  debug('Pages to get %s', result.pages);

  result.pages.forEach(function(page, ind){

    getPage(options.title.toLowerCase(), page, function(error, content){

      if(error) return done(error);

      if(ind == 0 && options.from != 0){
        content.entries = content.entries.slice((options.from - (options.from % 10 == 0 ? 0 : 1)) % 10);
      }

      if(ind == result.pages.length - 1 && options.to % 10 != 0){
        content.entries = content.entries.slice(0, options.to % 10);
      }

      markAsDone(undefined, page, content);

    });

  });

}

function getPage(title, page, callback){

  var url = urlOf(title, page);

  debug('Fetching %s', url);

  request(url, function(error, body){
    var origTitle = title,
        title, entries;

    if(error) return callback(error);

    title   = extract.title(body);
    entries = extract.entries(body);

    debug('Extracted title: %s', title);

    callback(undefined, { title: title, origTitle: origTitle, entries: entries });

  });

}

function done(result, callback){

  var allEntries  = [],
      pages       = [],
      errorThrown = false;

  return function (error, page, content) {

    if(errorThrown){
      return;
    }

    if(error){
      errorThrown = true;
      callback(error);
      return;
    }

    if( pages.indexOf(page) > -1 ){
      return;
    }

    result.title || ( result.title = content.title );
    allEntries[page] = content.entries;

    pages.push(page);

    if(pages.length == result.pages.length){
      result.entries = flatten(allEntries);
      callback(undefined, result);
    }

  }

}

function flatten(list){
  var result = [];

  list.forEach(function(el){
    result.push.apply(result, el);
  });

  return result;
}
