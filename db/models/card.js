var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('../config');

var CardSchema = new Schema({
  front: String,
  back: String,
  progress: Number,
  age: Number,
  effort: Number,
  plaintextFront: {
    type: Boolean,
    default: true
  },
  plaintextBack: {
    type: Boolean,
    default: true
  },
  lang: {
    type: String,
    default: 'Javascript'
  },
  data: {
    //Added for data-rich card types such as multiple choice card
    question: String,
    answer: String,
    correctOption: String,
    options: {
      a: String,
      b: String,
      c: String,
      d: String,
      e: String
    }
  }
});

var Card = mongoose.model('Card', CardSchema);

module.exports = {
  Card: Card,
  CardSchema: CardSchema
};
