const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

let mongoServer = null;

const connectDB = async () => {
    try {
        // Fail fast when offline
        mongoose.set('bufferCommands', false);
        
        console.log('Connecting to default MongoDB URI (27017)...');
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wrogn', {
            serverSelectionTimeoutMS: 2000
        });
        console.log(`MongoDB Connected (27017): ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Default MongoDB Connection failed: ${error.message}`);
        
        // Try fallback port 27018
        try {
            console.log('Attempting connection to existing fallback MongoDB server (27018)...');
            const conn = await mongoose.connect('mongodb://localhost:27018/wrogn', {
                serverSelectionTimeoutMS: 1500
            });
            console.log(`MongoDB Connected (27018): ${conn.connection.host}`);
            return;
        } catch (portErr) {
            console.log('No existing fallback server found on port 27018.');
        }

        // Kill orphaned mongod to release lock files
        if (process.platform === 'win32') {
            try {
                console.log('Cleaning up any orphaned MongoDB processes...');
                execSync('taskkill /f /im mongod.exe', { stdio: 'ignore' });
            } catch (e) {
            }
        }
        
        try {
            console.log('Starting a new persistent In-Memory MongoDB Server...');
            const dbPath = path.join(__dirname, '../data/db');
            if (!fs.existsSync(dbPath)) {
                fs.mkdirSync(dbPath, { recursive: true });
            }

            mongoServer = await MongoMemoryServer.create({
                instance: {
                    dbPath: dbPath,
                    port: 27018,
                    storageEngine: 'wiredTiger'
                }
            });

            const uri = mongoServer.getUri() + 'wrogn';
            console.log(`Persistent MongoDB started at dbPath: ${dbPath}`);
            console.log(`MongoDB Server URI: ${uri}`);

            const conn = await mongoose.connect(uri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } catch (innerError) {
            console.error(`Failed to start persistent MongoDB server: ${innerError.message}`);
            console.log('Database features are offline. Using frontend local storage fallback.');
        }
    }
};


const cleanup = async () => {
    if (mongoServer) {
        try {
            await mongoServer.stop();
            console.log('Persistent In-Memory MongoDB server stopped.');
        } catch (e) {
            console.error('Error stopping in-memory server:', e);
        }
    }
};

process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
});

module.exports = connectDB;
