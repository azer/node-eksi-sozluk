var debug     = require('debug')('eksi-sozluk:range'),
    page      = require('./page'),
    pageCount = require('./page-count');

module.exports = range;

function range(options, callback){

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
