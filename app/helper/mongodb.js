const { MongoClient } = require('mongodb');

// MongoDB connection
const url = 'mongodb://mongo-db-service:27017';
let client;

async function connect() {
    client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }

    return client;
}

module.exports = { connect, getClient: () => client };