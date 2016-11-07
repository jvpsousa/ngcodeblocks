angular.module('ngCodeblocks', [])
	.provider('Codeblocks', $CodeblocksProvider)
	.provider('$codeblocks', $CodeblocksProvider)

function $CodeblocksProvider() {

	var provider = this;

	provider.$get = function($q, $http) {

		return {
			init: _init,
			request: _request
		}


		function _init(url) {
			codeblocksUrl = url;
		}

		function _request(route, method, data) {

			var def = $q.defer();

			route = traitRoute(route);

			data.usergridToken = window.localStorage.getItem('apigee_token');					

			$http({
				url: codeblocksUrl+route,
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

	}

}
