

const express = require("express");
const router = express.Router();
const { Banks } = require('../../Constants/Constants.js')
const { getData } = require('../../functions/helper.js')



//@@ /api/transactions

router.get('/',async(req,res) => {
    

    let returnThis = []
    let banks = await getData(Banks)

   
    banks = banks.map(e => {
        return {
            name: e.fName + " " + e.lName,
            widthdrawals : e.withdrawals,
            deposits : e.deposits,
        }
    })

    banks.forEach(e => {
        e.widthdrawals.forEach(el => {
            el.name = e.name
            returnThis.push(el)
        })
        e.deposits.forEach(ele => {
            ele.name = e.name
            returnThis.push(ele)
        })
    })

    returnThis = returnThis.sort((a,b) => b.time.localeCompare(a.time))



    return res.json(returnThis)


})


module.exports = router