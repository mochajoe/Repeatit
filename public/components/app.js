angular.module('flash-card')
.controller('AppCtrl', function($http, $timeout) {
  var that = this;
  var currentUser = localStorage.getItem('currentUser');
  var currentDecks = JSON.parse(localStorage.getItem('decks'));
  this.categories = [];
  this.names = [];
  this.getGroups = function() {
    for (var i = 0; i<currentDecks.length; i++) {
      if(this.names.indexOf(currentDecks[i].groupname) === -1){
        this.names.push(currentDecks[i].groupname);
        this.categories.push({"group": currentDecks[i].groupname});
      }
    }
  }
  this.getGroups();

  this.show = false;
  this.getGroupDecks = function(group){
    this.currentGroup = group.group;
    this.setDecks();
    this.show = !this.show;
  }

  this.setDecks = function() {
      that.allDecks = JSON.parse(localStorage.getItem('decks'));
      that.decks = [];
      for (var j = 0; j<that.allDecks.length; j++){
        if(that.allDecks[j].groupname === this.currentGroup){
          that.decks.push(that.allDecks[j]);
        }
      }
      console.log('setDecks called. this.decks: ', that.allDecks);

  };
  this.getDeck = function(deck){
    localStorage.setItem('currentDeck', JSON.stringify(deck));
  };
  this.handleDelete = function(deck) {
  if (confirm('Are you sure you want to delete this deck?')) {
    var id = deck._id;
    $http.delete('/decks/' + id).then(function() {
      $http.get('/decks', {
        params: {
          username: currentUser
        }
      }).then(function(res) {
        localStorage.setItem('decks', JSON.stringify(res.data));
        that.decks = res.data;
        console.log('inside handle delete', localStorage.getItem('decks'));
      }, function(error) {
        console.error(error);
      });
    }, function(error) {
      console.error(error);
    });
  }
};
  // if (currentUser === null) {
  //   // this is to make the client-side wait for the public decks to arrive before setting this.decks
  //   console.log('you are not signed in');
  //   $timeout(function() {that.setDecks();}, 100);
  // } else {
  //   this.setDecks();
  // }
})
.component('app', {
  controller: 'AppCtrl',
  templateUrl: './templates/app.html',
});


// [{"_id":"595d9d3a063adb09b45b2850","username":"Andrew","deckname":"United States","groupname":"Geography","__v":0,"cards":[{"front":"What is the biggest state by land area?","back":"Alaska.","_id":"595d9d3a063adb09b45b2851","lang":"Javascript","plaintextBack":true,"plaintextFront":true}],"public":false},

  // {"_id":"595d9d693ebfb7469466311a","username":"Andrew","deckname":"Canada","groupname":"Geography","__v":0,"cards":[{"front":"What is the biggest province by population?","back":"Ontario at 13 million.","_id":"595d9d693ebfb7469466311b","lang":"Javascript","plaintextBack":true,"plaintextFront":true}],"public":false}]