app.controller('LoginController', ['$scope', '$rootScope', '$location', 'LoginFactory', function ($scope,$rootScope,$location,LoginFactory) {
    
    $scope.mailDiv = true;
    $scope.tokenDiv = false;
    // reset login status
    LoginFactory.ClearCredentials();

    LoginFactory.getBase().then(function (response) {
        console.log(response);
        $scope.message = response.data;
    }, function(error) {
        $scope.message = 'Unable to connect ';
        $('#messageModal').modal('show');
        console.log($scope.message);
    });

    $scope.register = function() {
        console.log('IN Register Submit');
        console.log($scope.user);
        LoginFactory.insertUser($scope.user).then(function (response) {
            console.log(response.data.message);
            $scope.message = response.data.message+' kindly login to proceed !!!';
            $scope.user = {};
            $('#messageModal').modal('show');
        }, function(error) {
            $scope.message = 'Unable to insert new user: ' + error.data.message;
            $('#messageModal').modal('show');
            console.log($scope.message);
        });
    }

    $scope.login = function() {
        console.log('IN login Submit');
        console.log($scope.loginCreds);
        $scope.dataLoading = true;
        LoginFactory.Login($scope.loginCreds.email, $scope.loginCreds.password).then(function (response) {
            if(response.status==200) {
                $rootScope.globals = {
                    currentUser: {
                        token: response.data.token
                    }
                };
                LoginFactory.SetCredentials($scope.loginCreds.email, $scope.loginCreds.password);
                $location.path('/home');
            } else {
                $scope.message = response.message;
                $('#messageModal').modal('show');
                console.log($scope.message);
                $scope.dataLoading = false;
            }
        }, function(error) {
            $scope.message = 'Unable to Login user: ' + error.data.message;
            $('#messageModal').modal('show');
            console.log($scope.message);
            $scope.dataLoading = false;
        });
    }

    $scope.sendMail = function () {
        LoginFactory.sendMail($scope.forgotPassword.email).then(function (response) {
            $scope.winMessage = response.data.message;
            $scope.mailDiv = false;
            $scope.tokenDiv = true;
        }, function(error) {
            $scope.message = 'Unable to send forgot password mail : ' + error.data.message;
             $('#messageModal').modal('show');
            console.log($scope.message);
        });
    }

    $scope.sendTokenAndPass = function () {
        LoginFactory.sendTokenAndPass($scope.forgotPassword).then(function (response) {
            $('#forgotPasswordModal').modal('hide');
            $scope.message = response.data.message;
            $scope.forgotPassword = {}; 
            $scope.mailDiv = true;
            $scope.tokenDiv = false;
            $('#messageModal').modal('show');
        }, function(error) {
            $scope.message = 'Unable to set new password mail : ' + error.data.message;
            $('#messageModal').modal('show');
            console.log($scope.message);
        });
    }
}]);

app.controller('HomeController',['$scope','$rootScope', '$location', 'LoginFactory', function ($scope,$rootScope,$location,LoginFactory) {
    $scope.welcome = $rootScope.globals.currentUser.username;
    LoginFactory.getUser($rootScope.globals.currentUser.username,$rootScope.globals.currentUser.token).then(function (response) {
        if(response.data.email==$rootScope.globals.currentUser.username) {
            console.log(response);
        } else {
            $scope.message = response.data.message;
            $('#messageModal').modal('show');
            console.log($scope.message);
        }
    }, function(error) {
        $scope.message = 'Unable to Login user: ' + error.data.message;
        $('#messageModal').modal('show');
        console.log($scope.message);
    });

    $scope.changePassword = function () {
        if($scope.changePass.newPassword == $scope.changePass.confirmNewPassword){
            $scope.changePass.email = $rootScope.globals.currentUser.username;
            LoginFactory.changeUserPassword($scope.changePass,$rootScope.globals.currentUser.token).then(function (response) {
                if(response.status==200) {
                    $scope.message = response.data.message;
                    $scope.changePass = {};
                    $('#messageModal').modal('show');
                    console.log($scope.message);
                } else {
                    $scope.message = response.data.message;
                    $scope.changePass = {};
                    $('#messageModal').modal('show');
                    console.log($scope.message);
                }
            }, function(error) {
                $scope.message = 'Unable to change user password : ' + error.data.message;
                $('#messageModal').modal('show');
                console.log($scope.message);
            });
        }else{
            $scope.message = "New password does not match with confirm new Password !!!";
            $('#messageModal').modal('show');
            console.log($scope.message);
        }
    }
}]);

app.controller('NavController',['$scope','$rootScope', '$location', 'LoginFactory', function ($scope,$rootScope,$location,LoginFactory) {
    $scope.logout = function(){
        // reset login status
        LoginFactory.ClearCredentials();
        $location.path('/login');
    }
}]);
