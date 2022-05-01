const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const bodyParser = require('body-parser')




//@@ middleware

app.use(express.static('client'))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
  }));

// parse application/json
app.use(bodyParser.json())

app.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname + '/client/home.html'))
})


app.use('/api/login', require('./routes/api/login'));
app.use('/api/account/create', require('./routes/api/create'));


app.listen(port, () => {
    console.log(`Running on port ${port}`)
})