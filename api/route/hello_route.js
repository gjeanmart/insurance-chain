// route/hello_route.js

'use strict';


// Import
var logger = require('../common/log.js');


module.exports = function(app) {
    app.get('/hello', (req, res) => {
        logger.debug("hello called")
        res.send('Hello World2')
    });
};