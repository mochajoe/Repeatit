angular.module('flash-card')
.controller('CreatePageCtrl', function($http, $location){
  var currentUser = localStorage.getItem('currentUser');
  this.newDeck = {
    username: currentUser,
    cardType: "basic"
  };
  this.newDeck.cards = [];
  this.newCard = {plaintextFront: true, plaintextBack: true};
  this.showSubmitMsg = false;
  this.typeSelected = false;
  //Do not modify cardType directly, use getters and setters.
  /* Card types:
    "basic" - just text on front and back, no way to enter an answer
    "image" - flashcard with embedded image. no way to enter an answer
    "multiple choice" - flashcard with up to 5 answer options and only one correct answer
    "true/false" - flashcard with a binary true/false answer
    "short answer" - flashcard with textbox for answers.
    For basic, image, and short answer cards, the user must self-grade.  Multiple choice and true/false answers are automatically graded.
  */
  this.defaultCardData = {
    basic: {
      question: '',
      answer: ''
    },
    multipleChoice: {
      question: '',
      answer: '',
      correctOption: 'a',
      options: {
        a: '',
        b: '',
        c: '',
        d: '',
        e: ''
      }
    }
  };

  // Will show a message indicating card was submitted (not done)
  this.toggleSubmitMsg = function() {
    this.showSubmitMsg = !this.showSubmitMsg;
  }.bind(this);

  this.getCardType = function() {
    //This returns a copy of the string so it cannot be mutated
    console.log('getCardType returns: ', this.newDeck.cardType.split('').slice().join(''));
    return this.newDeck.cardType.split('').slice().join('');
  };

  this.setCardType = function(s) {
    s = s.toLowerCase();
    console.log('setCardType string: ',s);
    var validTypes = "basic,image,multiple choice, true/false, short answer";

    //only set type if valid
    if (validTypes.includes(s)) {
      this.newDeck.cardType = s;
      console.log('card type set to: ', this.newDeck.cardType);
      //toggle typeSelected to show correct HTML using ng-show
      this._typeSelected();
      return 1;
    } else {
      //error handling- return -1 if invalid string passed
      return -1;
    }
  }.bind(this);

  this._typeSelected = function() {
    this.typeSelected = true;
  };

  this.populateCard = function (dataObj) {
    console.log('populateCard was called in createPage.js')
    if(this.newDeck.cardType === 'basic') {
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

    if(this.newDeck.cardType === 'multiple choice') {
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

  this.addCard = function(newCard) {
    console.log('addCard was called on createPage.js');
    //set card type on newCard.
    this.newDeck.cards.push(newCard);
    console.log('Card was just added to new deck: ', this.newDeck);
    //These two lines are used to display a brief message
    //indicating the submission of a new card with ng-show
    // this.toggleSubmitMsg();

    this.newCard = {plaintextFront: true, plaintextBack: true};
    $('#createQuestionField').focus();

  };

  this.handleSave = function() {
    if(!this.newDeck.deckname) {
      alert("Please enter a deck name");
    }else if(!this.newDeck.groupname){
      alert("Please enter a group name");
    }else{
      console.log('NEW DECK', this.newDeck);
      // post goes back to with user info
      $http.post('/decks?username=' + localStorage.getItem('currentUser'), this.newDeck).then(function() {
        $http.get('/decks', {params: {username: localStorage.getItem('currentUser')}}).then(function(response) {
          localStorage.setItem('decks', JSON.stringify(response.data));
          $location.path('/app');
        }, function(err) {console.error('handleSave, CREATE', err);});
      });

    }
  };

  this.deleteCard = function(card) {
    if (confirm('Are you sure you want to delete this card?')) {
      var i = this.newDeck.cards.indexOf(card);
      this.newDeck.cards.splice(i,1);
    }
  };

  this.moveUp = function(card) {
    var index = this.newDeck.cards.indexOf(card);
    if(index === 0) {
      return;
    } else {
      var temp = this.newDeck.cards[index - 1];
      this.newDeck.cards[index - 1] = this.newDeck.cards[index];
      this.newDeck.cards[index] = temp;
    }
  };

  this.moveDown = function(card) {
    var index = this.newDeck.cards.indexOf(card);
    if(index === this.newDeck.cards.length-1) {
      return;
    } else {
      var temp = this.newDeck.cards[index + 1];
      this.newDeck.cards[index + 1] = this.newDeck.cards[index];
      this.newDeck.cards[index] = temp;
    }
  };

  this.toggleHighlightFront = function(card) {
    card.plaintextFront = !card.plaintextFront;
  };

  this.toggleHighlightBack = function(card) {
    card.plaintextBack = !card.plaintextBack;
  };

})
.component('createPage', {
  controller: 'CreatePageCtrl',
  templateUrl: './templates/createPage.html' //calling from index.html
});