// common/utils.js

'use strict';

// Import
const logger        = require('../common/log.js');

var utils    = {
    
    'trim': function(a) {
          var c = a.indexOf('\0');
          if (c>-1) {
            return a.substr(0, c);
          }
          return a;
    }
};
module.exports = utils;
