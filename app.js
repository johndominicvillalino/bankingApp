const express = require('express')
const app = express()
const port = 5000
const path = require('path')


app.use(express.static('client'))


app.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname + '/client/home.html'))
})


app.use('/api/login', require('./routes/api/login'));


app.listen(port, () => {
    console.log(`Running on port ${port}`)
})