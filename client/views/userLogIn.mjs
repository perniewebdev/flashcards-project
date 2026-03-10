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
      <form id="login-form">
        <input id="login-email" type="email" placeholder="Email" required>
        <input id="login-password" type="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <button id="show-create-user">Create Account</button>
    `
    this.bindEvents()
  }

  bindEvents() {
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

    this.shadow.getElementById("show-create-user").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("show-create-user", { composed: true, bubbles: true }))
    })
  }
}

customElements.define("login-view", LoginView)