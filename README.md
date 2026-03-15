# Flashcards App
A web app where users can make flashcards, study them and share them.
Works offline and saves your progress.

## Features
- Make and manage flashcards (create, edit, delete)
- Study cards and track answers (flip cards, mark correct/incorrect)
- Share and copy decks from others
- Work offline (PWA)

## Tech & Tools
- Express.js – backend server and REST API
- HTML, CSS, JavaScript – frontend client / PWA
- PostgreSQL – cloud database on Render
- npm – package management

## Project Management
Trello: https://trello.com/invite/b/696ceb29d8795f74de40eeac/ATTI807794d32e16cfd1397085dcce07346eB4724A26/flashcards-project

## Middleware

### authMiddleware
**Problem it solves:** Protected routes need to verify who the user is before
allowing access. Without this, anyone could read or modify any user's data.

**How it works:**
- Reads the `Authorization: Bearer <token>` header from the request
- Looks up the token in the sessions table in the database
- If valid, attaches the user object to `req.user` for use in route handlers
- Returns 401 if the token is missing or invalid

**Used on:** POST /decks, GET /decks, POST /decks/:deckId/flashcards,
GET /decks/:deckId/flashcards, DELETE /users/me

---

### deckAccessMiddleware
**Problem it solves:** Decks can be public or private. Public decks should
be readable by anyone, but private decks should only be accessible by
their owner.

**How it works:**
- Reads `deckId` from the URL parameters
- Fetches the deck from the database
- If the deck is public, grants access to any user
- If the deck is private, checks that the logged in user is the owner
- Returns 404 if the deck does not exist, 401 if not logged in, 403 if not the owner
- Attaches the deck object to `req.deck` for use in the route handler

**Used on:** GET /decks/:deckId/flashcards, POST /decks/:deckId/flashcards

## API

### Auth
POST /auth/login – Log in, returns token

### Users
POST /users – Create account
DELETE /users/me – Delete own account (requires login)

### Decks
GET /decks – Get all your decks (requires login)
POST /decks – Create a deck (requires login)

### Flashcards
GET /decks/:deckId/flashcards – Get all flashcards in a deck
POST /decks/:deckId/flashcards – Add a flashcard to a deck

## Database
Backend API hosted on Render:
https://flashcards-project.onrender.com