angular.module('flash-card')
.controller('CardBasicCtrl', function() {
  this.showSentMsg = false;
  this.showFieldsAlert = false;

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

.component('cardBasic', {
  bindings: {
    populateCard: '<',
    editable: '<',
    card: '<',
    hideSubmit: '<'
  },
  controller: 'CardBasicCtrl',
  templateUrl: './templates/cardBasic.html'
});