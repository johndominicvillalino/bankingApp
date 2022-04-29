const express = require('express');
const router = express.Router();
const User = require('../../db/Users.json')


router.get('/', (req,res) => {

console.log('test')
   res.json(User)

})

module.exports = router;

