const express = require("express");
const router = express.Router();
const fs = require("fs");
const User = require("../../dbSchema/Users.js");
const { dirname, resolve } = require("path");
const {Users} = require('../../Constants/Constants.js')
const { check, validationResult } = require("express-validator");
const {getData,updateData} = require('../../functions/helper.js')

//@@ public
//@@ api/account/create
router.post(
  "/",
  [
    check("lName", "Last Name Required").not().isEmpty(),
    check("fName", "First Name Required").not().isEmpty(),
    check("age", "Error vote ID").isNumeric().not().isEmpty(),
    check("password", "Password Required").not().isEmpty(),
    check("email", "Error in Email").isEmail(),
  ],
  (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {lName,fName,age,email,password} = req.body

    const obj = {
        lName,fName,age,email,password
    };

    let user = new User(obj);

    let users = getData(Users)

    // check if user exist
    const check = users.find(e => e.email === email)
    if(check) {
        return res.status(400).json(`Invalid! ${email} account exist`)
    }

    let updateNow = updateData(Users,user)

    if(updateNow) {
        res.json({id: user.id})
    }
  }
);

module.exports = router;
