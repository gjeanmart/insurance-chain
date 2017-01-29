'use strict';
(function(){
    
    /******************************************
     **** run.js
     ******************************************/
    angular.module('insurance')
    .run(['$rootScope', '$log', '$filter', '$state', '_CONSTANT', 
    function($rootScope, $log, $filter, $state, _CONSTANT) {
        $log.debug("run.js / run(): START");

   
        // Constants
        $rootScope._CONSTANT = _CONSTANT;
    }]);

})();