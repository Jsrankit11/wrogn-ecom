// ==============================================================================
// 🗄️ DATABASE CONNECTION HELPER (MongoDB + In-Memory Fallback)
// ==============================================================================
// Yeh file MongoDB database se connection establish karti hai.
// Agar local MongoDB server offline hai toh yeh automatically ek persistent
// in-memory MongoDB server start kar leti hai taaki app bina kisi rukawat ke chale!
// ==============================================================================

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

let mongoServer = null;

const connectDB = async () => {
    try {
        // Offline hone par requests ko infinite wait karne se bachata hai
        mongoose.set('bufferCommands', false);
        
        console.log('Connecting to default MongoDB URI (port 27017)...');
        // Pehle default MongoDB URI (.env se) connect karne ki koshish karte hain
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wrogn', {
            serverSelectionTimeoutMS: 2000
        });
        console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ Default MongoDB connection failed: ${error.message}`);
        
        // Agar port 27017 nahi mila, toh fallback port 27018 check karte hain
        try {
            console.log('Attempting connection to fallback MongoDB port (27018)...');
            const conn = await mongoose.connect('mongodb://localhost:27018/wrogn', {
                serverSelectionTimeoutMS: 1500
            });
            console.log(`✅ MongoDB Fallback Connected: ${conn.connection.host}`);
            return;
        } catch (portErr) {
            console.log('No existing fallback server found on port 27018.');
        }

        // Windows par agar koi purana mongod process lock file pakde hue ho toh clean karte hain
        if (process.platform === 'win32') {
            try {
                console.log('Cleaning up any orphaned MongoDB processes...');
                execSync('taskkill /f /im mongod.exe', { stdio: 'ignore' });
            } catch (e) {
                // Ignore agar process nahi mila
            }
        }
        
        // Vercel serverless environment mein in-memory server skip karte hain
        if (process.env.VERCEL) {
            console.warn('Running on Vercel: In-memory MongoDB skipped.');
            return;
        }

        // Local testing ke liye persistent In-Memory MongoDB Server start karte hain
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
            console.log(`✅ Persistent MongoDB started at dbPath: ${dbPath}`);
            console.log(`📡 MongoDB Server URI: ${uri}`);

            const conn = await mongoose.connect(uri);
            console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
        } catch (innerError) {
            console.error(`❌ Failed to start persistent MongoDB server: ${innerError.message}`);
            console.log('Database features are offline. Using frontend local storage fallback.');
        }
    }
};

// Server band hone par in-memory server ko gracefully stop karne ke liye
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

// Node process terminate events handle karte hain
process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
});

module.exports = connectDB;
