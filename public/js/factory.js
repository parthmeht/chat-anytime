app.factory('LoginFactory', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', function(Base64, $http, $cookieStore, $rootScope, $timeout){

    var urlBase = '/api/v1';
    var LoginFactory = {};

    LoginFactory.getBase = function () {
        return $http.get(urlBase);
    };

    LoginFactory.insertUser = function (user) {
        return $http.post(urlBase+'/users', user);
    };

    LoginFactory.verifyUser = function (user) {
        return $http.post(urlBase+'/authenticate', user);
    };

    LoginFactory.Login = function (username, password) {
        /* Use this for real authentication
            ----------------------------------------------*/
        return $http({
        url : urlBase+'/authenticate',
        method : 'POST',
        headers : {
            "content-type" : 'application/x-www-form-urlencoded',    
            "authorization": "Basic cGFydGhtZWh0QGdtYWlsLmNvbTp0ZXN0MTIz",
            "cache-control": "no-cache",
            "postman-token": "6ee73c02-b58f-18c6-9e0c-7a42d93c620a"
            }
        })
    };

    LoginFactory.getUser = function (username,token) {
        return $http({
        url : urlBase+'/users/'+username,
        method : 'GET',
        headers : {
            "x-access-token": token,   
            "authorization": "Basic cGFydGhtZWh0QGdtYWlsLmNvbTp0ZXN0MTIz",
            "cache-control": "no-cache",
            "postman-token": "36009927-d389-827e-6691-4507c7abe31f"
            }
        })
    };

    LoginFactory.changeUserPassword = function (user,token) {
        return $http({
        url : urlBase+'/users/'+user.email,
        method : 'PUT',
        data   : user,
        headers : {
            "x-access-token": token,   
            "authorization": "Basic cGFydGhtZWh0QGdtYWlsLmNvbTp0ZXN0MTIz",
            "cache-control": "no-cache",
            "postman-token": "36009927-d389-827e-6691-4507c7abe31f"
            }
        })
    };

    LoginFactory.sendMail = function (username) {
        return $http.post(urlBase+'/users/'+username+'/password');
    };

    LoginFactory.sendTokenAndPass = function (forgetPass) {
        return $http.post(urlBase+'/users/'+forgetPass.email+'/password', forgetPass);
    };

    LoginFactory.SetCredentials = function (username, password) {
        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals.currentUser.username = username;
        $rootScope.globals.currentUser.authdata = authdata;

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        $cookieStore.put('globals', $rootScope.globals);
    };

    LoginFactory.ClearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
    };

    return LoginFactory;

}]);

app.factory('Base64', function () {
    /* jshint ignore:start */
  
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
  
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
  
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
  
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
  
            return output;
        },
  
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
  
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
  
                output = output + String.fromCharCode(chr1);
  
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
  
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
  
            } while (i < input.length);
  
            return output;
        }
    };
  
    /* jshint ignore:end */
});