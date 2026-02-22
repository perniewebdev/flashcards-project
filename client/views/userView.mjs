
export class UserView extends HTMLElement {
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

  refresh() {
    this.container.innerHTML = `
      <form id="signup-form">
        <input id="email" type="email" placeholder="Email" required>
        <input id="password" type="password" placeholder="Password" required>
        <label><input type="checkbox" id="consent"> I agree to Terms</label>
        <button type="submit" id="signup-btn" disabled>Create account</button>
        <button type="button" id="show-tos">TOS</button>
        <button type="button" id="show-privacy">Privacy</button>
        <div id="policy-container"></div>
      </form>

      <form id="login-form">
        <input id="login-email" type="email" placeholder="Email" required>
        <input id="login-password" type="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>

      <button id="delete-account">Delete account</button>
    `
    this.bindEvents()
  }

  bindEvents() {
    const consent = this.shadow.getElementById("consent")
    const signupBtn = this.shadow.getElementById("signup-btn")
    const policyContainer = this.shadow.getElementById("policy-container")

    consent.addEventListener("change", () => signupBtn.disabled = !consent.checked)

    this.shadow.getElementById("signup-form").addEventListener("submit", e => {
      e.preventDefault()
      this.dispatchEvent(new CustomEvent("create-user", {
        composed: true, bubbles: true,
        detail: {
          email: this.shadow.getElementById("email").value,
          password: this.shadow.getElementById("password").value,
          acceptToS: consent.checked
        }
      }))
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

    this.shadow.getElementById("delete-account").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("delete-user", { composed: true, bubbles: true }))
    })

    this.shadow.getElementById("show-tos").addEventListener("click", () => this.showPolicy(policyContainer, "TOS.md"))
    this.shadow.getElementById("show-privacy").addEventListener("click", () => this.showPolicy(policyContainer, "PRIVACY.md"))
  }

  showPolicy(container, file) {
    fetch(`./policies/${file}`)
      .then(res => res.text())
      .then(text => {
        container.innerHTML = `
          <div class="policy">
            <pre>${text}</pre>
            <button id="close-policy">Close</button>
          </div>
        `
        container.querySelector("#close-policy")?.addEventListener("click", () => container.innerHTML = "")
      })
  }
}

customElements.define("user-view", UserView)