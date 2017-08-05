angular.module('flash-card')

.controller('LoginCtrl', function(loginSvc, $location, $http, $scope, $rootScope){
  $scope.currentUserEmail;
  this.showBadLogin = false;
  this.showPleaseTry = false;
  this.showEmailSent = false;

  this.login = function() {
    var that = this;
    loginName = this.loginName;
    $scope.currentUserEmail = loginName;
    loginPw = this.loginPw;
    loginSvc.login(loginName, loginPw, function(res) {
      if (res.error) {
        console.error(res.error);
      } else if (res.data === 'OK') {
        $http.get('/decks', {params: {username: loginName}}).then(function(response) {
          $rootScope.showNavOptions = true;
          localStorage.setItem('currentUser', loginName);
          localStorage.setItem('decks', JSON.stringify(response.data));
          $location.path('/app');
        }, function(error) {console.error(error);});
      } else if (res.data === 'NO') {
        that.showBadLogin = true;
        that.loginPw = '';
        $('#loginName').focus();
      }
    });
  };

  this.reset = function(){
    var that = this;
    userResetCode = this.resetCode;
    newPassword = this.newPassword;
    newPasswordConfirm = this.newPasswordConfirm;
    systemResetCode = $scope.resetCode;
    username = $scope.currentUserEmail;
    loginSvc.reset(username, newPassword, userResetCode, systemResetCode, function(res) {
      if(this.newPassword !== this.newPasswordConfirm){
        alert('Your passwords do not match; please check and try again.');
        that.newPassword = '';
        that.newPasswordConfirm = '';
      }else if(this.newPassword === this.newPasswordConfirm && res.data === 'INCORRECT_CODE'){
        alert('The reset code is incorrect; please check and try again.')
        that.resetCode = '';
      }else if(res.data === "SUCCESS"){
        alert("Your password has been updated.")
        $scope.show = !$scope.show;
      }
    })


  }

  this.signup = function() {

    var that = this;
    accName = this.accName;
    accPw = this.accPw;
    accVerifyPw = this.accVerifyPw;
    loginSvc.signup(accName, accPw, function(res) {
      $rootScope.showNavOptions = true;
      if (this.accPw !== this.accVerifyPw && res.data === 'NO') {
        alert('Username taken; please try another username.');
        that.accName = '';
        that.accPw = '';
        that.accVerifyPw = '';
      }
      else if (this.accPw !== this.accVerifyPw) {
        alert('Your passwords do not match; please check and try again.');
        that.accPw = '';
        that.accVerifyPw = '';
      } else if (res.error) {
        console.error(res.error);
      } else if (res.data === 'OK') {
        localStorage.setItem('currentUser', accName);
        localStorage.setItem('decks', JSON.stringify([]));
        $location.path('/app');
      } else if (res.data === 'NO') {
        alert('Username taken; please try another username.');
        that.accName = '';
        that.accPw = '';
        that.accVerifyPw = '';
        $('#accName').focus();
      }
    });
  };

  this.processForgotPassword = function() {
    var isOk = $scope.forgotPassword();

    this.showPleaseTry =  !isOk;
    this.showEmailSent = isOk;
  };

  $scope.show = false;

  $scope.resetCode;
  $scope.forgotPassword = function(){

    if($scope.currentUserEmail === undefined){
      // return alert("Please attempt to login with your email at least once.")
      return false;
    }
    $("body").css("cursor", "wait");
    $(".forgot-password").css("cursor", "wait");
    this.resetCode = Math.floor(Math.random() * 1000000);
    $scope.resetCode = this.resetCode;
    var that = this;
    $http.post('http://localhost:3000/forgotpassword', JSON.stringify({email: $scope.currentUserEmail, resetCode: this.resetCode})).then(function(){
        // alert("A password reset code has been sent to " + $scope.currentUserEmail);

        $("body").css("cursor", "auto");
        $(".forgot-password").css("cursor", "pointer");
        $scope.show = !$scope.show;
      })
    return true;
    }
  })

.component('login', {
  controller: 'LoginCtrl',
  templateUrl: './templates/login.html' //calling from index.html
})
.service('loginSvc', function($http) {
  this.login = function(username, password, callback) {
    var url = 'http://localhost:3000/login';
    $http.post(url, JSON.stringify({username: username, password:password}))
      .then(function successCallback(response) {
        callback(response);
      },
      function errorCallback(response) {
        callback(response);
      });
  };
  this.signup = function(username, password, callback) {
    var url = 'http://localhost:3000/signup';
    $http.post(url, JSON.stringify({username: username, password:password}))
      .then(function successCallback(response) {
        callback(response);
      },
      function errorCallback(response) {
        callback(response);
      });
  };
  this.reset = function(username, newPassword, userResetCode, systemResetCode, callback) {
    var url = 'http://localhost:3000/reset';
    $http.post(url, JSON.stringify({username: username, password: newPassword, userResetCode: userResetCode, systemResetCode: systemResetCode}))
      .then(function successCallback(response) {
        callback(response);
      },
      function errorCallback(response) {
        callback(response);
      });
  };
});
