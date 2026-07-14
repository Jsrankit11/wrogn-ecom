const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const viewDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();
        
        console.log('\n--- REGISTERED USERS IN DATABASE ---');
        const users = await User.find({});
        if (users.length === 0) {
            console.log('No users found in database.');
        } else {
            users.forEach(u => {
                console.log(`ID: ${u._id}`);
                console.log(`Full Name: ${u.fullName}`);
                console.log(`Username: ${u.username}`);
                console.log(`Email: ${u.email}`);
                console.log(`Password Hash: ${u.password}`);
                console.log(`Is Admin: ${u.isAdmin}`);
                console.log('-----------------------------------');
            });
        }

        console.log('\n--- PLACED ORDERS IN DATABASE ---');
        const orders = await Order.find({});
        if (orders.length === 0) {
            console.log('No orders found in database.');
        } else {
            orders.forEach(o => {
                console.log(`Order ID: ${o.orderId}`);
                console.log(`Customer Name: ${o.shippingAddress.fullName}`);
                console.log(`Date: ${o.orderDate}`);
                console.log(`Amount: ₹${o.amount}`);
                console.log(`Payment Method: ${o.paymentMethod}`);
                console.log(`Delivery Status: ${o.deliveryStatus}`);
                console.log('Items:');
                o.items.forEach(item => {
                    console.log(`  - ${item.productId} (x${item.quantity}) Size: ${item.size}`);
                });
                console.log('-----------------------------------');
            });
        }
        
        setTimeout(() => process.exit(0), 1000);
    } catch (err) {
        console.error('Error viewing database:', err);
        process.exit(1);
    }
};

viewDatabase();
