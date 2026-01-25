
# Flashcards App
A web app where users can make flashcards, study them and share them.  
Works offline and saves your progress.


# Features
- Make and manage flashcards (create, edit, delete)  
- Study cards and track answers (flip cards, mark correct/incorrect)  
- Share and copy decks from others  
- Work offline (PWA)


# Tech & Tools
- Express.js – backend server and REST-ish API (handles user, deck and card requests)
- HTML, CSS, JavaScript – frontend client / PWA
- npm – manages packages for client and server
- PostgreSQL – cloud storage for users, decks, cards, and progress


# Project Management
- Will use Trello to organize and make sure I remember to include everything.
Link to my Trello: https://trello.com/invite/b/696ceb29d8795f74de40eeac/ATTI807794d32e16cfd1397085dcce07346eB4724A26/flashcards-project


# Decks

GET /decks**  
Returns a list of all decks.

POST /decks**  
Creates a new deck.

GET /decks/:deckId**  
Returns a single deck by its ID.

PUT /decks/:deckId**  
Updates an existing deck.

DELETE /decks/:deckId**  
Deletes a deck.


# Flashcards

GET /decks/:deckId/flashcards**  
Returns all flashcards belonging to a deck.

POST /decks/:deckId/flashcards**  
Creates a new flashcard in a deck.

GET /decks/:deckId/flashcards/:id**  
Returns a single flashcard by ID.

PUT /decks/:deckId/flashcards/:id**  
Updates a flashcard.

DELETE /decks/:deckId/flashcards/:id**  
Deletes a flashcard.


# Testing

The API is tested using Postman (or Insomnia).  
All endpoints are included in an exported collection located in: