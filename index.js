const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

const { default: mongoose, Mongoose } = require('mongoose')
const { Schema,Types } = mongoose;
const {User,Exercise} = require('./user')

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


  function dateValidation(date){
    
    //regEx = /dddd-dd-dd/
    //console.log('valid:: ');
    
  }

  app.get('/api/users/:_id/logs', async (req,res)=>{
    let { from, to, limit } = req.query
    const  _id = req.params._id;
    //let errorMsg = null;
    let total = null;
    dateValidation(from)
    console.log(from,to,limit);

    if(!_id ){

     // errorMsg = 'Invalid request'
     return res.json({'Error': 'Invalid request'})

    }else if(!from || isNaN(new Date(from)) ||  (to==='' || isNaN(new Date(to)))){
      //errorMsg = 'Invalid Date'
      return res.json({'Error': 'Invalid Date'})
    } 
    
    else if(limit==="" || isNaN(limit) ) { 
      //errorMsg = 'Invalid limit'  // limit = 100
      return res.json({'Error': 'Invalid limit'})
    }
     
    // from to limit validatons
    User.findById(mongoose.Types.ObjectId(_id),(err,userdata)=>{

      if(err) return res.json({'Error': err});

      Exercise.find({'user': mongoose.Types.ObjectId(_id),date:{ "$lt": to},date:{ "$gte": from}}).count() .exec((err,data)=>{
        console.log('count:  '+data);
        total = data;
      })

      let q = Exercise.find({'user': mongoose.Types.ObjectId(_id),date:{ "$lt": to},date:{ "$gte": from}}).limit(limit)
      
      q.exec((err,exedata) =>{
          if(err) res.json({'error':'Error Occured'})
          
          let e = [];
          exedata.forEach((item)=>{            
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
           // count: exedata.length,
            count:total,
            log: e
          };          
          res.json(u)
        })
    })

  })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
