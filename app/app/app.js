'use strict';
(function(){
    
    /******************************************
     **** app.js
     **** Entry point for the AngularJS application
     **** 
     **** Define the application's name  and a list of mdoules (libraries)
     ******************************************/
    angular.module('insurance', 
        [   
			'ngRoute', 
            'ngResource',
			'ui.router',
            'ct.ui.router.extras'
        ]
    );
    
})();