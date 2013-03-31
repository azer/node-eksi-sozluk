var TEMPLATE  = 'http://eksisozluk.com/{0}?p={1}',
    format    = require("new-format");

module.exports = url;

function url(title, page){
  return format(TEMPLATE, slug(title), page);
}

function slug(title){
  return encodeURI(title).trim().replace(/\s/g, '-');
}
