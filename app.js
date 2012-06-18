
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
// Routes
var testConvo = function () {
  var convo = new conversation.Conversation({
  title: "Hello World",
  description: "Hello description",
  invitees: [1,2,3],
  items: [1,2]
  });
  var newConvo= convo.save(client);
  console.log(newConvo);
  return newConvo;
}

app.get('/', function (req, res) {
  //run the testConvo test
  result = testConvo();
  res.json(result);
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
