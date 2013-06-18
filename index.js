var entries     = require("./lib/entries"),
    pageCount   = require('./lib/page-count'),
    page        = require('./lib/page'),
    suggestions = require('./lib/suggestions');

exports             =
module.exports      = entries;
exports.page        = page;
exports.pageCount   = pageCount;
exports.suggestions = suggestions;
