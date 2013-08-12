var debug   = require('./debug')('entries'),
    extract = require('./extract'),
    range   = require('./range');

exports = module.exports = entries;

function entries(options, callback){
  var result, markAsDone;

  typeof options == 'string' && ( options = { title: options } );
  options.from   || ( options.from = 1 );
  options.to     || ( options.to = options.from + 10 );

  debug('Getting first entries in "%s" from %d to %d', options.title, options.from, options.to);

  range(options, function(error, entries){

    if(error) return callback(error);

    callback(undefined, { title: options.title, entries: entries });

  });

}
