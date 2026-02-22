
import "./views/userView.mjs"
import UserModel from "./models/userModel.mjs"

const userView = document.createElement("user-view")
document.body.appendChild(userView)
userView.refresh()

userView.addEventListener("create-user", async e => {
  try { await UserModel.createUser(e.detail.email, e.detail.password, e.detail.acceptToS) } 
  catch(err) { console.error(err) }
})

userView.addEventListener("login-user", async e => {
  try { await UserModel.login(e.detail.email, e.detail.password) } 
  catch(err) { console.error(err) }
})

userView.addEventListener("delete-user", async () => {
  try { await UserModel.deleteUser() } 
  catch(err) { console.error(err) }
})