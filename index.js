const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const moment = require('moment')

const { default: mongoose, Mongoose } = require('mongoose')
const { Schema,Types } = mongoose;
const {User,Exercise} = require('./user')

mongoose.connect(`mongodb+srv://u:p@cluster0.ipvtxd6.mongodb.net/?retryWrites=true&w=majority`)
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
  if(!date){
    date = new Date();
  }

  const dateM = new Date(date).toDateString();

  var did = mongoose.Types.ObjectId(_id);
  let exercise =  new Exercise(
    {
    'user' : (did),    
    'description' : description,
    'duration' : parseInt(duration),
    'date' : dateM
  })
  exercise.save((err,data)=>{
    if(err) console.log(err);
    
   let user =  User.findById(_id, (err, docs)=>{
     res.json({'username': docs.username,
      'description': data.description,
      'duration' : data.duration,
      'date' : data.date.toDateString(),
      '_id': _id
    })
  }) 
   
  }); 
})

  app.get('/api/users/:_id/logs', async (req,res)=>{
    let { from, to, limit } = req.query
    const  _id = req.params._id;
    let total = null;

    from = from !== undefined ? new Date(from) : null
    to = to !== undefined ? new Date(to) : null

    User.findById(mongoose.Types.ObjectId(_id),(err,userdata)=>{

      if(err) return res.json({'Error': err});
      if(userdata)  {

      //let q = Exercise.find({'user': mongoose.Types.ObjectId(_id),date:{ "$lte": to},date:{ "$gte": from}}).limit(limit)

      let q = Exercise.find({'user': mongoose.Types.ObjectId(_id)})
      q.exec((err,exedata) =>{
          if(err) return res.json({'error':'Error Occured'})

          let e = [];
          let  m =  null;
          if(to && from){
           m = exedata.filter(function(e)  {
            if(e.date >= from && e.date <= to)
            return e}).slice(0, limit|| exedata.length)
          }else if(from){
            m = exedata.filter(function(e)  {
              if(e.date >= from)
              return e}).slice(0, limit|| exedata.length)
          }
          else{
             m = exedata.slice(0, limit|| exedata.length)
          }

          m.forEach((item)=>{
            const exL ={
              'description': item.description,
              'duration':item.duration,
              'date':item.date.toDateString()
            }
            e.push(exL)
          })

          const u = {
            _id: _id,
            username: userdata.username,
            count:e.length,
            log: e
          };
          res.json(u)
        })
      }
    })
  })


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
