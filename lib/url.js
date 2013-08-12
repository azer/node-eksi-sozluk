var TEMPLATE  = 'https://eksisozluk.com/{0}?p={1}',
    STEMPLATE = 'https://eksisozluk.com/autocomplete/query?q={0}',
    format    = require("new-format");

module.exports = url;
module.exports.suggestions = suggestions;

function url(title, page){
  return format(TEMPLATE, slug(title), page || 1);
}

function slug(title){
  return encodeURI(title).trim().replace(/\s/g, '-');
}

function suggestions(keyword){
  return format(STEMPLATE, keyword);
}
