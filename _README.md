# Repeat.it

Repeat.it is a web app that allows users to create and study flashcards online. After signing into Repeat.it, users can create flashcard decks, edit existing decks, study their decks in random order and delete any decks they no longer need. A unique feature of Repeat.it is the ability to style cards as code, allowing them to create flashcards for studying various programming language snippets.


## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    2. [Tasks](#tasks)
4. [Team](#team)


## Usage

Log-in/Sign-in

On your first visit to Repeat.it, create a user name and password and you'll automatically be logged into the site. You'll need to be signed into Repeat.it any time that you would like to review or change decks that you've created.

Home page

Click the "Create a new deck" button or the deck creation link at the top of the page to start making flashcards. Any decks that you create will later be listed on the home page, where you can also choose to study, edit or delete existing decks. When you're finished studying, click "Log out" in the top right corner of the screen to end your session.

Create/edit deck pages

Type the front and back content of each card in the designated text areas and create a card by hitting enter or the "Add card" button. Cards can be deleted and rearranged within the decks.

Study deck page

Click on the card to view the answer to the current question. Use the navigation buttons below the flashcard to choose whether to view the next card or a previous card. When you're done studying, click "Save and quit" to return to the home page.
You can also track your progress by checking the Progress bar on the left as well as shuffle the whole deck.

## Requirements

- AngularJS 1.6.4 (included as CDN)
- Angular-route (included as CDN)
- bcrypt
- body-parser
- express
- mongoose
- mongoDB
- Bootstrap (included as CDN)
- Highlight.js (included as CDN)

## Development

### Installing Dependencies

From within the root directory:

```
npm install
```
### Tasks
First run the MongoDB server using the following :
```
mongod
```
alternatively you can specify dbpath
```
mongod -dbpath custom path
```
and then from within the root directory:

```
node server.js
```
## Team

  - __Product Owner__: Andrew Foresi
  - __Scrum Master__: Himanshu Pant
  - __Development Team Members__: Doug Lyford, Semie Rogers
