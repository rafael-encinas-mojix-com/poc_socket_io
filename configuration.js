module.exports = {
	local: {
		port: 3000,
		kafka: {
			host: '104.154.200.199:9196',
			groupId: 'kafka-consumer-inbound-summary_v2',
			topicSummary: 'IKEA___poc___realtime___summary',
			topicDetails: 'IKEA___poc___realtime___detail'
		},
		apiKey: 'inventory-poc'
	},
	prod: {
		port: 3000,
		kafka: {
			host: '10.128.0.2:9089',
			groupId: 'kafka-consumer-inbound-summary2',
			topicSummary: 'IKEA___poc___realtime___summary',
			topicDetails: 'IKEA___poc___realtime___detail'
		},
		apiKey: 'inventory-poc'
	}
};