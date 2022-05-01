const { v4: uuid } = require('uuid');

class Users {
  constructor(obj) {
    const {fName, lName, age, email} = obj;
    this.fName = fName;
    this.lName = lName;
    this.age = age;
    this.id = uuid();
    this.email = email;
    this.isAdmin = false;
    this.fullName = this.fName + " " + lName;
  }
}

module.exports = Users;
