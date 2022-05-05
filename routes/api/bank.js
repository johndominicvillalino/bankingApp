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

                getBank.balance -= amount

                updateSingleData(Banks, getBank)
                return res.json('done')
                break;
            case 'deposit':


                getBank.balance += amount

                updateSingleData(Banks, getBank)
                return res.json('done')
                break;
            default:
                break;
        }

    }


    // const {account,action,amount} = req.body

})




module.exports = router;
