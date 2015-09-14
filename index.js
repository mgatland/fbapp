//set up
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');


//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var bodyParser = require('body-parser');
app.use(cookieParser())

//make an empty list of ideas
var coolIdeas = [];

var addIdea  = function (message) {
  var idea = {};
  idea.text = message;
  idea.time = new Date();
  coolIdeas.push(idea);
}

addIdea("try wearing a hat on cold days");

//let a client GET the list of ideas
app.get('/ideas', function (req, res) {
  console.log("this user looked at the posts: " + req.cookies.name);
  res.send(coolIdeas);
});

//let a client POST new ideas
app.post('/ideas', function (req, res) {
  console.log(req.body.idea); //write it on the command prompt so we can see
  addIdea(req.body.idea);
  res.send("thanks for your idea");
});

app.post('/Login', function (req, res) {
  console.log(req.body);
  var userName = req.body.username;
  res.cookie('name', userName, { maxAge: 900000, httpOnly: true });
  
  var randomNumber=Math.random().toString();
  randomNumber=randomNumber.substring(2,randomNumber.length);
  res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
  res.send("send");
  console.log(userName); //write it on the command prompt so we can see
});

//facebook requires a post, I don't know why
app.post('/*', function(request, response) {
  response.redirect('/');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });  
});

//listen for connections on port 3000
http.listen(process.env.PORT || 3000);
console.log("I am listening...");
