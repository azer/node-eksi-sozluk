var style        = require('styled'),
    dateFormat   = require('dateformat'),

    firstEntries = require('./entries'),
    lastEntries  = require('./entries').newEntries,
    _suggestions = require('./suggestions');

module.exports = {
  entries     : entries,
  newEntries  : newEntries,
  suggestions : suggestions
};

function entries(options){
  firstEntries(options, listEntries);
}

function newEntries(options){
  lastEntries(options, listEntries);
}

function entryView(entry){
  return '        '
    + entry.content
    + '\n        '
    + style.grey( dateFormat(new Date(entry.ts), 'mmmm dS, yyyy')
                  + ' @' + entry.author
                  + ' #' + entry.id
                );
}

function listEntries(error, result){

    if(error) throw error;

    var output;

    if(result.entries.length == 0)
      output = '\n     Entry bulunamadi.\n\n';
    else
      output = '\u001B[2J\u001B[0;0f'
          + '\n     '
          + style.bold(result.title)
          + '\n\n'
          + result.entries.map(entryView).join('\n\n\n')
          + '\n\n';

    process.stdout.write(output);

  }

function suggestions(title){
  _suggestions(title, function(error, result){
    if(error) throw error;

    var output = '\u001B[2J\u001B[0;0f'
          + '\n     '
          + 'Suggestions for '
          + style.bold(title)
          + ': \n\n'
          + result.map(tab).join('\n')
          + '\n\n';

    process.stdout.write(output);

    process.exit(0);
  });
}

function tab(str){
  return '          · ' + str;
}
