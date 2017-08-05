var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cardFile = require('./card');
var userFile = require('./user');
var db = require('../config');

var DeckSchema = new Schema({
  deckname: String,
  username: String,
  groupname: String,
  cardType: String,
  public: {
    type: Boolean,
    default: false
  },
  date: Date,
  cards: [cardFile.CardSchema]
});

module.exports = mongoose.model('Deck', DeckSchema);
