
import { t } from "../i18n/translations.mjs"

export class UserSettingsView extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
    const styleLink = document.createElement("link")
    styleLink.rel = "stylesheet"
    styleLink.href = "./app.css"
    this.shadow.appendChild(styleLink)
    this.container = document.createElement("div")
    this.shadow.appendChild(this.container)
  }

  render() {
    this.container.innerHTML = `
      <div class="auth-container">
        <div class="app-header">
          <button id="back-btn" class="secondary">← Back</button>
          <h1>Settings</h1>
        </div>
        <button id="logout-btn" class="secondary">${t("logout")}</button>
        <button id="delete-account" class="danger">${t("deleteAccount")}</button>
      </div>
    `
    this.bindEvents()
  }

  bindEvents() {
    this.shadow.getElementById("logout-btn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("logout", { composed: true, bubbles: true }))
    })

    this.shadow.getElementById("delete-account").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("delete-user", { composed: true, bubbles: true }))
    })

    this.shadow.getElementById("back-btn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("go-back", { composed: true, bubbles: true }))
    })
  }
}

customElements.define("user-settings-view", UserSettingsView)