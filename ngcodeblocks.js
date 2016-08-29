angular.module('ngCodeblocks', [])
	.provider('Codeblocks', $CodeblocksProvider)
	.provider('$codeblocks', $CodeblocksProvider)

function $CodeblocksProvider() {

	var provider = this;

	provider.$get = function($q, $http) {

		var config = null;
		var usergridConfig = null;

		return {
			init: _init,
			request: _request	
		}


		function _init(_config) {
			config = traitConfig(_config);
			usergridConfig = {
				baseUrl: config.usergridUrl,
				appId: config.usergridApp,
				orgId: config.usergridOrg,
				token: window.localStorage.getItem('apigee_token')
			};
		}

		function _request(route, method, data) {

			var def = $q.defer();

			route = traitRoute(route);
			data.usergridConfig = usergridConfig;

			$http({
				url: config.codeblocksUrl+route,
				method: method,
				data: data
			}).then(function(success, data) {
				def.resolve(success.data);
			}, function(error) {
				def.reject(error);
			});

			return def.promise;
		}

		function traitRoute(route) {
			if(!route.startsWith('/')) 
				return '/'+route;
			else 
				return route;
		} 

		function traitConfig(_config) {

			var config = _config;

			if(config.usergridUrl && config.usergridOrg && config.usergridApp && config.codeblocksUrl) {

				if(config.usergridUrl.endsWith('/')) {
					config.usergridUrl = config.usergridUrl.slice(0, -1);
				}

				if(config.codeblocksUrl.endsWith('/')) {
					config.codeblocksUrl = config.codeblocksUrl.slice(0, -1);
				}

			}else {
				console.error('The config object is incomplete.');
			}

			return config;
		}

	}

}