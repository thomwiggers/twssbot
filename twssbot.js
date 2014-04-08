var dazeus = require("dazeus");
var twss = require("twss");
var fs = require("fs");
var _ = require("underscore");

twss.threshold = 0.8;

twss.trainingData = {
  pos: require('./data/positive').data,
  neg: require('./data/negative').data
}

var client = dazeus.connect({path: '/tmp/dazeus.sock'}, function () {
  console.log("parting #ru, joining #Thom");
  client.join("hashru","#thom");
  
  console.log("registering event");
  client.on('PRIVMSG', function (network, user, channel, message) {
    console.log("got message: " + message);
    
    var checktwss = true;
    
    dazeus.isCommand(["}twss","isn't"], message, function () {
      var arg = _.reduce(arguments, function(mem, str) { return mem + str });
      console.log("writing " + arg + " to negfile");
      fs.appendFile("data/negative_data", arg + "\n" );
      twss.trainingData["neg"].push(arg);
      
      client.reply(network, channel, user, "Ok, I will keep this in mind");
      checktwss = false;
    });

    dazeus.isCommand(["}twss", "is"], message, function() {
      var arg = _.reduce(arguments, function(mem, str) { return mem + str});

      console.log("writing " + arg + " to positive data");
      fs.appendFile("data/positive_data", arg + "\n");
      twss.trainingData["pos"].push(arg);

      client.reply(network, channel, user, "Ok, I will keep this in mind");
      checktwss = false;
    });
    
    dazeus.isCommand("}twss", message, function() {
      if (checktwss == false) 
        return;
      else {
        client.reply(network, channel, user, "Use }twss is <sentence> to teach me that I should reply 'twss!' to a sentence, use }twss isn't <sentence> to make me not reply to it.");
        checktwss = false;
      }
    });


    if(!checktwss)
      return;

    if (twss.is(message)) {
      console.log("   -> TWSS! probability: " + twss.probability(message));
      client.reply(network, "#Thom", user, "twss!");
    } else {
      console.log("   -> nope. probability: " + twss.probability(message));
    }
  });
});
