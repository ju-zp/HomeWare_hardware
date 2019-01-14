const express = require('express')
var five = require("johnny-five");
var cors = require('cors')
var bodyParser = require('body-parser');
const app = express()
const port = 3002


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var board = new five.Board();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.connection.setNoDelay(true)
    next();
  });

app.use(cors())

board.on("ready", function() {
    let led = new five.Led.RGB({
        pins: {
            red: 9,
            green: 10,
            blue: 11
        },
        isAnode: true
    })

    let tempSensor = new five.Thermometer({
        controller: 'LM35',
        pin: 'A1',
        toCelsius: raw => {
            return (raw * 0.5)
        } 
    })

    let lcd = new five.LCD({
        pins: [13, 12, 5, 4, 3, 2]
    })

    led.off()
    lcd.cursor(0,0).print('IDLE')
    let username

    welcomeMessage = ()=>{
        lcd.clear()
        lcd.cursor(0,0).print('Hello, ' + username + '!')
    }

    app.post('/welcome', (req, res) => {
        console.log('welcome')
        username = req.body.username.charAt(0).toUpperCase() + req.body.username.slice(1)
        welcomeMessage()
        res.send('welcome')
    })
    
    app.get('/switchOn', (req, res) => {
        console.log('on')
        led.on()
        res.send("on")
    });

    app.get('/switchOff', (req, res) => {
        console.log('off')
        led.off()
        res.send('off')
    })

    app.patch('/setColor', (req, res) => {
        console.log('set')
        led.color(req.body)
        res.send('set')
    })

    app.get('/temperature', (req, res) => {
        const reading = tempSensor.celsius
        console.log('temperature')
        res.json({reading: reading})
        lcd.cursor(1,0).print('Temperature: ' + reading + 'C')
        setTimeout(() => {
            welcomeMessage()
        }, 5000)
    })

    app.get('/logout', (req, res) => {
        console.log('goodbye')
        username = ''
        lcd.clear()
        lcd.cursor(0,0).print('IDLE')
        res.send('goodbye')
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))