var dazeus = require("dazeus");
var twss = require("twss");

twss.threshold = 0.8

var client = dazeus.connect({path: '/tmp/dazeus.sock'}, function () {
  console.log("parting #ru, joining #Thom");

  client.join("hashru","#ru");
  client.join("hashru","#Thom");
  
  console.log("registering event");
  client.on('PRIVMSG', function (network, user, channel, message) {
    console.log("got message: " + message);
    if (twss.is(message)) {
      console.log("   -> TWSS! probability: " + twss.probability(message));
      client.message(network, "#Thom", user +": twss");
    } else {
      console.log("   -> nope. probability: " + twss.probability(message));
    }
  });
});
