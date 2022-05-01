const express = require("express");
const router = express.Router();
const User = require("../../db/Users.json");
const fs = require("fs");
const { dirname, resolve, parse } = require("path");

router.get("/", (req, res) => {
   const Users = resolve(dirname(require.main.filename) + "/db/Users.json");
  fs.readFile(Users, "utf8", function (err, data) {
    if (err) throw err;
    let returnData = JSON.parse(data)
    res.json(returnData)
  });
});

router.post("/", (req, res) => {
  const Users = resolve(dirname(require.main.filename) + "/db/Users.json");
  fs.readFile(Users, "utf8", function (err, data) {
    if (err) {
      throw err;
    } else {
      let parsed = JSON.parse(data);
      parsed.push({ userName: "anotherTest", password: "passwordtwo" });
      parsed = JSON.stringify(parsed);
      fs.writeFile(Users, parsed, (err) => {
        if (err) throw err;
        console.log("save");
      });
    }
  });
});

module.exports = router;
