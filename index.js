//set up

var fs = require('fs');
var options = {
  key: fs.readFileSync('test-key.pem'),
  cert: fs.readFileSync('test-cert.pem')
};

var express = require('express')
var app = express();
var http = require('http').Server(app);
var https = require('https').Server(options, app);

//hack to check if we're on Heroku
var httpV = (process.env.PORT ? http : https)

var io = require('socket.io')(httpV);

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
  console.log('query: ');
  console.log(request.query);
  response.redirect('/');
});


//facebook api stuff
var actualHttps = require('https');
var fbGet = function(apiPath, callback) {
    console.log(apiPath);
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: apiPath,
        method: 'GET'
    };
    var buffer = '';
    var request = actualHttps.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });
        result.on('end', function(){
            callback(buffer);
        });
    });
    request.on('error', function(e){
        console.log('error from facebook.get(): '
                     + e.message);
    });
    request.end();
}

var users = [];

io.on('connection', function(socket){
  var user = "someone" + Math.random().toString().substring(2,5);
  console.log('new user ' + user + ' connected');
  users.push(user);
  io.emit('user list', users);
  socket.on('disconnect', function(){
    console.log(user + ' disconnected');
    var index = users.indexOf(user);
    users.splice(index, 1);
    io.emit('user list', users);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', user + ": " + msg);
  });  
  socket.on('fb token', function(token) {
    console.log("Recieved a fb token: " + token);
    console.log("Now I can make an API call");

    //fixme: http://stackoverflow.com/questions/20180836/the-access-token-does-not-belong-to-application-trying-to-generate-long-lived
    var fbAppId = "";
    var fbAppSecret = "";
    var apiPath = "/oauth/access_token?grant_type=fb_exchange_token&"
    + "client_id=" + fbAppId + "&client_secret=" + fbAppSecret
    + "&fb_exchange_token=" + token;
    fbGet(apiPath, function(data){
        console.log(data);
    });
  });
});

//listen for connections on port 3000
//http.listen(process.env.PORT || 3000);
httpV.listen(process.env.PORT || 3000);
console.log("I am listening...");


// facebook login //

//<a href="/auth/facebook">Login with Facebook</a>
/*
var passport = require('passport')
app.use(passport.initialize());
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: 'FIXME',
    clientSecret: 'FIXME',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("Logged in!");
    console.log(profile);
    var user = {name: "fakeuser"};
    done(null, user);
    //User.findOrCreate(..., function(err, user) {
    //  if (err) { return done(err); }
    //  done(null, user);
    //});
  }
));

app.get('/auth/facebook', 
  passport.authenticate('facebook', { scope: ['public_profile']}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
*/
/*
//mongo test stuff:
//mongo example: https://github.com/mongolab/mongodb-driver-examples/blob/master/nodejs/nodeSimpleExample.js
var mongodb = require('mongodb');

//from mongolab
var uri = 'mongodb://testuser:PASSWORD@ds054288.mongolab.com:54288/girlcode';

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;

  var usersCollection = db.collection('users');

  usersCollection.find(function (err, cursor) {
    console.log("List all users");
    cursor.each(function (err, item) {
      console.log(item);
    });
  });

  //insert new user
  var newUser = {}
  newUser.name = "Matthew";
  newUser.likes = "42";
  usersCollection.insert(newUser);
  if(err) throw err;

  //insert new user and get their _id
  var newUser2 = {name: "Test"};
  usersCollection.insert(newUser2, function (err, result) {
    console.log("insert results:");
    console.log(result);
    console.log("We can save this ID: " + result.insertedIds[0]);
  });

});*/