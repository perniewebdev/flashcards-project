import { t } from "../i18n/translations.mjs"

export class UserSettingsView extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
    const styleLink = document.createElement("link")
    styleLink.rel = "stylesheet"
    styleLink.href = "./app.css"
    this.shadow.appendChild(styleLink)
    const style = document.createElement("style")
    this.shadow.appendChild(style)
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

        <div id="status" class="status hidden"></div>

        <div class="settings-section">
          <h2>Change Email</h2>
          <form id="email-form">
            <input id="new-email" type="email" placeholder="${t("email")}" required>
            <button type="submit">Update Email</button>
          </form>
        </div>

        <div class="settings-section">
          <h2>Change Password</h2>
          <form id="password-form">
            <input id="current-password" type="password" placeholder="Current password" required>
            <input id="new-password" type="password" placeholder="New password (min 8 chars)" required>
            <input id="confirm-password" type="password" placeholder="${t("confirmPassword")}" required>
            <button type="submit">Update Password</button>
          </form>
        </div>

        <div class="danger-zone">
          <button id="logout-btn" class="secondary">${t("logout")}</button>
          <button id="delete-account" class="danger">${t("deleteAccount")}</button>
        </div>
      </div>
    `
    this.bindEvents()
  }

  showStatus(message, isError = false) {
    const status = this.shadow.getElementById("status")
    status.textContent = message
    status.className = `status ${isError ? "error" : "success"}`
    setTimeout(() => {
      status.className = "status hidden"
    }, 4000)
  }

  bindEvents() {
    this.shadow.getElementById("back-btn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("go-back", { composed: true, bubbles: true }))
    })

    this.shadow.getElementById("logout-btn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("logout", { composed: true, bubbles: true }))
    })

    this.shadow.getElementById("delete-account").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("delete-user", { composed: true, bubbles: true }))
    })

    this.shadow.getElementById("email-form").addEventListener("submit", e => {
      e.preventDefault()
      const email = this.shadow.getElementById("new-email").value
      this.dispatchEvent(new CustomEvent("change-email", {
        composed: true, bubbles: true,
        detail: { email }
      }))
    })

    this.shadow.getElementById("password-form").addEventListener("submit", e => {
      e.preventDefault()
      const currentPassword = this.shadow.getElementById("current-password").value
      const newPassword = this.shadow.getElementById("new-password").value
      const confirmPassword = this.shadow.getElementById("confirm-password").value
      if (newPassword !== confirmPassword) {
        this.showStatus(t("passwordMismatch"), true)
        return
      }
      if (newPassword.length < 8) {
        this.showStatus(t("passwordTooShort"), true)
        return
      }
      this.dispatchEvent(new CustomEvent("change-password", {
        composed: true, bubbles: true,
        detail: { currentPassword, newPassword }
      }))
    })
  }
}

customElements.define("user-settings-view", UserSettingsView)