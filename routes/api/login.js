const express = require("express");
const router = express.Router();
const User = require("../../db/Users.json");
const fs = require("fs");
const {Users} = require('../../Constants/Constants.js')
const {check,validationResult} = require('express-validator')
const {getData,updateData} = require('../../functions/helper.js')


//@@ login 
//@@ public 
router.post('/',[
   check('email',"Email is Invalid").isEmail(),
   check('password',"Password is Required").not().isEmpty(),
],(req,res) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   const {email, password} = req.body

         let data = getData(Users)
   
         data = data.find(e => e.email === email)

         if(!data) {
            return res.json('Email not found')
         }

         if(data.password !== password) {
            return res.json('password incorrect')
         } else {
            return res.json(data)
         }
        
       
})

module.exports = router;
