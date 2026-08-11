const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Counter = require('./models/Counter');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Order = require('./models/Order');
const Cancellation = require('./models/Cancellation');
const Contact = require('./models/Contact');

dotenv.config();

const defaultProducts = [
    {
        id: 1,
        title: "Wrogn Phone 14 Pro",
        category: "Mobiles",
        price: 79999,
        oldPrice: 89999,
        rating: 4.8,
        ratingCount: 312,
        description: "Deep Purple variant with 128GB storage, advanced camera, and dynamic island display.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop"],
        badge: "Best Seller",
        color: "Deep Purple",
        tags: ["phone", "mobiles"]
    },
    {
        id: 2,
        title: "Wrogn Galaxy S23 Ultra",
        category: "Mobiles",
        price: 114999,
        oldPrice: 124999,
        rating: 4.9,
        ratingCount: 145,
        description: "Engineered with 200MP camera sensor, built-in S-Pen, and Snapdragon 8 Gen 2 processor.",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop"],
        badge: "Hot Deal",
        color: "Phantom Black",
        tags: ["phone", "mobiles"]
    },
    {
        id: 3,
        title: "Wrogn Pixel 7 Pro",
        category: "Mobiles",
        price: 69999,
        oldPrice: 74999,
        rating: 4.7,
        ratingCount: 92,
        description: "Google Tensor G2 chip, exceptional photo capabilities, and clean Android experience.",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop"],
        badge: "Trending",
        color: "Hazel",
        tags: ["phone", "mobiles"]
    },
    {
        id: 4,
        title: "Wrogn Phone 13 Mini",
        category: "Mobiles",
        price: 49999,
        oldPrice: 59999,
        rating: 4.6,
        ratingCount: 108,
        description: "Super compact size with massive power. A15 Bionic chip and brilliant dual-camera setup.",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop"],
        badge: "Compact",
        color: "Blue",
        tags: ["phone", "mobiles"]
    },
    {
        id: 5,
        title: "Wrogn Hooded Windcheater Jacket",
        category: "Fashion",
        price: 2499,
        oldPrice: 3999,
        rating: 4.6,
        ratingCount: 220,
        description: "High-performance windcheater with adjustable hood and warm fleece lining.",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Black",
        tags: ["jacket", "fashion"]
    },
    {
        id: 6,
        title: "Wrogn Distressed Denim Jeans",
        category: "Fashion",
        price: 1999,
        oldPrice: 3499,
        rating: 4.4,
        ratingCount: 185,
        description: "Premium washed cotton denim with ripped details and tapered slim fit.",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop"],
        badge: "Trending",
        color: "Blue",
        tags: ["jeans", "fashion"]
    },
    {
        id: 7,
        title: "Wrogn Premium Cotton Polo Tee",
        category: "Fashion",
        price: 999,
        oldPrice: 1499,
        rating: 4.3,
        ratingCount: 310,
        description: "Breathable pique knit cotton polo tee. Structured collar with signature metal buttons.",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop"],
        badge: "Best Seller",
        color: "White",
        tags: ["tee", "fashion"]
    },
    {
        id: 8,
        title: "Wrogn Casual Checked Flannel Shirt",
        category: "Fashion",
        price: 1599,
        oldPrice: 2499,
        rating: 4.2,
        ratingCount: 78,
        description: "Heavyweight premium cotton flannel shirt in custom windowpane layout. Warm and classy.",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Red",
        tags: ["shirt", "fashion"]
    },
    {
        id: 9,
        title: "Wrogn Book Pro 16",
        category: "Laptops",
        price: 144999,
        oldPrice: 159999,
        rating: 4.8,
        ratingCount: 88,
        description: "Supercharged by M2 Max chip with 32GB Unified Memory and liquid retina display.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop"],
        badge: "Premium",
        color: "Grey",
        tags: ["laptop", "laptops"]
    },
    {
        id: 10,
        title: "Wrogn ZenBook OLED 14",
        category: "Laptops",
        price: 84999,
        oldPrice: 94999,
        rating: 4.6,
        ratingCount: 52,
        description: "Vibrant OLED NanoEdge touch display, Ryzen 7 processor, and ultrathin aluminum body.",
        image: "https://images.unsplash.com/photo-1496181130204-7552cc145cdb?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1496181130204-7552cc145cdb?w=500&auto=format&fit=crop"],
        badge: "Intel EVO",
        color: "Grey",
        tags: ["laptop", "laptops"]
    },
    {
        id: 11,
        title: "Wrogn Legion Pro Gaming Laptop",
        category: "Laptops",
        price: 119999,
        oldPrice: 134999,
        rating: 4.7,
        ratingCount: 65,
        description: "High frame rates with RTX 4060 graphics, 165Hz display, and dual-fan cooling tech.",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop"],
        badge: "Ray Tracing",
        color: "Blue",
        tags: ["laptop", "laptops"]
    },
    {
        id: 12,
        title: "Wrogn Surface UltraBook 13",
        category: "Laptops",
        price: 92999,
        oldPrice: 99999,
        rating: 4.5,
        ratingCount: 38,
        description: "PixelSense touch display with signature Alcantara keyboard. Slim, light, and versatile.",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop"],
        badge: "Touchscreen",
        color: "White",
        tags: ["laptop", "laptops"]
    },
    {
        id: 13,
        title: "Wrogn Chronograph Men Watch",
        category: "Watches",
        price: 4999,
        oldPrice: 7999,
        rating: 4.7,
        ratingCount: 95,
        description: "Matte-black stainless steel case with genuine leather strap.",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Black",
        tags: ["watch", "watches"]
    },
    {
        id: 14,
        title: "Wrogn Classic AMOLED Smartwatch",
        category: "Watches",
        price: 3499,
        oldPrice: 5999,
        rating: 4.5,
        ratingCount: 182,
        description: "1.43\" AMOLED display, multi-sport tracking, heart rate, and Bluetooth calling support.",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop"],
        badge: "Fitness Smart",
        color: "White",
        tags: ["watch", "watches"]
    },
    {
        id: 15,
        title: "Wrogn Luxury Gold Chronometer",
        category: "Watches",
        price: 18499,
        oldPrice: 24999,
        rating: 4.9,
        ratingCount: 42,
        description: "18k gold-plated case with oyster steel dial. A symbol of elite precision.",
        image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=500&auto=format&fit=crop"],
        badge: "Elite",
        color: "Red",
        tags: ["watch", "watches"]
    },
    {
        id: 16,
        title: "Wrogn Rebel Oversized Graphic Tee",
        category: "Fashion",
        price: 1299,
        oldPrice: 1999,
        rating: 4.7,
        ratingCount: 142,
        description: "Heavyweight 240 GSM organic cotton streetwear oversized tee with cybernetic back print.",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Black",
        tags: ["tee", "fashion"]
    },
    {
        id: 17,
        title: "Wrogn Urban Tactical Cargo Trousers",
        category: "Fashion",
        price: 2299,
        oldPrice: 3499,
        rating: 4.6,
        ratingCount: 98,
        description: "Utility street cargo pants with 6 functional pockets, adjustable ankle cuffs, and ripstop fabric.",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop"],
        badge: "Trending",
        color: "Black",
        tags: ["jeans", "fashion"]
    },
    {
        id: 18,
        title: "Wrogn Vulcanized High-Top Sneakers",
        category: "Fashion",
        price: 3499,
        oldPrice: 4999,
        rating: 4.8,
        ratingCount: 215,
        description: "Handcrafted canvas high-top kicks with thick rubber outsole and cushioned memory foam footbed.",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop"],
        badge: "LIMITED EDITION",
        color: "Red",
        tags: ["sneakers", "fashion"]
    },
    {
        id: 19,
        title: "Wrogn Pro ANC Wireless Earbuds",
        category: "Earbuds",
        price: 2999,
        oldPrice: 4999,
        rating: 4.7,
        ratingCount: 340,
        description: "35dB Active Noise Cancellation, low latency gaming mode, 32-hour playback battery life.",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop"],
        badge: "Best Seller",
        color: "Black",
        tags: ["earbuds", "audio"]
    },
    {
        id: 20,
        title: "Wrogn Studio Pro Over-Ear Headphones",
        category: "Earbuds",
        price: 5999,
        oldPrice: 8999,
        rating: 4.9,
        ratingCount: 168,
        description: "Hi-Res studio acoustics with 45mm neodymium drivers, plush memory foam ear cushions.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Black",
        tags: ["earbuds", "audio"]
    },
    {
        id: 21,
        title: "Wrogn Matrix Curved Gaming Monitor 27\"",
        category: "Gaming",
        price: 18999,
        oldPrice: 24999,
        rating: 4.8,
        ratingCount: 76,
        description: "165Hz QHD 1ms curved VA panel, HDR400 support, AMD FreeSync Premium with RGB ambient glow.",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Black",
        tags: ["gaming", "electronics"]
    },
    {
        id: 22,
        title: "Wrogn Mechanical RGB Gaming Keyboard",
        category: "Gaming",
        price: 3299,
        oldPrice: 4999,
        rating: 4.6,
        ratingCount: 120,
        description: "Hot-swappable tactile linear switches, per-key RGB backlighting, aircraft aluminum top plate.",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop"],
        badge: "Trending",
        color: "Black",
        tags: ["gaming", "accessories"]
    },
    {
        id: 23,
        title: "Wrogn Genuine Leather Weekender Duffle",
        category: "Fashion",
        price: 4499,
        oldPrice: 6999,
        rating: 4.8,
        ratingCount: 89,
        description: "Full-grain distressed leather holdall with shoe compartment and reinforced brass zippers.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Red",
        tags: ["accessories", "fashion"]
    },
    {
        id: 24,
        title: "Wrogn Polarized Matte Aviator Sunglasses",
        category: "Fashion",
        price: 1499,
        oldPrice: 2499,
        rating: 4.5,
        ratingCount: 195,
        description: "UV400 anti-glare TAC polarized lenses with ultra-lightweight titanium alloy frame.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop"],
        badge: "Best Seller",
        color: "Black",
        tags: ["accessories", "fashion"]
    },
    {
        id: 25,
        title: "Wrogn Barista Espresso Machine",
        category: "Home & Kitchen",
        price: 8999,
        oldPrice: 12999,
        rating: 4.7,
        ratingCount: 64,
        description: "15-Bar Italian pump pressure coffee maker with milk frother steam wand and digital temp control.",
        image: "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=500&auto=format&fit=crop"],
        badge: "LIMITED EDITION",
        color: "Black",
        tags: ["home & kitchen"]
    },
    {
        id: 26,
        title: "Wrogn Rapid Air Fryer 5.5L",
        category: "Home & Kitchen",
        price: 4999,
        oldPrice: 7999,
        rating: 4.6,
        ratingCount: 112,
        description: "360° thermo IQ technology, 8 preset touch screen cooking modes with non-stick detachable basket.",
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop"],
        badge: "Trending",
        color: "Black",
        tags: ["home & kitchen"]
    },
    {
        id: 27,
        title: "Wrogn Luxe Velvet Accent Lounge Chair",
        category: "Furniture",
        price: 12999,
        oldPrice: 17999,
        rating: 4.9,
        ratingCount: 38,
        description: "Ergonomic curved mid-century armchair with high-density foam padding and gold metal legs.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Blue",
        tags: ["furniture"]
    },
    {
        id: 28,
        title: "Wrogn Adjustable Dumbbell Set 20KG",
        category: "Sports",
        price: 3999,
        oldPrice: 5999,
        rating: 4.7,
        ratingCount: 154,
        description: "All-in-one solid cast iron weight plates with non-slip neoprene coated handles and connecting rod.",
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop"],
        badge: "Fitness Pro",
        color: "Black",
        tags: ["sports"]
    },
    {
        id: 29,
        title: "Wrogn Stealth Insulated Thermos 1L",
        category: "Sports",
        price: 899,
        oldPrice: 1499,
        rating: 4.8,
        ratingCount: 280,
        description: "Double-wall vacuum insulated 18/8 stainless steel flask. Keeps beverages cold 24h & hot 12h.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop"],
        badge: "Best Seller",
        color: "Black",
        tags: ["sports", "accessories"]
    },
    {
        id: 30,
        title: "Wrogn RFID Shield Leather Bifold Wallet",
        category: "Fashion",
        price: 799,
        oldPrice: 1299,
        rating: 4.6,
        ratingCount: 310,
        description: "Genuine slim leather wallet equipped with advanced RFID blocking frequency lining for card security.",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop"],
        badge: "HOT DROP",
        color: "Black",
        tags: ["accessories", "fashion"]
    }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to database for seeding...');

        await User.deleteMany({});
        await Product.deleteMany({});
        await Counter.deleteMany({});
        await Cart.deleteMany({});
        await Wishlist.deleteMany({});
        await Order.deleteMany({});
        await Cancellation.deleteMany({});
        await Contact.deleteMany({});
        console.log('Cleared existing data.');

        await Product.insertMany(defaultProducts);
        console.log(`Inserted ${defaultProducts.length} default products.`);

        // Initialize counter sequences
        await Counter.create({ _id: 'productId', seq: 15 });
        await Counter.create({ _id: 'orderId', seq: 0 });
        console.log('Configured sequences in Counter.');

        await User.create({
            fullName: "CodeAlpha Developer",
            username: "devcodealpha",
            email: "dev@codealpha.com",
            password: "admin123",
            phone: "9876543210",
            isAdmin: true,
            address: "123 Main Street",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            pincode: "560001"
        });
        console.log('Seeded default admin user: dev@codealpha.com / admin123');

        console.log('Database Seeding Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
