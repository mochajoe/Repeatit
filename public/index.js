// 'routings'

angular.module('flash-card', ['ngRoute'])

.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
      when('/', {
        templateUrl: './templates/login.html',
        controller: 'LoginCtrl'
      }).
      when('/app', {
        templateUrl: './templates/app.html',
        controller: 'AppCtrl'
      }).
      when('/login', {
        templateUrl: './templates/login.html',
        controller: 'LoginCtrl'
      }).
      when('/create', {
        templateUrl: './templates/createPage.html',
        controller: 'CreatePageCtrl'
      }).
      when('/edit', {
        templateUrl: './templates/editPage.html',
        controller: 'EditPageCtrl'
      }).
      when('/study', {
        controller: 'StudyCtrl',
        templateUrl: './templates/studyPage.html'
      });
  }
]);

angular.module('flash-card')
.run(function($rootScope, $location) {
  $rootScope.showNavOptions = true;
  $rootScope.turnOff = function(){
    $rootScope.showNavOptions = false;
  }
  if($location.url() === '/'){
    $rootScope.showNavOptions = !$rootScope.showNavOptions;
  }
})

// angular.module('flash-card')

// .controller('NavCtrl', function($scope, $location){

//   // $scope.locationFinder = function(){
//   //   if($location.url() === '/'){
//   //     $scope.show = false;
//   //     console.log("HOME")
//   //   }else{
//   //     $scope.show = true;
//   //     console.log("ELSEWHERE")
//   //   }
//   // }
// })
