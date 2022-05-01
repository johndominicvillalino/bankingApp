const express = require("express");
const router = express.Router();
const {Banks,Users} = require('../../Constants/Constants.js')
const fs = require("fs");
const { check, validationResult } = require("express-validator");
const {getData,updateData} = require('../../functions/helper.js')
const Bank = require("../../dbSchema/Bank.js");


//@@ private
//@@ /bank

router.get("/", [
    check("id", "No Id found").not().isEmpty()
], async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const test = await getData(Banks)
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
    
    const {id, fName,lName,age,initialDeposit,ownerId} = req.body

    let users = getData(Users)
    

    users = users.find(e => e.id === id)


    if(users.isAdmin === false) {
        return res.json('Error Unauthorized!')
    }

    const newBank = new Bank({
        fName,lName,age,initialDeposit,ownerId
      
    })

    let updateBankData = updateData(Banks,newBank)

    return res.json(updateBankData)



});




module.exports = router;
