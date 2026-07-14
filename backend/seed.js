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
        badge: "Trending",
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
        badge: "",
        color: "Grey Red",
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
        color: "Space Grey",
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
        color: "Pine Grey",
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
        color: "Abyss Blue",
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
        color: "Platinum",
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
        badge: "Classy",
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
        color: "Sandstone Beige",
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
        color: "Luxury Gold",
        tags: ["watch", "watches"]
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
