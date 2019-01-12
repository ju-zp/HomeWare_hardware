const express = require('express')
var five = require("johnny-five");
const app = express()
const port = 3002


var board = new five.Board();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.connection.setNoDelay(true)
    next();
  });

board.on("ready", function() {
    let led = new five.Led.RGB({
        pins: {
            red: 9,
            green: 10,
            blue: 11
        },
        isAnode: true
    })
    led.off()
    // var red = new five.Led(9);
    // var green = new five.Led(10);
    // var blue = new five.Led(11);
    // green.on();
    // blue.on();
    // red.on();
    app.get('/switchOn', (req, res) => {
        led.on()
        res.send("yes")
        // console.log(res)
    });

    app.get('/switchOff', (req, res) => {
        console.log("goodbye")
        
        // console.log(res)
        led.off()
        res.send("yes")
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))