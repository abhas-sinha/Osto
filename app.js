
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , redis = require('redis')
  , conversation = require('./models/conversation');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var client = redis.createClient();


//utilities
//TODO(Rajiv): Refactor into a utilities.js

function AssertException(message) {
  this.message = message;
}

AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}


//Some tests
//TODO(Rajiv):Refactor into a test framework 
var testConvo = function (convo) {
  var newConvo= convo.save(client);
  console.log(newConvo);
  return newConvo;
}


// Routes
app.get('/', function (req, res) {
  //run the testConvo test
  var convo = new conversation.Conversation({
  title: "Hello World",
  description: "Hello description",
  invitees: [1,2,3],
  items: [1,2]
  });

  var result = testConvo(convo);

  //reassign to assert later
  convo = new conversation.Conversation({
  title: "Hello World",
  description: "Hello description",
  invitees: [1,2,3],
  items: [1,2]
  });

  var error = false;
  try {
    console.log("trying assert");
    console.log("result: " + JSON.stringify(result));
    console.log("convo  : " + JSON.stringify(convo));
    assert(JSON.stringify(result) == JSON.stringify(convo), "Test Conversation: Result not same as input");
  } catch(e) {
    error = true;
    console.log("caught an Exception" + e);
    if (e instanceof AssertException) {
      res.send(e);
    }
  }

  if (!error) res.json(result);
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
