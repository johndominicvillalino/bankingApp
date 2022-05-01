const { v4: uuid } = require('uuid');

class Users {
  constructor(obj) {
    const {fName, lName, age,password, email} = obj;
    this.fName = fName;
    this.lName = lName;
    this.age = age;
    this.password = password;
    this.id = uuid();
    this.email = email;
    this.isAdmin = false;
    this.fullName = this.fName + " " + lName;
  }
}

module.exports = Users;
