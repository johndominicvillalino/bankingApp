const { v4: uuid } = require('uuid');

class Bank {

    constructor(obj) {
        const {fName,lName,age,initialDeposit,ownerId} = obj
        this.fName = fName
        this.lName = lName
        this.age = age
        this.initialDeposit = initialDeposit
        this.withdrawals = []
        this.balance = initialDeposit
        this.deposits = []
        this.accountNum = uuid()
        this.accountName = fName + " " + lName
        this.ownerId = ownerId ? ownerId : uuid()
    }
}

module.exports = Bank