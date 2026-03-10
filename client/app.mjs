
import "./views/createUser.mjs"
import "./views/userLogIn.mjs"
import "./views/userSettings.mjs"
import "./views/userApp.mjs"
import UserModel from "./models/userModel.mjs"
import { t } from "./i18n/translations.mjs"

const root = document.body

const createUserView = document.createElement("create-user-view")
const loginView = document.createElement("login-view")
const settingsView = document.createElement("user-settings-view")

document.title = t("appTitle")

loginView.render()
createUserView.render()
settingsView.render()

root.appendChild(loginView)

loginView.addEventListener("show-create-user", () => {
  loginView.remove()
  root.appendChild(createUserView)
})

createUserView.addEventListener("show-login", () => {
  createUserView.remove()
  root.appendChild(loginView)
})

createUserView.addEventListener("create-user", async e => {
  try {
    await UserModel.createUser(e.detail.email, e.detail.password, e.detail.acceptToS)
    alert(t("userCreated"))
    createUserView.remove()
    root.appendChild(loginView)
  } catch(err) {
    console.error(err)
    alert(t("couldNotCreate"))
  }
})

loginView.addEventListener("login-user", async e => {
  try {
    await UserModel.login(e.detail.email, e.detail.password)
    loginView.remove()
    createUserView.remove()
    const appView = document.createElement("app-view")
    root.appendChild(appView)
    appView.render()
    alert(t("welcomeUser", { username: e.detail.email }))
  } catch(err) {
    console.error(err)
    alert(t("wrongCredentials"))
  }
})

settingsView.addEventListener("delete-user", async () => {
  try {
    await UserModel.deleteUser()
    alert(t("accountDeleted"))
  } catch(err) {
    console.error(err)
    alert(t("couldNotDelete"))
  }
})

window.addEventListener("online", () => console.log(t("onlineMessage")))
window.addEventListener("offline", () => console.log(t("offlineMessage")))

export function refreshTranslations() {
  document.title = t("appTitle")
}