var TEMPLATE  = '/{0}?p={1}',
    STEMPLATE = '/autocomplete/query?q={0}',
    format    = require("new-format");

module.exports = url;
module.exports.suggestions = suggestions;

function url(title, page){
  return format(TEMPLATE, slug(title), page || 0);
}

function slug(title){
  return encodeURI(title).trim().replace(/\s/g, '-');
}

function suggestions(keyword){
  return format(STEMPLATE, keyword);
}
