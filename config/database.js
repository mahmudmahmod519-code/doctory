const mongoose = require('mongoose');
const config = require('./env-config');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

function buildMongoUri() {
    if (config.database_mongo.uri) {
        return config.database_mongo.uri;
    }

    const { host, port, user, pass, name } = config.database_mongo;
    const credentials = user
        ? `${encodeURIComponent(user)}:${encodeURIComponent(pass || '')}@`
        : '';

    return `mongodb://${credentials}${host}:${port}/${name}`;
}

mongoose.set('strictQuery', true);

function attachConnectionEvents() {
    const { connection } = mongoose;

    connection.on('connected', () => {
        console.log(`✅ MongoDB connected: ${connection.host}/${connection.name}`);
    });

    connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });

    connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
    });

    connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
    });
}

async function connectWithRetry(attempt = 1) {
    const uri = buildMongoUri();

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 10,
        });

        console.log(`✅ Data Source has been initialized successfully! (attempt ${attempt})`);
        return conn;
    } catch (error) {
        if (attempt < MAX_RETRIES) {
            console.error(
                `❌ MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`
            );
            console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);

            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            return connectWithRetry(attempt + 1);
        }

        throw new Error(
            `MongoDB connection failed after ${MAX_RETRIES} attempts: ${error.message}`
        );
    }
}

async function connectDB() {
    attachConnectionEvents();
    return connectWithRetry();
}

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.buildMongoUri = buildMongoUri;
