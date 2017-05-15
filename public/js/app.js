var app = angular.module('app', []).run(function($rootScope){
	$rootScope.d = new Date();
});

app.factory('api', function($q, $http){

	return {

		loadUsers: function(){

			var promessa = $q.defer();

			$http({
				method: 'GET',
				url: 'http://localhost/users'
			}).then(function successCallback(response) {
				promessa.resolve(response.data);
			}, function errorCallback(response) {
				promessa.reject(response);
			});

			return promessa.promise;
		},

		loadUser: function(user){

			var promessa = $q.defer();

			$http({
				method: 'GET',
				url: 'http://localhost/users/' + user._id
			}).then(function successCallback(response) {
				promessa.resolve(response.data);
			}, function errorCallback(response) {
				promessa.reject(response);
			});

			return promessa.promise;
		},

		deleteUser: function(user){
			
			var promessa = $q.defer();

			$http({
				method: 'DELETE',
				url: 'http://localhost/users/' + user._id
			}).then(function successCallback(response) {
				promessa.resolve(response.data);
			}, function errorCallback(response) {
				promessa.reject(response);
			});

			return promessa.promise;
		},

		updateUser: function(user){
			
			var promessa = $q.defer();

			$http({
				method: 'PUT',
				url: 'http://localhost/users/' + user._id,
				data: user,
			}).then(function successCallback(response) {
				promessa.resolve(response.data);
			}, function errorCallback(response) {
				promessa.reject(response);
			});

			return promessa.promise;
		},

		insertUser: function(user){
			
			var promessa = $q.defer();

			$http({
				method: 'POST',
				url: 'http://localhost/users',
				data: user,
			}).then(function successCallback(response) {
				promessa.resolve(response.data);
			}, function errorCallback(response) {
				promessa.reject(response);
			});

			return promessa.promise;
		}
	};
});

app.controller('main', function($rootScope, $scope, api){

	$scope.users = [];
	$scope.user = {};

	$('#user-detail').on('show.bs.modal', function () {
		$scope.user = {};
	});

	$('#user-detail').on('hide.bs.modal', function () {
		$scope.user = {};
	});

	// load all users...
	api.loadUsers().then(function(retorno){
		$scope.users = retorno;
	});

	$scope.year = $rootScope.d.getFullYear();

	// CRUD functions
	$scope.insertUser = function(){
		$("#user-detail").modal('show');
	};

	$scope.loadUser = function(user){

		$("#user-detail").modal('show');

		api.loadUser(user).then(function(retorno){
			$scope.user = retorno;
		},
		function(retorno){
			$("#user-detail").modal('hide');
			alert('Falha ao carregar o usuário');
		});
	};

	$scope.saveUser = function(){

		if(angular.isDefined($scope.user._id)){

			api.updateUser($scope.user).then(function(retorno){

				index = getIndexUser();

				if(index){
					$scope.users[index] = $scope.user;
				}
				

				$("#user-detail").modal('hide');
				alert('Alterações salva com sucesso');
			},
			function(retorno){
				alert('Falhou ao realizar as alterações');
			});

		}else{

			api.insertUser($scope.user).then(function(retorno){
				$scope.users.push(retorno.user);
				alert('Usuario cadastrado com sucesso');
			},
			function(retorno){
				alert('Falhou ao cadastrar o usuário');
			});
		}
	};

	$scope.deleteUser = function(index){

		api.deleteUser($scope.users[index]).then(function(retorno){
			$scope.users.splice(index, 1);
			alert('Usuario removido com sucesso');
		},
		function(retorno){
			alert('Falhou ao remover o usuário');
		});
	};

	function getIndexUser(){

		var index = false;
		angular.forEach($scope.users, function(item,key){

			if($scope.user._id == item._id){
				index = key;
				return true;
			}
		});

		return index;
	}
});