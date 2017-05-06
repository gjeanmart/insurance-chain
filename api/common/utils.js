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
    }, 
    
    'formatState': function(stateCode) {
            switch (Number(stateCode)) {
                case 0:
                    return {
                        code    : Number(stateCode),
                        label   : "QUOTE"
                    };
                    break;
                case 1:
                    return {
                        code    : Number(stateCode),
                        label   : "PROPOSAL"
                    };
                    break;
                case 2:
                    return {
                        code    : Number(stateCode),
                        label   : "ACCEPTED"
                    };
                    break;
                case 3:
                    return {
                        code    : Number(stateCode),
                        label   : "DECLINED"
                    };
                    break;
                case 4:
                    return {
                        code    : Number(stateCode),
                        label   : "ACTIVE"
                    };
                    break;
                case 5:
                    return {
                        code    : Number(stateCode),
                        label   : "CANCELLED"
                    };
                    break;
                default:
                    return {
                        code    : 99,
                        label   : "UNKNOWN"
                    };
            }
    }
};
module.exports = utils;
