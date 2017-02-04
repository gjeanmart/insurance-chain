var DefaultBuilder = require("truffle-default-builder");

module.exports = {
	build: new DefaultBuilder({
		"index.html"		: "index.html",
		"views/home.html"	: "app/components/home/home.html",
		
		
		"lib.js": [
			"assets/libs/angular/angular.min.js",
			"assets/libs/angular-resource/angular-resource.min.js",
			"assets/libs/angular-route/angular-route.min.js",
			"assets/libs/angular-messages/angular-messages.min.js",
			"assets/libs/angular-ui-router/release/angular-ui-router.min.js",
			"assets/libs/ui-router-extras/release/ct-ui-router-extras.min.js",
			"assets/libs/jquery/dist/jquery.min.js",
			"assets/libs/bootstrap/dist/js/bootstrap.min.js",
			"assets/libs/web3/dist/web3.min.js"
		],
		"app.js": [
			"app/app.js",
			"app/config.js",
			"app/route.js",
			"app/run.js",
			"app/components/home/home-controller.js"
		],
		
		
		"lib.css": [
			"assets/libs/bootstrap/dist/css/bootstrap.min.css"
		],
		"app.css": [
			"assets/css/app.css"
		],
		
		"assets/images/": "assets/images/"
	}),
	
	networks: {
    		development: {
      			host: "localhost",
      			port: 8545,
      			network_id: "*"
    		}
  	}
};
