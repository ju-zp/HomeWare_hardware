var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  // Create an Led on pin 13
  var red = new five.Led(9);
  var green = new five.Led(10);
  var blue = new five.Led(11);
  green.on();
  blue.on();
  // Blink every half second
  red.blink(500);
});