import "./views/userView.mjs";
import UserModel from "./models/userModel.mjs";

const userView = document.createElement("user-view");
document.body.appendChild(userView);

await UserModel.loadUsers();
userView.refresh();

userView.addEventListener("create-user", async e => {
    await UserModel.createUser(e.detail.email, e.detail.password);
    console.log(UserModel.getUsers());
});

userView.addEventListener("update-user", async e => {
    await UserModel.updateUser(e.detail.email, e.detail.password);
    console.log(UserModel.getUsers());
});

userView.addEventListener("delete-user", async e => {
    await UserModel.deleteUser();
    console.log(UserModel.getUsers());
});
