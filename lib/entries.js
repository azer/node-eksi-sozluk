var debug     = require('debug')('eksi-sozluk:entries'),
    range     = require('new-range'),
    pageCount = require('./page-count'),
    extract   = require('./extract'),
    request   = require("./request"),
    urlOf     = require('./url');

exports = module.exports = firstEntries;
exports.newEntries = newEntries;

function entries(options, callback){

  var entries   = [],
      len       = options.to - options.from,
      firstPage = Math.floor( (options.from - 1) / 10 );

  pageCount(options.title, function(error, pageCount){

    if(error) return callback(error);

    if(options.rev){
      firstPage = pageCount - 1;
    }

    (function loop(n){

      if( n < 1 || n > pageCount ){
        callback(undefined, entries);
        return;
      }

      if( entries.length >= len ){
        entries.splice(entries.length - (entries.length - len));
        callback(undefined, entries);
        return;
      }

      page(options.title, n, function(error, content){

        if( ! options.rev && n - 1 == firstPage ){
          content.splice(0, ( options.from - 1 ) % 10);
        }

        entries.push.apply(entries, options.rev ? content.reverse() : content);

        loop( n + ( options.rev ? -1 : 1 ) );

      });

    }(firstPage + 1));


  });

}

function firstEntries(options, callback){
  var result, markAsDone;

  typeof options == 'string' && ( options = { title: options } );
  options.from   || ( options.from = 1 );
  options.to     || ( options.to = options.from + 10 );

  debug('Getting first entries in "%s" from %d to %d', options.title, options.from, options.to);

  entries(options, function(error, entries){

    if(error) return callback(error);

    callback(undefined, { title: options.title, entries: entries });

  });

}

function flatten(list){
  var result = [];

  list.forEach(function(el){
    result.push.apply(result, el);
  });

  return result;
}

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

function newEntries(options, callback){

  var result, markAsDone;

  typeof options == 'string' && ( options = { title: options } );
  options.from   || ( options.from = 0 );
  options.to     || ( options.to = options.from + 10 );
  options.rev = true;

  debug('Getting last entries in "%s" from %d to %d', options.title, options.from, options.to);

  entries(options, function(error, entries){

    if(error) return callback(error);

    callback(undefined, { title: options.title, entries: entries });

  });

}
