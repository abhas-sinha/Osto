/* Crud methods for the conversation model */

// Static variables 
var redisBucketSize = 1000
//Constructor
var Conversation = module.exports.Conversation = function (c) {
  //c is the json object holding the conversation
  var c = c || 0
  // Initialize all member fields even if they are not used at this moment for V8 optimization
  this.id; //initialize while saving
  this.chatId; //initialize while saving
  this.title = c.title || "Add a title";
  this.description = c.description || "Add a description";
  this.invitees = c.invitees || []
  this.items = c.items || []
}

Conversation.prototype.save = function(redis) {
  var self = this;
  //get an id for the conversation
  redis.incr('conversationId', function(err, id) {
    self.id = id;
    if (err) throw err; // do something better
    var bucketNumber = Math.floor(id / redisBucketSize);
    var hashKey = id % redisBucketSize;
    redis.incr('chatId', function (err, id) {
      if (err) throw err;
      self. chatId = id;
      console.log("bucketNumber:" +  bucketNumber);
      console.log("hashKey:" +  hashKey);
      redis.hmset("conversation:" + bucketNumber, hashKey, JSON.stringify(self));
      console.log("done setting");
    });
  });
  //assume everything is right at this point
  return self;
}
