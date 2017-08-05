var express = require('express');
var router = express.Router();
var UserFile = require('./db/models/user');
var Card = require('./db/models/card');
var Deck = require('./db/models/deck');
var nodemailer = require('nodemailer');

var bodyParser = require('body-parser');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//retrieve all decks
router.get('/decks', function(req, res) {
  var username = req.query.username;
  if (req.query.username === 'null') {
    var username = null;
  }
  console.log('username', username);
  Deck.find({username: username})
    .then(function(err, decks) {
      if (err) { // this is not an error per se but actually a deck
        console.error(err);
        res.status(202).send(err);
      } else {
        console.log('query successful, sending decks to client', decks);
        res.status(200).json(decks);
      }
    });
});

router.post('/decks', function(req, res) {
  // console.log('POST', req.body); => CONFIRMS THAT POST GOES THROUGH
  Deck.create(req.body).then(function(deck) {
    console.log('DECK', deck); //=> CONFIRMS THAT DECK IS SAVED SUCCESSFULLY
    res.json(deck);
  });
});

router.put('/decks/', function(req, res) {
  var username = req.body.username;
  var deckname = req.body.deckname;
  // var groupname = req.body.groupname;
  console.log(username);
  console.log(deckname);

  Deck.findOneAndUpdate({username: username, deckname: deckname}, req.body, {new:true}).then(function(deck) {
    res.status(200).send('deck updated');
  });
});

router.put('/decks/:id', function(req, res) {
  // var username = req.body.username;
  var deckname = req.body.deckname;
  // console.log(username);
  console.log('inside put', req.params.id);

  Deck.findByIdAndUpdate({_id: req.params.id}, {deckname: deckname}, {new:true})
    .then(function(deck) {
      console.log(deck)
      res.status(200).send(deck);
    }
  );
});

router.delete('/decks/:id', function(req, res) {
  Deck.findByIdAndRemove({_id: req.params.id}).then(function(deletedDeck) {
    res.status(200).send('deck deleted');
  });
});

router.get('/users', function(req, res) {
  UserFile.User.find({}).then(function(users) {res.json(users);});
});

router.post('/users', function(req, res) {
  UserFile.User.create(req.body).then(function(user) {
    res.json(user);
  });
});

router.put('/users/:id', function(req, res) {
  UserFile.User.findByIdAndUpdate({_id: req.params.id}, req.body, {new:true}).then(function(user) {
    res.json(user);
  });
});

router.delete('/users/:id', function(req, res) {
  UserFile.User.findByIdAndRemove({_id: req.params.id}).then(function(deletedUser) {
    res.json(deletedUser);
  });
});

var bcrypt = require('bcrypt');
var saltRounds = 10;

router.post('/login', function(req, res) {
  UserFile.User.findOne({
    username: req.body.username
  }).then(function(user) {
    if (user !== null) {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (result === true) {
          console.log('user authenticated');
          res.status(200).json('OK');
        } else {
          console.log('invalid user/password combo');
          res.status(200).json('NO');
        }
      });
    } else {
      console.log('invalid username');
      res.json('NO');
    }
  });
});

router.post('/signup', function(req, res) {
  UserFile.User.findOne({
    username: req.body.username
  }).then(function(user) {
    if (user === null) {
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) {
            console.error(err);
          } else {
            UserFile.User.create({
              username: req.body.username,
              password: hash
            }).then(function(user) {
              res.status(200).json('OK');
            });
          }
        });
      });
    } else {
      res.json('NO');
    }
  });
});


router.post('/reset', function(req, res){
  UserFile.User.findOne({
    username: req.body.username
  }).then(function(user) {
    if(user !== null && (req.body.userResetCode == req.body.systemResetCode)){
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash){
          if(err){
            console.error(err);
          }else{
            UserFile.User.findOne({username: req.body.username}, function(err, doc){
              doc.password = hash;
              doc.save();
              res.json("SUCCESS");
            })
          }
        })
      })
    }else if(user === null){
      res.json('NO_USER');
    }else if(req.body.userResetCode != req.body.systemResetCode){
      console.log("userResetCode: ", req.body.userResetCode);
      console.log("systemResetCode: ", req.body.systemResetCode);
      console.log(req.body.userResetCode == req.body.systemResetCode)
      res.json('INCORRECT_CODE');
    }
  })
})

router.post('/forgotpassword', function(req, res){
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      //this is an email account set up specifically for this function
      auth: {
        user: 'repeatit8521475@gmail.com',
        pass: 'admin1010'
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    let HelperOptions = {
      from: '"Repeat.it Admin" <repeatit8521475@gmail.com',
      to: req.body.email,
      subject: "Your password for repeat.it",
      text: "PASSWORD RESET CODE: " + req.body.resetCode
    };

    transporter.sendMail(HelperOptions, (error, info) => {
      if(error){
        console.log(error);
      }
      req.body.email = ''
      console.log("Great success", req.body.email)
      res.end()
    })
  })



// (╯°□°）╯︵ ┻━┻       (you don't actually need it for anything. it was a joke)

module.exports = router;
