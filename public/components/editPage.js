angular.module('flash-card')
.controller('EditPageCtrl', function($http, $location){
  var that = this;
  this.newCard = {plaintextFront: true, plaintextBack: true};
  //***** add more of the default schema ****
  this.deck = JSON.parse(localStorage.getItem('currentDeck'));

  this.defaultCardData = {
    multipleChoice: {
      question: '',
      answer: '',
      correctOption: '',
      options: {
        a: '',
        b: '',
        c: '',
        d: '',
        e: ''
      }
    }
  };


   // ------ Copied from createPage to get things working
   // NOT DRY - TODO: refactor ---------------

  this.populateCard = function (dataObj) {
    console.log('populateCard was called in createPage.js')
    if(this.deck.cardType === 'basic') {
      if(!dataObj.question || !dataObj.answer) {
        return false;
      } else {
        this.newCard.data = {};
        this.newCard.data['question'] = dataObj['question'];
        this.newCard.data['answer'] = dataObj['answer'];

        this.newCard.data.front = dataObj.front;
        this.newCard.data.back = dataObj.back;
      }
    }

    if(this.deck.cardType === 'multiple choice') {
      if(!dataObj.answer || !dataObj.question || !dataObj.options.a || !dataObj.options.b) {
        return false;
      } else {

        //Make a copy of the object
        this.newCard.data = {};
        var tempOptions = {};
        for (var j in dataObj.options) {
          tempOptions[j] = dataObj.options[j];
        }
        this.newCard.data.options = tempOptions;
        for (var k in dataObj) {
          if (k !== 'options') {
            this.newCard.data[k] = dataObj[k];
          }
        }
        console.log('multiple choice card about to be added to deck: ', this.newCard);
      }
    }
    this.addCard(this.newCard);
    return true;
  }.bind(this);

  // -------------------------------------------

  this.addCard = function(newCard) {
    this.deck.cards.push(this.newCard);
    this.newCard = {plaintextFront: true, plaintextBack: true};
    $('#editQuestionField').focus();

    console.log('this.deck----', this.deck);
  };

  this.handleSave = function() {
    if(!this.deck.deckname) {
      alert("Please enter a deck name");
    } else {
      var id = this.deck._id;
      $http.put('/decks/', this.deck, {params: {username: localStorage.getItem('currentUser')}}).then(function() {
        $http.get('/decks', {params: {username: localStorage.getItem('currentUser')}}).then(function(response) {
          console.log('getting decks', response);
          localStorage.setItem('decks', JSON.stringify(response.data));
          $location.path('/app');
        }, function(err) {console.error('handleSave, EDIT', err);});
      }, function(err) {console.error(err);});
    }
  };

  this.showme = false;

  this.handleEditAndSave = function() {
    if(!this.deck.deckname) {
      alert("Please enter a deck name");
    } else {
      this.showme = true;
      var id = this.deck._id;
      $http.put(`/decks/${id}`, this.deck)
        .then(function() {
          $http.get('/decks', {params: {username: localStorage.getItem('currentUser'),  deckname: JSON.parse(localStorage.getItem('currentDeck')).deckname}})
            .then(function(response) {
              console.log('getting decks', response);
              localStorage.setItem('decks', JSON.stringify(response.data));
              // $location.path('/app');
            },
          function(err) {console.error('handleSave, EDIT', err);});
        },
      function(err) {console.error(err);});
      setTimeout(function() {that.showme = false;}, 1000);
    }
  };

  this.deleteCard = function(card) {
    if (confirm('Are you sure you want to delete this card?')) {
      var i = this.deck.cards.indexOf(card);
      this.deck.cards.splice(i,1);
    }
  };
  this.moveUp = function(card) {
    var index = this.deck.cards.indexOf(card);
    if(index === 0) {
      return;
    } else {
      var temp = this.deck.cards[index - 1];
      this.deck.cards[index - 1] = this.deck.cards[index];
      this.deck.cards[index] = temp;
    }
  };
  this.moveDown = function(card) {
    var index = this.deck.cards.indexOf(card);
    if(index === this.deck.cards.length-1) {
      return;
    } else {
      var temp = this.deck.cards[index + 1];
      this.deck.cards[index + 1] = this.deck.cards[index];
      this.deck.cards[index] = temp;
    }
  };
  this.toggleHighlightFront = function(card) {
    card.plaintextFront = !card.plaintextFront;
  };
  this.toggleHighlightBack = function(card) {
    card.plaintextBack = !card.plaintextBack;
  };
})
.component('editPage', {
  controller: 'EditPageCtrl',
  templateUrl: './templates/editPage.html' //calling from index.html
});