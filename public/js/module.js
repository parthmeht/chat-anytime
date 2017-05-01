var app = angular.module('app', ['ngRoute', 'ngResource', 'ngCookies']);

app.run(['$rootScope', '$location', '$cookieStore', '$http', 'LoginFactory',
    function ($rootScope, $location, $cookieStore, $http, LoginFactory) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && $location.path() !== '/register' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }else if (($location.path() == '/login' || $location.path() == '/register' || $location.path() == '/') && $rootScope.globals.currentUser) {
                $location.path('/home');
            }
        });
    }]);