var debug  = require("debug"),
    prefix = 'eksi';

module.exports = function(name){
  return debug(prefix + ':' + name);
};
