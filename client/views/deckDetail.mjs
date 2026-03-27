import UserModel from "../models/userModel.mjs"
import { t } from "../i18n/translations.mjs"

export class FlashcardView extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
    const styleLink = document.createElement("link")
    styleLink.rel = "stylesheet"
    styleLink.href = "/flashcards-project/client/app.css"
    this.shadow.appendChild(styleLink)
    this.container = document.createElement("div")
    this.shadow.appendChild(this.container)
    this.flashcards = []
    this.studyIndex = 0
    this.flipped = false
    this.deckId = null
  }

  async render(deckId) {
    this.deckId = deckId
    this.renderMain()
    this.bindMainEvents()
    await this.loadFlashcards()
  }

  renderMain() {
    this.container.innerHTML = `
      <div class="app-container">
        <div class="app-header">
          <button id="back-btn" class="secondary">← Back</button>
          <h1>${t("flashcards")}</h1>
          <button id="start-study-btn">${t("study")}</button>
        </div>
        <div class="flashcard-header">
          <h2>${t("flashcards")}</h2>
        </div>
        <form id="create-flashcard-form">
          <input id="question-input" type="text" placeholder="${t("question")}" required>
          <input id="answer-input" type="text" placeholder="${t("answer")}" required>
          <button type="submit">${t("createFlashcard")}</button>
        </form>
        <div id="flashcard-list"></div>
      </div>
    `
  }

  renderStudyMode() {
    this.container.innerHTML = `
      <div class="study-mode">
        <div class="study-header">
          <span id="card-counter" class="card-counter"></span>
          <button id="stop-study-btn" class="secondary">✕ Stop</button>
        </div>
        <div class="card-container">
          <div class="flashcard" id="flashcard">
            <div class="card-inner" id="card-inner">
              <div class="card-face card-front" id="card-front"></div>
              <div class="card-face card-back" id="card-back"></div>
            </div>
          </div>
          <div class="card-controls">
            <button id="flip-btn">${t("flipCard")}</button>
            <div class="card-nav">
              <button id="prev-btn" class="secondary">←</button>
              <button id="next-btn" class="secondary">→</button>
            </div>
          </div>
        </div>
      </div>
    `
    this.bindStudyEvents()
    this.renderCard()
  }

  async loadFlashcards() {
    try {
      this.flashcards = await UserModel.getFlashcards(this.deckId)
      this.renderList()
    } catch (err) {
      console.error(err)
    }
  }

  renderList() {
    const list = this.shadow.getElementById("flashcard-list")
    if (!list) return
    if (this.flashcards.length === 0) {
      list.innerHTML = `<p class="muted">No flashcards yet.</p>`
      return
    }
    list.innerHTML = this.flashcards.map(card => `
      <div class="deck-card" data-id="${card.id}">
        <div class="card-info">
          <span class="card-question"><strong>Q:</strong> ${card.question}</span>
          <span class="card-answer muted"><strong>A:</strong> ${card.answer}</span>
        </div>
        <div class="card-actions">
          <button class="edit-card-btn secondary" data-id="${card.id}">✏ Edit</button>
          <button class="delete-card-btn danger" data-id="${card.id}">${t("deleteFlashcard")}</button>
        </div>
      </div>
    `).join("")

    this.shadow.querySelectorAll(".delete-card-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          await UserModel.deleteFlashcard(this.deckId, btn.dataset.id)
          await this.loadFlashcards()
        } catch (err) {
          console.error(err)
        }
      })
    })

    this.shadow.querySelectorAll(".edit-card-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const card = this.flashcards.find(c => c.id === btn.dataset.id)
        if (!card) return
        const cardEl = this.shadow.querySelector(`.deck-card[data-id="${card.id}"]`)
        cardEl.innerHTML = `
          <div class="edit-form">
            <input class="edit-question" type="text" value="${card.question}">
            <input class="edit-answer" type="text" value="${card.answer}">
            <div class="card-actions">
              <button class="save-edit-btn" data-id="${card.id}">Save</button>
              <button class="cancel-edit-btn secondary">Cancel</button>
            </div>
          </div>
        `
        cardEl.querySelector(".save-edit-btn").addEventListener("click", async () => {
          const question = cardEl.querySelector(".edit-question").value.trim()
          const answer = cardEl.querySelector(".edit-answer").value.trim()
          if (!question || !answer) return
          try {
            await UserModel.deleteFlashcard(this.deckId, card.id)
            await UserModel.createFlashcard(this.deckId, question, answer)
            await this.loadFlashcards()
          } catch (err) {
            console.error(err)
          }
        })
        cardEl.querySelector(".cancel-edit-btn").addEventListener("click", () => {
          this.renderList()
        })
      })
    })
  }

  renderCard() {
    const card = this.flashcards[this.studyIndex]
    this.shadow.getElementById("card-front").innerHTML = `<span class="card-label">Q</span>${card.question}`
    this.shadow.getElementById("card-back").innerHTML = `<span class="card-label">A</span>${card.answer}`
    this.shadow.getElementById("card-counter").textContent = `${this.studyIndex + 1} / ${this.flashcards.length}`
    this.flipped = false
    this.shadow.getElementById("card-inner").classList.remove("flipped")
  }

  bindMainEvents() {
    this.shadow.getElementById("back-btn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("go-back", { composed: true, bubbles: true }))
    })

    this.shadow.getElementById("create-flashcard-form").addEventListener("submit", async e => {
      e.preventDefault()
      const question = this.shadow.getElementById("question-input").value
      const answer = this.shadow.getElementById("answer-input").value
      try {
        await UserModel.createFlashcard(this.deckId, question, answer)
        this.shadow.getElementById("question-input").value = ""
        this.shadow.getElementById("answer-input").value = ""
        await this.loadFlashcards()
      } catch (err) {
        console.error(err)
      }
    })

    this.shadow.getElementById("start-study-btn").addEventListener("click", () => {
      if (this.flashcards.length === 0) return
      this.studyIndex = 0
      this.flipped = false
      this.renderStudyMode()
    })
  }

  bindStudyEvents() {
    this.shadow.getElementById("stop-study-btn").addEventListener("click", () => {
      this.renderMain()
      this.bindMainEvents()
      this.loadFlashcards()
    })

    this.shadow.getElementById("flip-btn").addEventListener("click", () => {
      this.flipped = !this.flipped
      this.shadow.getElementById("card-inner").classList.toggle("flipped", this.flipped)
    })

    this.shadow.getElementById("next-btn").addEventListener("click", () => {
      if (this.studyIndex < this.flashcards.length - 1) {
        this.studyIndex++
        this.renderCard()
      }
    })

    this.shadow.getElementById("prev-btn").addEventListener("click", () => {
      if (this.studyIndex > 0) {
        this.studyIndex--
        this.renderCard()
      }
    })
  }
}

customElements.define("flashcard-view", FlashcardView)