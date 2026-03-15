
const messages = {
  en: {
    emailRequired: "Email is required and must be a string.",
    passwordRequired: "Password is required and must be a string.",
    passwordTooShort: "Password must be at least 8 characters.",
    consentRequired: "Consent is required.",
    tosRequired: "Terms of Service must be accepted.",
    emailTaken: "Email is already in use.",
    invalidCredentials: "Invalid email or password.",
    unauthorized: "Unauthorized.",
    deckNotFound: "Deck not found.",
    deckTitleRequired: "Deck title is required.",
    flashcardNotFound: "Flashcard not found.",
    questionRequired: "Question is required.",
    answerRequired: "Answer is required.",
    serverError: "An unexpected error occurred."
  },
  no: {
    emailRequired: "E-post er påkrevd og må være en tekst.",
    passwordRequired: "Passord er påkrevd og må være en tekst.",
    passwordTooShort: "Passord må ha minst 8 tegn.",
    consentRequired: "Samtykke er påkrevd.",
    tosRequired: "Du må godta vilkårene for bruk.",
    emailTaken: "E-post er allerede i bruk.",
    invalidCredentials: "Feil e-post eller passord.",
    unauthorized: "Ikke autorisert.",
    deckNotFound: "Kortstokk ble ikke funnet.",
    deckTitleRequired: "Tittel på kortstokk er påkrevd.",
    flashcardNotFound: "Flashcard ble ikke funnet.",
    questionRequired: "Spørsmål er påkrevd.",
    answerRequired: "Svar er påkrevd.",
    serverError: "En uventet feil oppstod."
  }
};

export function getLang(req) {
  const header = req.headers["accept-language"] || "en";
  const lang = header.split(",")[0].split("-")[0].toLowerCase().trim();
  return messages[lang] ? lang : "en";
}

export function msg(req, key) {
  const lang = getLang(req);
  return { error: messages[lang]?.[key] ?? messages.en[key] ?? key };
}