// ==============================================================================
// 🛍️ PRODUCT CONTROLLER - Catalog & Product Management
// ==============================================================================
// Is controller mein products search karna, filter karna (category, price, size, color),
// single product details dekhna, aur Admin dwara product Add/Edit/Delete karna shamil hai.
// ==============================================================================

const Product = require('../models/Product');

// ------------------------------------------------------------------------------
// 1. 🔍 GET ALL PRODUCTS WITH FILTERS (GET /api/products)
// ------------------------------------------------------------------------------
exports.getProducts = async (req, res) => {
    try {
        const { search, category, brand, priceMin, priceMax, size, color, sort } = req.query;
        let queryObj = {};

        // Keyword Search: title, description, category ya tags mein dhoondhta hai
        if (search) {
            queryObj.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Category Filter
        if (category && category !== 'All') {
            queryObj.category = category;
        }

        // Brand Filter
        if (brand) {
            queryObj.brand = brand;
        }

        // Price Range Filter (Min aur Max price)
        if (priceMin || priceMax) {
            queryObj.price = {};
            if (priceMin) queryObj.price.$gte = Number(priceMin);
            if (priceMax) queryObj.price.$lte = Number(priceMax);
        }

        // Size Filter
        if (size) {
            queryObj.sizes = size;
        }

        // Color Filter
        if (color) {
            queryObj.$or = [
                { color: { $regex: color, $options: 'i' } },
                { colors: color }
            ];
        }

        // Sorting Logic (Price Low to High, High to Low, ya Popularity)
        let sortObj = {};
        if (sort) {
            if (sort === 'low-to-high') sortObj.price = 1;
            else if (sort === 'high-to-low') sortObj.price = -1;
            else if (sort === 'popular') sortObj.rating = -1;
        } else {
            sortObj.id = 1; // Default ID ascending
        }

        const products = await Product.find(queryObj).sort(sortObj);
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 2. 📦 GET SINGLE PRODUCT DETAILS (GET /api/products/:id)
// ------------------------------------------------------------------------------
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: Number(req.params.id) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Yeh product nahi mila' });
        }

        // Usi category ke 4 related products bhi sath bhejte hain
        const relatedProducts = await Product.find({
            category: product.category,
            id: { $ne: product.id }
        }).limit(4);

        res.json({ success: true, product, relatedProducts });
    } catch (error) {
        console.error('Get single product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 3. ➕ CREATE NEW PRODUCT (POST /api/products - Admin Only)
// ------------------------------------------------------------------------------
exports.createProduct = async (req, res) => {
    try {
        const {
            title,
            brand,
            category,
            price,
            oldPrice,
            discount,
            description,
            sizes,
            colors,
            stock,
            badge,
            tags
        } = req.body;

        let image = '/Images/jacket-1.jpg';
        let imagesList = [];

        // Agar user ne image upload ki hai
        if (req.file) {
            image = `/uploads/products/${req.file.filename}`;
            imagesList.push(image);
        }

        // Auto-increment custom product ID generate karte hain
        const maxProd = await Product.findOne().sort({ id: -1 });
        const newId = maxProd ? maxProd.id + 1 : 1;

        const newProduct = await Product.create({
            id: newId,
            title,
            brand: brand || 'Wrogn',
            category,
            price: Number(price),
            oldPrice: Number(oldPrice || price),
            discount: Number(discount || 0),
            description,
            image,
            images: imagesList.length > 0 ? imagesList : [image],
            sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',')) : ['S', 'M', 'L', 'XL'],
            colors: colors ? (Array.isArray(colors) ? colors : colors.split(',')) : ['Black'],
            stock: Number(stock || 50),
            badge: badge || '',
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [category.toLowerCase()]
        });

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 4. ✏️ UPDATE PRODUCT (PUT /api/products/:id - Admin Only)
// ------------------------------------------------------------------------------
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findOne({ id: Number(req.params.id) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product nahi mila' });
        }

        const updates = { ...req.body };

        // Numbers conversion
        if (updates.price) updates.price = Number(updates.price);
        if (updates.oldPrice) updates.oldPrice = Number(updates.oldPrice);
        if (updates.stock) updates.stock = Number(updates.stock);

        // Agar new image upload hui hai
        if (req.file) {
            updates.image = `/uploads/products/${req.file.filename}`;
            updates.images = [updates.image];
        }

        // String to array parsing for sizes & colors
        if (typeof updates.sizes === 'string') {
            updates.sizes = updates.sizes.split(',').map(s => s.trim());
        }
        if (typeof updates.colors === 'string') {
            updates.colors = updates.colors.split(',').map(c => c.trim());
        }
        if (typeof updates.tags === 'string') {
            updates.tags = updates.tags.split(',').map(t => t.trim());
        }

        product = await Product.findOneAndUpdate(
            { id: Number(req.params.id) },
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: 'Product successfully update ho gaya', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------------------------
// 5. 🗑️ DELETE PRODUCT (DELETE /api/products/:id - Admin Only)
// ------------------------------------------------------------------------------
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: Number(req.params.id) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product nahi mila' });
        }

        res.json({ success: true, message: 'Product successfully delete ho gaya' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
