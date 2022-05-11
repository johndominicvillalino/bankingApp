const express = require("express");
const router = express.Router();
const { Banks, Users } = require('../../Constants/Constants.js')
const fs = require("fs");
const { check, validationResult } = require("express-validator");
const { getData, updateData, updateSingleData } = require('../../functions/helper.js')
const Bank = require("../../dbSchema/Bank.js");


//@@ private
//@@ /bank

router.get("/", [
    check("id", "No Id found").not().isEmpty()
], async (req, res) => {

    const { accountNum } = req.query

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }



    const test = await getData(Banks)


    if (accountNum) {

        const found = test.find(e => e.accountNum === accountNum)
        console.log(found)
        return res.json(found)
    }

    return res.json(test)

});

//@@ private
//@@ /bank

router.post("/", [
    check("id", "No Id found").not().isEmpty()
], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }

    const { id, fName, lName, age, initialDeposit, ownerId } = req.body
    let users = getData(Users)

    users = users.find(e => e.id === id)

    if (users.isAdmin === false) {
        return res.json('Error Unauthorized!')
    }

    const newBank = new Bank({
        fName, lName, age, initialDeposit, ownerId

    })

    let updateBankData = updateData(Banks, newBank)

    return res.json(updateBankData)

});

router.put('/', [
    check("account", "Account not found").not().isEmpty(),
    check("action", "Account not found").not().isEmpty(),
    check("amount", "Account not found").not().isEmpty(),

], async (req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }

    const { account, action, amount } = req.body

    let banks = await getData(Banks)
    let getBank = banks.find(e => e.accountNum === account)
    if (account) {

        switch (action) {
            case 'withdraw':
                const deduction = getBank.balance -= amount
                const widthdrawInfo = {
                    type: 'withdrawal',
                    running: deduction,
                    amount: amount,
                    time: new Date()
                }
                getBank.withdrawals.push(widthdrawInfo)
                getBank.balance -= amount
                updateSingleData(Banks, getBank)

                return res.json('done')
                break;
            case 'deposit':
                const addition = getBank.balance += amount
                const depositInfo = {
                    type: 'deposit',
                    running: addition,
                    amount: amount,
                    time: new Date()
                }
                getBank.deposits.push(depositInfo)


                updateSingleData(Banks, getBank)
                return res.json('done')
                break;
            default:
                break;
        }

    }



})




router.put('/transfer', [
    check('from', 'no From Id'),
    check('to', 'no to Id'),
    check('transVal', 'no transfer value ')
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }

    const { from, to, transValue } = req.body

    let banks = await getData(Banks)

    const fromBnk = banks.find(e => e.accountNum === from)

    const deduction = fromBnk.balance - transValue;

    const widthdrawInfo = {
        type: 'transfer',
        running: deduction,
        amount: transValue,
        time: new Date()
    }
    fromBnk.withdrawals.push(widthdrawInfo)

    fromBnk.balance = deduction

    updateSingleData(Banks, fromBnk)

    const toBnk = banks.find(e => e.accountNum === to)

    const addition =  toBnk.balance + transValue;
    const depositInfo = {
        type: 'transfer',
        running: addition,
        amount: transValue,
        time: new Date()
    }

    toBnk.deposits.push(depositInfo)

    toBnk.balance = addition

    updateSingleData(Banks, toBnk)

    return res.json('test')



})





module.exports = router;
