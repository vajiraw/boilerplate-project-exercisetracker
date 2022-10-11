const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

//const User = require('./user')
const { default: mongoose, Mongoose } = require('mongoose')
const { Schema,Types } = mongoose;
const {User,Exercise} = require('./user')
//const user = require('./user')

mongoose.connect(`mongodb+srv://kassw:March@cluster0.ipvtxd6.mongodb.net/?retryWrites=true&w=majority`)
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

// iinsert a  new user with user ame and generated default _id and response with
// inserted record
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

// this method retrives all reords
app.get('/api/users',(req,res)=>{   
  User.find((err,data)=>{
    //console.log(data);
    res.send(data)
  })
})

///api/users/:_id/exercises
app.post('/api/users/:_id/exercises',(req,res)=>{
  let {_id} = req.params
  console.log("id :: "+_id);
  let description = req.body.description
  let duration = req.body.duration
  let date = req.body.date

  req.body.date === ""?date = new Date(): date = req.body.date;    
  let exDate = dateformatter(date)

  let exercise =  new Exercise(
    {
    'user' : (_id),    
    'description' : description,
    'duration' : parseInt(duration),
    'date' : exDate
  })
  exercise.save((err,data)=>{
    if(err) console.log(err);

    //console.log(data);
   // data.date = dateformatter(data.date)
  //  delete data.date;
  //  data.date2 = '2000-12-12'
  //   
    User.findById(_id,(err,userdata)=>{
     // console.log(userData);

      res.json({        
        username: userdata.username,
        description:data.description,
        duration: data.duration,
        date : data.date.toDateString(),             
        id: _id,        
      })
    })
    

  
  })
    

  function dateformatter(date) {
    let y = date.getUTCFullYear()
    let m = date.getUTCMonth() + 1
    let d = date.getUTCDate()
    let exDate = y + '-' + m + '-' + d
    console.log(exDate)
    return exDate
  }
  })



  


  
    
  




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
