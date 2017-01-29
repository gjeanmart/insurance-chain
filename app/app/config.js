'use strict';
(function(){

    /******************************************
     **** config.js
     ******************************************/

    /*** CONSTANT ***/
    angular.module('insurance')
    .constant('_CONSTANT', {
		'DEBUG'			: true,
		'HTML5_MODE'	: false,
		'VERSION'		: '0.0.1'
	})
    .constant('NETWORKS', [ {
		'id'      : 1,
		'name'    : 'LIVE',
		'eherscan': 'https://etherscan.io/'
	}, {
		'id'      : 2,
		'name'    : 'TEST MORDEN',
		'eherscan': 'https://testnet.etherscan.io/'
	}, {
		'id'      : 3,
		'name'    : 'TEST ROPSTEN',
		'eherscan': 'https://testnet.etherscan.io/'
	}])


    /*** CONFIG ***/
    
    // Enable/disable $log.debug
    .config(['$logProvider', '_CONSTANT', function($logProvider, _CONSTANT){
        $logProvider.debugEnabled(_CONSTANT.DEBUG);
    }])

})();