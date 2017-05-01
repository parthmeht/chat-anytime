app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl: 'static/views/login.html',
        controller: 'LoginController'
    }).
    when('/register', {
      templateUrl: 'static/views/register.html',
      controller: 'LoginController'
    }).when('/home', {
        templateUrl: 'static/views/home.html',
        controller: 'HomeController',
    }).when('/change-password', {
        templateUrl: 'static/views/change-password.html',
        controller: 'HomeController',
    }).
    otherwise({
      redirectTo: '/login'
    });

}]);