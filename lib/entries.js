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
      firstPage = Math.floor( (options.from - 1) / 10 ),
      skipped   = 0;

  if( options.rev ) options.from --;

  pageCount(options.title, function(error, pageCount){

    if(error) return callback(error);

    if(options.rev){
      firstPage = pageCount - 1;
    }

    debug('%s has %d pages of entries.', options.title, pageCount);

    (function loop(n){

      if( n < 1 || n > pageCount ){
        debug('Run out of pages on "%s". Returning %d entries.', options.title, entries.length);
        callback(undefined, entries);
        return;
      }

      if( entries.length >= len ){
        entries.splice(entries.length - (entries.length - len));
        debug('Returning %d entries for "%s"', entries.length, options.title);
        callback(undefined, entries);
        return;
      }

      page(options.title, n, function(error, content){

        var len;

        options.rev && ( content = content.reverse() );

        if( ! options.rev && n - 1 == firstPage ){
          content.splice(0, ( options.from - 1 ) % 10);
        } else if ( options.rev && options.from > skipped ){
          len = content.length;
          content = content.slice(options.from - skipped);
          skipped += len - content.length;
        }

        debug('Collected %d entries from %s page#%d', content.length, options.title, n);

        entries.push.apply(entries, content);

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
