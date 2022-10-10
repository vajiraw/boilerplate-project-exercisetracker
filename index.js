const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

//const User = require('./user')
const { default: mongoose } = require('mongoose')
const { Schema } = mongoose;
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
  // if(req.body.date===""){
  //     date =  new Date()
  // }
  req.body.date === ""?date = new Date(): date = req.body.date;    
  //console.log(description,duration,date);

  //let n = new Schema.Types.ObjectId(_id)
  let exercise =  new Exercise(
    {
    'user' : _id,    
    'description' : description,
    'duration' : parseInt(duration),
    'date' : new Date(date)
  })
  console.log(exercise);
  let id = exercise._id;
  exercise.save((err,data)=>{
    if(err){console.log(err);}
    id = data._id;
    //res.send(data._id)


    Exercise.
    findById(id).
    populate('user').
    exec(function (err, exercise1) {
    if (err) console.log(err);
    console.log('The  is %s', exercise1);    
    res.json({'username':exercise1.user.username,
              'desdription':exercise.description,
              'duration': exercise.duration,
              'date' : exercise.date,
              'id': id
    });
    


  })



  })


  
    
  
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
