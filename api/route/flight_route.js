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
        logger.debug("getFlight called", req.params);
        
        var date    = req.params.date;
        var no      = req.params.no;
        
        if(no === "AAA") {
            res.status(500).send(JSON.stringify({
               status   : 500,
               type     : "FlightAPI",
               message  : "Wrong flight"
            })); 

        } else {
            res.send(JSON.stringify({ isValid: "1" }));
        }
        
    });
};