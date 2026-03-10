
const translations = {
  en: {
    appTitle: "Flashcards",
    welcome: "Flashcards",
    welcomeUser: "Welcome, {username}!",

    login: "Login",
    logout: "Logout",
    createAccount: "Create Account",

    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",

    signUp: "Sign Up",
    deleteAccount: "Delete Account",

    decks: "Decks",
    createDeck: "Create Deck",
    deleteDeck: "Delete Deck",
    editDeck: "Edit Deck",

    flashcards: "Flashcards",
    createFlashcard: "Create Flashcard",
    editFlashcard: "Edit Flashcard",
    deleteFlashcard: "Delete Flashcard",

    question: "Question",
    answer: "Answer",

    study: "Study",
    correct: "Correct",
    incorrect: "Incorrect",
    flipCard: "Flip Card",

    tosConsent: "I accept the {tos}",
    termsOfService: "Terms of Service",

    emailRequired: "Email and password are required.",
    consentRequired: "You must accept the Terms of Service.",
    emailInUse: "Email already in use.",
    invalidCredentials: "Invalid email or password.",
    unauthorized: "Unauthorized.",

    deckCreated: "Deck created.",
    deckDeleted: "Deck deleted.",
    flashcardCreated: "Flashcard created.",
    flashcardDeleted: "Flashcard deleted.",

    offlineTitle: "You are offline",
    offlineMessage: "Please check your internet connection and try again.",
    offlineBack: "Go back"
  },

  no: {
    appTitle: "Flashcards",
    welcome: "Flashcards",
    welcomeUser: "Velkommen, {username}!",

    login: "Logg inn",
    logout: "Logg ut",
    createAccount: "Opprett konto",

    email: "E-post",
    password: "Passord",
    confirmPassword: "Bekreft passord",

    signUp: "Registrer",
    deleteAccount: "Slett konto",

    decks: "Kortstokker",
    createDeck: "Lag kortstokk",
    deleteDeck: "Slett kortstokk",
    editDeck: "Rediger kortstokk",

    flashcards: "Flashcards",
    createFlashcard: "Lag flashcard",
    editFlashcard: "Rediger flashcard",
    deleteFlashcard: "Slett flashcard",

    question: "Spørsmål",
    answer: "Svar",

    study: "Studer",
    correct: "Riktig",
    incorrect: "Feil",
    flipCard: "Snu kort",

    tosConsent: "Jeg godtar {tos}",
    termsOfService: "vilkårene for bruk",

    emailRequired: "E-post og passord er påkrevd.",
    consentRequired: "Du må godta vilkårene for bruk.",
    emailInUse: "E-post er allerede i bruk.",
    invalidCredentials: "Feil e-post eller passord.",
    unauthorized: "Ikke autorisert.",

    deckCreated: "Kortstokk opprettet.",
    deckDeleted: "Kortstokk slettet.",
    flashcardCreated: "Flashcard opprettet.",
    flashcardDeleted: "Flashcard slettet.",

    offlineTitle: "Du er frakoblet",
    offlineMessage: "Sjekk internettilkoblingen din og prøv igjen.",
    offlineBack: "Gå tilbake"
  }
};

function detectLang() {
  const lang = (navigator.language || "en").split("-")[0].toLowerCase();
  return translations[lang] ? lang : "en";
}

export const lang = detectLang();

export function t(key, vars = {}) {
  const str = translations[lang]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), str);
}