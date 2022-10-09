const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

const User = require('./user')
const { default: mongoose } = require('mongoose')
const user = require('./user')
//const user = require('./user')

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ipvtxd6.mongodb.net/?retryWrites=true&w=majority`)
        .then(()=>{console.log('connected');})
        .catch((err)=>{console.log(err);})



app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users',(req,res)=>{
  let name = req.body.username
  let user = new User({username:name})
  user.save((err,data)=>{
    if(err){
      console.error(err);
    }
    res.send(data);
  });  
})



app.get('/api/users',(req,res)=>{
  user.find((err,data)=>{
    //console.log(data);
    res.send(data)
  })
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
