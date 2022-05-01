class Bank {
    constructor(
        fName,
        lName,
        age,
        initialDeposit,
        withdrawals = [],
        balance = initialDeposit,
        deposits = [initialDeposit]
    ) {
        this.fName = fName
        this.lName = lName
        this.age = age
        this.initialDeposit = initialDeposit
        this.withdrawals = withdrawals
        this.balance = balance
        this.deposits = deposits
    }
}

module.exports = Bank