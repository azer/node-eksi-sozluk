var TEMPLATE  = 'http://eksisozluk.com/{0}?p={1}',
    STEMPLATE = 'http://eksisozluk.com/autocomplete/query?q={0}',
    format    = require("new-format");

module.exports = url;
module.exports.suggestions = suggestions;

function url(title, page){
  return format(TEMPLATE, slug(title), page);
}

function slug(title){
  return encodeURI(title).trim().replace(/\s/g, '-');
}

function suggestions(title){
  return format(STEMPLATE, title);
}
