import "./views/userLogIn.mjs"
import "./views/userSettings.mjs"
import "./views/userApp.mjs"
import "./views/deckDetail.mjs"
import UserModel from "./models/userModel.mjs"
import { t } from "./i18n/translations.mjs"

const root = document.body
const loginView = document.createElement("login-view")
document.title = t("appTitle")
loginView.render()
root.appendChild(loginView)

loginView.addEventListener("create-user", async e => {
  try {
    await UserModel.createUser(e.detail.email, e.detail.password, e.detail.acceptToS)
    loginView.showStatus("Account created! You can now log in.", false)
    loginView.shadow.querySelector(".tab-btn[data-tab='login']").click()
  } catch (err) {
    console.error(err)
    loginView.showStatus(err.message, true)
  }
})

loginView.addEventListener("login-user", async e => {
  try {
    await UserModel.login(e.detail.email, e.detail.password)
    loginView.remove()
    const appView = document.createElement("app-view")
    root.appendChild(appView)
    await appView.render()
  } catch (err) {
    console.error(err)
    loginView.showStatus(err.message, true)
  }
})

document.addEventListener("show-settings", () => {
  const current = root.querySelector("app-view")
  const settingsView = document.createElement("user-settings-view")
  settingsView.render()
  current.replaceWith(settingsView)

  settingsView.addEventListener("go-back", async () => {
    const newAppView = document.createElement("app-view")
    settingsView.replaceWith(newAppView)
    await newAppView.render()
  })

  settingsView.addEventListener("logout", () => {
    UserModel.logout()
    location.reload()
  })

  settingsView.addEventListener("delete-user", async () => {
    try {
      await UserModel.deleteUser()
      UserModel.logout()
      location.reload()
    } catch (err) {
      console.error(err)
    }
  })

  settingsView.addEventListener("change-email", async e => {
    try {
      await UserModel.changeEmail(e.detail.email)
      settingsView.showStatus("Email updated!", false)
    } catch (err) {
      settingsView.showStatus(err.message, true)
    }
  })

  settingsView.addEventListener("change-password", async e => {
    try {
      await UserModel.changePassword(e.detail.currentPassword, e.detail.newPassword)
      settingsView.showStatus("Password updated!", false)
    } catch (err) {
      settingsView.showStatus(err.message, true)
    }
  })
})

document.addEventListener("open-deck", async e => {
  const { deckId } = e.detail
  const current = root.querySelector("app-view")
  const deckView = document.createElement("flashcard-view")
  current.replaceWith(deckView)
  await deckView.render(deckId)

  deckView.addEventListener("go-back", async () => {
    const newAppView = document.createElement("app-view")
    deckView.replaceWith(newAppView)
    await newAppView.render()
  })
})

window.addEventListener("online", () => console.log(t("onlineMessage")))
window.addEventListener("offline", () => console.log(t("offlineMessage")))