const BASE_URL = "http://localhost:3000"

let token = null

export default class UserModel {
  static async request(endpoint, method = "GET", body = null, auth = false) {
    const headers = { "Content-Type": "application/json" }
    if (auth && token) headers["Authorization"] = "Bearer " + token
    const res = await fetch(BASE_URL + endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.error || `Request failed: ${res.status}`)
    }
    const data = await res.json().catch(() => null)
    if (endpoint.endsWith("/auth/login") && data?.token) token = data.token
    return data
  }

  static async createUser(email, password, acceptToS) {
    return this.request("/users", "POST", { email, password, acceptToS })
  }

  static async login(email, password) {
    return this.request("/auth/login", "POST", { email, password }, false)
  }

  static async deleteUser() {
    return this.request("/users/me", "DELETE", null, true)
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

  static getToken() {
    return token
  }
}