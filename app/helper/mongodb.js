const { MongoClient } = require('mongodb');

// MongoDB connection
const username = encodeURIComponent('seher'); // replace 'your_username' with your actual username
const password = encodeURIComponent('password'); // replace 'your_password' with your actual password
const url = `mongodb://${username}:${password}@mongo-db-service:27017`;

let client;
let db;

async function connect() {
    client = new MongoClient(url);

    try {
        await client.connect();
        db = client.db('socialMedia'); // replace 'your_database_name' with the name of your database
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }

    return client;
}

async function createCommentsCollection() {
    try {
        await db.createCollection('comments');
        console.log('Comments collection created');
    } catch (error) {
        console.error('Error creating comments collection:', error);
    }
}

module.exports = { connect, getClient: () => client, createCommentsCollection };