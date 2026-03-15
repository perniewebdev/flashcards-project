
import UserModel from "../models/userModel.mjs"
import { t } from "../i18n/translations.mjs"

export class AppView extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
    const styleLink = document.createElement("link")
    styleLink.rel = "stylesheet"
    styleLink.href = "./app.css"
    this.shadow.appendChild(styleLink)
    this.container = document.createElement("div")
    this.shadow.appendChild(this.container)
    this.decks = []
  }

  async render() {
    this.container.innerHTML = `
      <div class="app-container">
        <div class="app-header">
          <h1>${t("welcome")}</h1>
          <button id="settings-btn" class="secondary">⚙ Settings</button>
        </div>
        <div class="deck-section">
          <h2>${t("decks")}</h2>
          <form id="create-deck-form">
            <input id="deck-title" type="text" placeholder="${t("createDeck")}" required>
            <button type="submit">${t("createDeck")}</button>
          </form>
          <div id="deck-list"></div>
        </div>
      </div>
    `
    this.bindEvents()
    await this.loadDecks()
  }

  async loadDecks() {
    try {
      this.decks = await UserModel.getDecks()
      this.renderDecks()
    } catch (err) {
      console.error(err)
    }
  }

  renderDecks() {
    const list = this.shadow.getElementById("deck-list")
    if (this.decks.length === 0) {
      list.innerHTML = `<p class="muted">No decks yet.</p>`
      return
    }
    list.innerHTML = this.decks.map(deck => `
      <div class="deck-card" data-id="${deck.id}">
        <span>${deck.title}</span>
        <button class="study-btn secondary" data-id="${deck.id}">${t("study")}</button>
        <button class="delete-deck-btn danger" data-id="${deck.id}">${t("deleteDeck")}</button>
      </div>
    `).join("")

    this.shadow.querySelectorAll(".study-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("study-deck", {
          composed: true, bubbles: true,
          detail: { deckId: btn.dataset.id }
        }))
      })
    })

    this.shadow.querySelectorAll(".delete-deck-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          await UserModel.deleteDeck(btn.dataset.id)
          await this.loadDecks()
        } catch (err) {
          console.error(err)
        }
      })
    })
  }

  bindEvents() {
    this.shadow.getElementById("create-deck-form").addEventListener("submit", async e => {
      e.preventDefault()
      const title = this.shadow.getElementById("deck-title").value
      try {
        await UserModel.createDeck(title)
        this.shadow.getElementById("deck-title").value = ""
        await this.loadDecks()
      } catch (err) {
        console.error(err)
      }
    })

    this.shadow.getElementById("settings-btn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("show-settings", { composed: true, bubbles: true }))
    })
  }
}

customElements.define("app-view", AppView)