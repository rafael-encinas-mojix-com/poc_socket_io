const app = require('express')();
const httpServer = require('http').createServer(app);
const { Kafka } = require('kafkajs');
const configuration = require('./configuration').prod;

console.log(configuration);

// Enable Cors.
const io = require('socket.io')(httpServer, {
	cors: {
		origin: true,
		methods: ["GET", "POST"],
		transports: ['websocket', 'polling'],
		credentials: true
	},
	allowEIO3: true
});

kafkaConfiguration();

io.use((socket, next) => {
	const headers = socket.handshake.headers;
	console.log("****AUTH***")
	console.log(socket.handshake.auth);
	console.log("****HEADERS***")
	console.log(headers);
	console.log(headers['x-some-special-header']);
	if (headers['x-some-special-header'] === configuration.apiKey) {
		next();
	} else {
		next(new Error("Unauthorized"));
	}
});

io.on('connection', (socket) => {
	console.log(socket.handshake.headers);
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('a user disconnected!');
	});
});

async function kafkaConfiguration() {
	const kafka = new Kafka({
		brokers: [
			configuration.kafka.host
		]
	});

	const consumer = kafka.consumer(
		{
			groupId: configuration.kafka.groupId
		}
	);

	await consumer.connect();
	await consumer.subscribe(
		{ 
			topic: configuration.kafka.topicSummary, 
			fromBeginning: false 
		}
	);

	await consumer.subscribe(
		{ 
			topic: configuration.kafka.topicDetails, 
			fromBeginning: false 
		}
	);

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log("****** START MESSAGE *****************");
			console.log(topic);
			const channel = message.key.toString();
			const value = JSON.parse(message.value.toString());
			value['timestamp'] = new Date().getTime();
			console.log(`Channel: ${channel}`);
			console.log(`Message: ${value}`);
			console.log("****** END MESSAGE *****************");
			io.emit(channel, value);
		},
	});
}

app.get('/hello', (req, res) => {
	res.status(200).json({ "greeting": "Hello World" });
});

httpServer.listen(configuration.port, () => console.log(`listening on port ${configuration.port}`));