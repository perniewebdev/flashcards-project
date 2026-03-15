import { t } from "../i18n/translations.mjs"

export class LoginView extends HTMLElement {
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
        <h1>${t("welcome")}</h1>
        <div id="status" class="status hidden"></div>
        <div class="tabs">
          <button class="tab-btn active" data-tab="login">${t("login")}</button>
          <button class="tab-btn" data-tab="signup">${t("createAccount")}</button>
        </div>

        <div id="login-tab" class="tab-content">
          <form id="login-form">
            <input id="login-email" type="email" placeholder="${t("email")}" required>
            <input id="login-password" type="password" placeholder="${t("password")}" required>
            <button type="submit">${t("login")}</button>
          </form>
        </div>

        <div id="signup-tab" class="tab-content hidden">
          <form id="signup-form">
            <input id="signup-email" type="email" placeholder="${t("email")}" required>
            <input id="signup-password" type="password" placeholder="${t("password")}" required>
            <input id="signup-confirm" type="password" placeholder="${t("confirmPassword")}" required>
            <label>
              <input type="checkbox" id="consent">
              I accept the <span class="link" id="show-tos-link">${t("termsOfService")}</span> and <span class="link" id="show-privacy-link">Privacy Policy</span>
            </label>
            <button type="submit" id="signup-btn" disabled>${t("signUp")}</button>
          </form>
          <div id="policy-container"></div>
        </div>
      </div>
    `
    this.bindEvents()
  }

  showStatus(message, isError = false) {
    const status = this.shadow.getElementById("status")
    status.textContent = message
    status.className = `status ${isError ? "error" : "success"}`
  }

  bindEvents() {
    this.shadow.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.shadow.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"))
        this.shadow.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"))
        btn.classList.add("active")
        this.shadow.getElementById(`${btn.dataset.tab}-tab`).classList.remove("hidden")
        this.shadow.getElementById("status").className = "status hidden"
      })
    })

    const consent = this.shadow.getElementById("consent")
    const signupBtn = this.shadow.getElementById("signup-btn")

    consent.addEventListener("change", () => {
      signupBtn.disabled = !consent.checked
    })

    this.shadow.getElementById("login-form").addEventListener("submit", e => {
      e.preventDefault()
      this.dispatchEvent(new CustomEvent("login-user", {
        composed: true, bubbles: true,
        detail: {
          email: this.shadow.getElementById("login-email").value,
          password: this.shadow.getElementById("login-password").value
        }
      }))
    })

    this.shadow.getElementById("signup-form").addEventListener("submit", e => {
      e.preventDefault()
      const password = this.shadow.getElementById("signup-password").value
      const confirm = this.shadow.getElementById("signup-confirm").value
      if (password !== confirm) {
        this.showStatus(t("passwordMismatch"), true)
        return
      }
      this.dispatchEvent(new CustomEvent("create-user", {
        composed: true, bubbles: true,
        detail: {
          email: this.shadow.getElementById("signup-email").value,
          password,
          acceptToS: consent.checked,
          acceptPrivacy: consent.checked
        }
      }))
    })

    this.shadow.getElementById("show-tos-link").addEventListener("click", () => {
      this.showPolicy(this.shadow.getElementById("policy-container"), "TOS.md")
    })

    this.shadow.getElementById("show-privacy-link").addEventListener("click", () => {
      this.showPolicy(this.shadow.getElementById("policy-container"), "PRIVACY.md")
    })
  }

  showPolicy(container, file) {
    fetch(`./policies/${file}`)
      .then(res => res.text())
      .then(text => {
        container.innerHTML = `
          <div class="policy">
            <pre>${text}</pre>
            <button id="close-policy">${t("offlineBack")}</button>
          </div>
        `
        container.querySelector("#close-policy")?.addEventListener("click", () => container.innerHTML = "")
      })
  }
}

customElements.define("login-view", LoginView)