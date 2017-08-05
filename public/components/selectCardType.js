angular.module('flash-card')
.controller('SelectCardTypeCtrl', function($http, $location){
  this.styleClasses = {
    basic: 'btn-primary',
    multipleChoice: 'btn-primary'
  };

})
.component('selectCardType', {
  bindings: {
    setCardType: '<'
  },
  controller: 'SelectCardTypeCtrl',
  templateUrl: './templates/selectCardType.html' //calling from index.html
});