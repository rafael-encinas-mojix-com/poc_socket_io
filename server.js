const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
	cors: {
		origin: "http://localhost:4200, https://dev-02.vizix.cloud",
		methods: ["GET", "POST"],
		transports: ['websocket', 'polling'],
		credentials: true
	},
	allowEIO3: true
});

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('message', (message) => {
		console.log(message);
		io.emit('message', message);
	});

	socket.on('disconnect', () => {
		console.log('a user disconnected!');
	});
});

app.get('/hello', (req, res) => {
	res.status(200).json({ "greeting": "Hello World"});
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));