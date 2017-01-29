'use strict';
(function(){
    
    /******************************************
     **** routes.js
     ******************************************/
    angular.module('insurance')
	.config(['$stateProvider', '$urlRouterProvider', '$stickyStateProvider', '$locationProvider', '_CONSTANT',
    function($stateProvider, $urlRouterProvider, $stickyStateProvider, $locationProvider, _CONSTANT) {
		var v = _CONSTANT.VERSION;
		
        $urlRouterProvider.otherwise("/home");
		
        $locationProvider.html5Mode({
			enabled		: _CONSTANT.HTML5_MODE
		});
        
        $stateProvider
        /*******************************************************
         * HOME
        *******************************************************/
        .state('home', {
            url                 : '/home',
            templateUrl         : 'views/home.html?v='+v,
            controller          : 'homeController',
            ncyBreadcrumb       : {
                label            	: 'Home'
            },
            data            	: { title: 'Home' }
        })
    }]);

})();