const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// CORS
app.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

function getRandomInt(max) {
return Math.floor(Math.random() * max);
}

app.get('/test', (req, res) => {
    
    const data = {
        "_id": "IKEA-1234567-20220113-summary",
        "_rev": "11-9d2130a1b12cb0b16f5832466f712068",
        "data": {
            "expected": getRandomInt(2000),
            "missing": getRandomInt(1000),
            "total": getRandomInt(30),
            "found": getRandomInt(10),
            "overs": getRandomInt(10),
            "extras": getRandomInt(10),
            "progress": getRandomInt(5)
        }
    }
    io.emit('chat message', data);
    res.status(200).json(data);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});