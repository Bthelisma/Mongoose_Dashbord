var express = require('express');
var app = express();
var path = require('path');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/animal');
mongoose.Promise = global.Promise;
var AnimalSchema = new mongoose.Schema({
 name: {type: String, required: [true, "Custom error message"]},
 type: {type: String, required: [true, "Custom error message"]},
 description:{type: String, required: [true, "Custom error message"]},
});

mongoose.model('Animal', AnimalSchema);
var Animal = mongoose.model('Animal');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './bower_components')));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    Animal.find({}, function(err, animal) {
      animal= animal;
 res.render("index", {data: animal});
  });
});
app.get('/animal/new', function(req, res) {
    res.render("new");
  });

app.post('/animal', function(req, res) {
  var animal = new Animal({name: req.body.name, type: req.body.type, description: req.body.description});
  animal.save(function(err) {
    if(err) {
      console.log('something went wrong');
    } else {
      console.log('successfully added a animal!');
      res.redirect('/');
    }
  });
});
app.get('/animal/:id', function(req, res) {
  Animal.find({_id: req.params.id}, function(err, animal) {
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route

      console.log('successfully retrieved animals!');
      res.render('show', {animal: animal[0]});
    }
  });
});
app.get('/animal/edit/:id', function(req, res) {
  Animal.findOne({_id: req.params.id}, function(err, animals) {
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route

      console.log('successfully retrieved animals!');
      res.render('edit', {animal: animals});
    }
  });
});
app.post('/animal/:id', function(req, res){
  Animal.update({ _id: req.params.id }, req.body, function(err, result){

    if (err) { console.log(err); }
    res.redirect('/');
    });
  });


app.post('/animal/destroy/:id', function(req, res){
  Animal.remove({ _id: req.params.id }, function(err, result){
    if (err) { console.log(err); }
    res.redirect('/');
  });
});


app.listen(8000, function() {
    console.log("listening on port 8000");
});
