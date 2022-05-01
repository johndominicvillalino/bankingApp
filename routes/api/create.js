const express = require("express");
const router = express.Router();
const fs = require("fs");
const User = require("../../dbSchema/Users.js");
const { dirname, resolve } = require("path");
const { check, validationResult } = require("express-validator");

//@@ public
//@@ api/account/create
router.post(
  "/",
  [
    check("lName", "Last Name Required").not().isEmpty(),
    check("fName", "First Name Required").not().isEmpty(),
    check("age", "Error vote ID").isNumeric().not().isEmpty(),
    check("email", "Error in Email").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const obj = {
      lName: "Villalino",
      fName: "John",
      age: 18,
      email: "john@email.com",
    };

    let user = new User(obj);
    const Users = resolve(dirname(require.main.filename) + "/db/Users.json");

    fs.readFile(Users, "utf8", function (err, data) {
      if (err) {
        throw err;
      } else {
        let parsed = JSON.parse(data);
        parsed.push(user);
        parsed = JSON.stringify(parsed);

        fs.writeFile(Users, parsed, (err) => {
          if (err) throw err;
          console.log("save");
        });
      }
    });
  }
);

module.exports = router;
