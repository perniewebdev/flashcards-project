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
      <button id="delete-account">Delete account</button>
    `
    this.bindEvents()
  }

  bindEvents() {
    this.shadow.getElementById("delete-account")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("delete-user", { composed: true, bubbles: true }))
    })
  }
}

customElements.define("user-settings-view", UserSettingsView)