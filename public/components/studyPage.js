angular.module('flash-card')
.controller('StudyCtrl', function($scope, $http, $location, $timeout) {
  var model = this;
  var shuffleDeck = function(deck) {
    for (var i = 0; i < deck.length; i++) {
      var random = Math.floor(Math.random()*(deck.length-i)) + i;
      var switchedCard = deck[random];
      deck[random] = deck[i];
      deck[i] = switchedCard;
    }
    return deck;
  };

  //Grab the entire deck object so we have access to the deck id for saving later
  this.deck = JSON.parse(localStorage.getItem('currentDeck'));
  this.shuffledDeck = shuffleDeck(this.deck.cards);

  this.showPrev = false;
  if(this.shuffledDeck.length === 1) {
    this.showNext = false;
  } else {
    this.showNext = true;
  }

  this.current = this.shuffledDeck[0];
  this.front = true;
  this.flipped = false;
  this.theEnd = false; // controls the end card which displays, start over option

  this.answersStyle = {
    a:'label-default',
    b:'label-default',
    c:'label-default',
    d:'label-default',
    e:'label-default',
  };
  this.correctAnswerStyle = 'label-success';
  this.answerMessage = '';

  this.counter = 0;

  $scope.$on('clickShuffle', function(event, data) { // capture the click from progress tracker component
    model.startOver();
  });

  this.startOver = function () { // set the deck to initial state with a shuffle
    this.shuffledDeck = shuffleDeck(this.deck.cards);
    this.current = this.shuffledDeck[0];
    this.front = true;
    this.flipped = false;
    this.theEnd = false;
    this.showPrev = false;
    this.counter = 0;
    $scope.$broadcast('onClickNext', 0); // sets progress tracker to 0
  };

  var resetConditionToInitialState = {
    'handleNext' : function (studyControllerVariables) {
      var that = studyControllerVariables;
      if (that.counter === that.shuffledDeck.length - 1) {
        that.showNext = false;
      }

      that.showPrev = true;
      that.counter++;
      this.setToInitialState(studyControllerVariables);

    },
    'handlePrev' : function (studyControllerVariables) {
      var that = studyControllerVariables;
      if (that.counter - 1 === 0) {
        that.showPrev = false;
      }
      that.showNext = true;
      that.counter--;
      this.setToInitialState(studyControllerVariables);
    },
    'setToInitialState' : function (studyControllerVariables) {
      var that = studyControllerVariables;
      that.front = true;
      that.flipped = false;
      that.current = that.shuffledDeck[that.counter];
      that.highlightingHelperFn(that.current.front);
    },
    showTheEnd: function (studyControllerVariables) {
      var that = studyControllerVariables;
      that.theEnd = true;
    }
  }

  this.handleNext = () => {
    if(this.counter+1 > this.shuffledDeck.length-1) {
      resetConditionToInitialState['showTheEnd'](this);
    } else {
      console.log(this.shuffledDeck.length)
      resetConditionToInitialState['handleNext'](this);
    }

    // broadcast the current counter so the progress tracker can be updated
    $scope.$broadcast('onClickNext', this.counter+1);
  };

  this.handlePrev = () => {
    resetConditionToInitialState['handlePrev'](this);
    // broadcast the current counter so the progress tracker can be updated
    $scope.$broadcast('onClickPrev', this.counter+1);
  };

  this.flip = () => {
    //Helper fn written to make flipping easier/DRY code
    console.log('flip called');
    this.front = !this.front;
    this.flipped = !this.flipped;

    if (this.front === true && this.flipped === false) {
      this.highlightingHelperFn(this.current.front);
    } else {
      this.highlightingHelperFn(this.current.back);
    }
  };

  this.handleFlipBasic = () => {
    if (this.deck.cardType == 'basic') {
      this.flip();
    }
  };

  this.handleFlipMC = (ans) => {
    var rightAnswer = this.current.data.correctOption;

    if (this.front && ans) {
      if (ans == rightAnswer) {
        //Generate correct styling and text for correct answer
        this.correctAnswerStyle = 'label-success';
        this.answerMessage = 'Correct! ' + rightAnswer.toUpperCase() + ' is the right answer!';
      } else {
        //Generate styling and message for wrong answer
        this.correctAnswerStyle = 'label-danger';
        this.answerMessage = 'Incorrect! ' + rightAnswer.toUpperCase() + ' is the right answer';
      }

    } else {
      //Reset styles for choices
      this.answersStyle = {
        a:'label-default',
        b:'label-default',
        c:'label-default',
        d:'label-default',
        e:'label-default',
      };
    }

    this.flip();

  }

  // this.handleFlipMC = function (ans) {
  //   console.log('MC Flip FN Called', ans, this.front, this.flipped);
  //   this.front = !this.front;
  //   this.flipped = !this.flipped;
  //   console.log('After flip: ', this.front, this.back);

  //   if (this.front === true && this.flipped === false) {
  //     this.highlightingHelperFn(this.current.front);
  //   } else {
  //     this.highlightingHelperFn(this.current.back);
  //   }
  // };

  //-------------------------------------------------------------------------------------
  /*  This function essentially:
   *    - checks if a given card is displaying a side that needs to be styled as code
   *    - grabs the content of the card
   *    - creates a new <code> element
   *    - copies the data in
   *    - inserts the new <code> element into the DOM and removes the old <h1>
   *    - similarly wraps the <code> element in a newly created <pre> element
   *    - applies a few basic styles
   *
   *  This function is run under four conditions: when a card is fliped, when 'next' or
   *  or 'previous' buttons are clicked, and when the very first card is loaded for the
   *  study session.
   */
  this.highlightingHelperFn = (flashCardQuestion) => {
    $timeout(() => {

      if (this.front === true && this.current.plaintextFront === false || this.front === false && this.current.plaintextBack === false) {
        // our logic here
        var card = document.getElementsByClassName("studycard"); // card is an HTMLCollection object
        var cardHTML = card[0].childNodes[0]; // the h1 in which we displayed the user input
        var content = flashCardQuestion || cardHTML.innerHTML; // the value of the h1

        var newCodeTag = document.createElement('code');

        cardHTML.parentNode.insertBefore(newCodeTag, cardHTML); // add code tag in next to h1
        newCodeTag.innerHTML = content; // copy the content
        cardHTML.parentNode.removeChild(cardHTML); // remove the h1

        // now we have a <code>stuff user typed</code> for each item

        var newPreTag = document.createElement('pre');
        newCodeTag.parentNode.insertBefore(newPreTag, newCodeTag); // add pre next to code
        newPreTag.appendChild(newCodeTag); // make code a child of pre

        // now we have:
        // <pre>
        //   <code>stuff user typed</code>
        // </pre>
        //
        // where the old h1 used to be

        // change two quick default styles for this card:
        newPreTag.parentNode.setAttribute("style", "padding:10px; text-align: left; overflow: hidden; overflow-y: scroll;");

        hljs.highlightBlock(newPreTag);
      }
    }, 1);
  };

  this.handleSave = () => {
    var id = this.deck._id;
    var that = this;
    this.shuffledDeck.forEach(function(card) {
      for (var i = 0; i < that.deck.cards.length; i++) {
        if (that.deck.cards[i].front === card.front && that.deck.cards[i].back === card.back) {
          that.deck.cards[i] = card;
        }
      }
    });
    $http.put('/decks/', this.deck).then(function() {
      $location.path('/app');
    });
  };

  // initialize the first card to check for whether to highlight
  this.highlightingHelperFn();
});

