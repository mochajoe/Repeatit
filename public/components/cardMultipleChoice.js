angular.module('flash-card')
.controller('CardMultipleChoiceCtrl', function() {
  this.front='null';
  this.back='null';

  this.showSentMsg = false;
  this.showFieldsAlert = false;
  // this.dataObj = {
  //   question: 'Enter A question here',
  //   answer: 'Enter the message to be displayed for a correct answer here.',
  //   correctOption: 'a',
  //   options: {
  //     a: 'foo',
  //     b: 'bar',
  //     c: 'this = that',
  //     d: '0/0',
  //     e: 'NaN == NaN'
  //   }
  // };

  this.clearFields = function(ok) {
    if (ok) {
      this.card = {
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
      };
      this.toggleSentMsg();
      this.showFieldsAlert = false;
    } else {
      this.showFieldsAlert = true;
    }
  };

  this.setCorrectAnswer = function (ans) {
    this.card.correctOption = ans;
  };

  this.toggleSentMsg = function () {
    this.showSentMsg = !this.showSentMsg;
    console.log('showSentMsg Toggled: ', this.showSentMsg);

    var innerToggle = function() {
      this.showSentMsg = !this.showSentMsg;
      console.log('inner Toggle toggled', this.showSentMsg);
    }.bind(this);

    setTimeout( innerToggle, 2000);

  }.bind(this);
})

.component('cardMultipleChoice', {
  controller: 'CardMultipleChoiceCtrl',
  bindings: {
    populateCard: '<',
    editable: '<',
    card: '<',
    hideSubmit: '<'
  },
  templateUrl: './templates/cardMultipleChoice.html'
});