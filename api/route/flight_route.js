// route/flight_route.js

'use strict';


// Import
var logger = require('../common/log.js');


module.exports = function(app) {
    
    
    /**
     * Validate and retieve flight information
     * @param date: Flight date of departure (ex. 2017-03-31)
     * @param no: Flight No (ex. FR546)
     */
    app.get('/api/v1/flight/:date/:no', (req, res) => {
        logger.debug("getFlight called");
        
        var date = req.params.date;
        logger.debug("date="+date);
        var no = req.params.no;
        logger.debug("no="+no);
        
        res.send(JSON.stringify({ isValid: true }));
    });
};