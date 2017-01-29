'use strict';
(function(){
    
    /******************************************
     **** components/home/home-controller.js
     ******************************************/
    angular.module('insurance').controller('homeController', homeController);
    
    homeController.$inject  = ['$scope', '$rootScope', '$log', '$state'];
    function homeController ($rootScope, $scope, $log, $state) {

        $scope.initialize = function() {
            $log.debug("home-controller.js / initialize(): START controller 'homeController'");
        };

        
        

        // INIT
        $scope.initialize();
    }
    
})();