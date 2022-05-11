

const express = require("express");
const router = express.Router();
const { Banks } = require('../../Constants/Constants.js')
const { getData } = require('../../functions/helper.js')



//@@ /api/transactions

router.get('/',async(req,res) => {


    let banks = await getData(Banks)
    banks = banks.map(e => {
        return {
            fName: e.fName,
            lName: e.lName,
            widthdrawals : e.widthdrawals,
            deposits : e.deposits,
        }
    })


})


module.exports = router