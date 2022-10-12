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
  let description = req.body.description
  let duration = req.body.duration
  let date = req.body.date

  req.body.date === ""?date = new Date(): date =  new Date(req.body.date);    
  let exDate = dateformatter(date)
  var did = mongoose.Types.ObjectId(_id);
  let exercise =  new Exercise(
    {
    'user' : (did),    
    'description' : description,
    'duration' : parseInt(duration),
    'date' : exDate
  })
  exercise.save((err,data)=>{
    if(err) console.log(err);
   let user =  User.findById(_id, (err, docs)=>{
     if(err) console.error(err)

     res.json({'username': docs.username,
      'description': data.description,
      'duration' : data.duration,
      'date' : data.date.toDateString(),
      '_id': _id
    })
  
  }) 
   
  });

  function dateformatter(date) {
    let y = date.getUTCFullYear()
    let m = date.getUTCMonth() + 1
    let d = date.getUTCDate()
    let exDate = y + '-' + m + '-' + d
    return exDate
  }
  })



  app.get('/api/users/:_id/logs', async (req,res)=>{
    const { from, to, limit } = req.query
    const  _id = req.params._id;
    let errorMsg = null;
    
    console.log(from,to,limit);

    if(_id ==""){
      res.send("Invalid request")
    }
    // from to limit validatons

    User.findById(mongoose.Types.ObjectId(_id),(err,userdata)=>{
      if(err) console.error(err);

        let exer = [];
        Exercise.find({'user':mongoose.Types.ObjectId(_id)},(err,exedata) =>{
          if(err) res.json({'error':'Error Occured'})
          //console.log('exer: '+data);
          //let count = data.length;
          //console.log('couont:::  '+count);

          exedata.forEach((exedata)=>{
              exer.push({'description':exedata.description, 'duration': exedata.duration,'date':exedata.date.toDateString()})
          })



          //res.json(data)
          res.json({'username':userdata.username,
                    'count': exedata.length,
                    _id,
                    log: exer
        })


        })


    
      //console.log(data);
    })

  })



  


  
    
  




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
