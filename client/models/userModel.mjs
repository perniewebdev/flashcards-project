
let users = [];

export default class UserModel {

  static async loadUsers() {
    const res = await fetch("./data/users.json");
    users = await res.json();
    return users;
  }

  static async createUser(email, password) {
    const newUser = { email, password };
    users.push(newUser);
    return newUser;
  }

  static async updateUser(email, password) {
    if (users.length === 0) return null;
    users[0] = { email, password };
    return users[0];
  }

  static async deleteUser() {
    users = [];
    return true;
  }

  static getUsers() {
    return users;
  }
}
