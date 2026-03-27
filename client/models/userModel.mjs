const BASE_URL = "http://localhost:3000"

export default class UserModel {
  static token = localStorage.getItem("token") || null

  static async request(endpoint, method = "GET", body = null, auth = false) {
    const headers = { "Content-Type": "application/json" }
    if (auth && this.token) headers["Authorization"] = "Bearer " + this.token
    const res = await fetch(BASE_URL + endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.error || `Request failed: ${res.status}`)
    }
    return res.json().catch(() => null)
  }

  static async createUser(email, password, acceptToS) {
    return this.request("/users", "POST", { email, password, acceptToS })
  }

  static async login(email, password) {
    const data = await this.request("/auth/login", "POST", { email, password })
    if (data?.token) {
      this.token = data.token
      localStorage.setItem("token", data.token)
    }
    return data
  }

  static async deleteUser() {
    return this.request("/users/me", "DELETE", null, true)
  }

  static async changeEmail(email) {
    return this.request("/users/me/email", "PATCH", { email }, true)
  }

  static async changePassword(currentPassword, newPassword) {
    return this.request("/users/me/password", "PATCH", { currentPassword, newPassword }, true)
  }

  static logout() {
    this.token = null
    localStorage.removeItem("token")
  }

  static async getDecks() {
    return this.request("/decks", "GET", null, true)
  }

  static async createDeck(title) {
    return this.request("/decks", "POST", { title }, true)
  }

  static async deleteDeck(deckId) {
    return this.request(`/decks/${deckId}`, "DELETE", null, true)
  }

  static async getFlashcards(deckId) {
    return this.request(`/decks/${deckId}/flashcards`, "GET", null, true)
  }

  static async createFlashcard(deckId, question, answer) {
    return this.request(`/decks/${deckId}/flashcards`, "POST", { question, answer }, true)
  }

  static async deleteFlashcard(deckId, flashcardId) {
    return this.request(`/decks/${deckId}/flashcards/${flashcardId}`, "DELETE", null, true)
  }

  static getToken() {
    return this.token
  }
}