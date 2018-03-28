const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

// let jsonPhones = JSON.parse(require('fs').readFileSync( __dirname + '/app/phones/phones.json', 'utf8'));

let db

MongoClient.connect('mongodb://serjdev:serjdev@ds143342.mlab.com:43342/serjdb', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get('/', function(req, res) {
  db.collection('phones').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.send(result);
  })
});




app.get('/:id', function(req, res) {
  db.collection('phones').findOne({_id: req.params.id}, function(err, result){
      if (err) return console.log(err)
      res.send(result);
  });
});




app.delete('/:id', (req, res) => {
  db.collection('phones').findOneAndDelete({_id: req.params.id}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
});




app.post('/', (req, res) => {
  db.collection('phones').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.send(true);
  })
});




app.post('/upload-image', multipartMiddleware, function(req, resp) {
  fs.readFile(req.files.file.path, function (err, data) {
    let p = __dirname + "/app/img/phones/" + req.files.file.name;
    fs.writeFile(p, data, function (err) {
      if (err) {
        return console.warn(err);
      }
      console.log("The file: " + req.files.file.name + " was saved to " + p);
    });
  });
});




app.delete('/delete-all', (req, res) => {
  db.collection('phones').remove((err, removed) => {
    if (err) return res.send(500, err)
    res.send('All was removed')
  })
});




app.put('/:id', (req, res) => {
  db.collection('phones').findOneAndUpdate({_id: req.params.id}, {
    $set: {
      name: req.body.name,
      snippet: req.body.snippet,
      description: req.body.description,
      price: req.body.price,
      age: req.body.age
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
   console.log('message-server', req.body);
});