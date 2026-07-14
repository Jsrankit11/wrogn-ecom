const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { search, category, brand, priceMin, priceMax, size, color, sort } = req.query;
        let queryObj = {};

        if (search) {
            queryObj.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'All') {
            queryObj.category = category;
        }

        if (brand) {
            queryObj.brand = brand;
        }

        if (priceMin || priceMax) {
            queryObj.price = {};
            if (priceMin) queryObj.price.$gte = Number(priceMin);
            if (priceMax) queryObj.price.$lte = Number(priceMax);
        }

        if (size) {
            queryObj.sizes = size;
        }

        if (color) {
            queryObj.$or = [
                { color: { $regex: color, $options: 'i' } },
                { colors: color }
            ];
        }

        let sortObj = {};
        if (sort) {
            if (sort === 'low-to-high') sortObj.price = 1;
            else if (sort === 'high-to-low') sortObj.price = -1;
            else if (sort === 'popular') sortObj.rating = -1;
        } else {
            sortObj.id = 1;
        }

        const products = await Product.find(queryObj).sort(sortObj);
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: Number(req.params.id) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const relatedProducts = await Product.find({
            category: product.category,
            id: { $ne: product.id }
        }).limit(4);

        res.json({ success: true, product, relatedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

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

        if (req.file) {
            image = `/uploads/products/${req.file.filename}`;
            imagesList = [image, image, image];
        } else if (req.body.image) {
            image = req.body.image;
            imagesList = req.body.images || [image, image, image];
        }

        // Parse arrays if sent as JSON strings
        const parseArray = (field) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            try {
                return JSON.parse(field);
            } catch (e) {
                return field.split(',').map(s => s.trim());
            }
        };

        const newProduct = await Product.create({
            title,
            brand: brand || 'Wrogn',
            category,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : undefined,
            discount: discount ? Number(discount) : 0,
            image,
            images: imagesList,
            description,
            sizes: parseArray(sizes),
            colors: parseArray(colors),
            color: Array.isArray(colors) ? colors[0] : (colors || 'Black'),
            stock: stock ? Number(stock) : 50,
            badge: badge || 'New',
            tags: parseArray(tags)
        });

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: Number(req.params.id) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

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

        const parseArray = (field) => {
            if (!field) return undefined;
            if (Array.isArray(field)) return field;
            try {
                return JSON.parse(field);
            } catch (e) {
                return field.split(',').map(s => s.trim());
            }
        };

        product.title = title || product.title;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.price = price ? Number(price) : product.price;
        product.oldPrice = oldPrice ? Number(oldPrice) : product.oldPrice;
        product.discount = discount ? Number(discount) : product.discount;
        product.description = description || product.description;
        product.stock = stock ? Number(stock) : product.stock;
        product.badge = badge !== undefined ? badge : product.badge;

        if (sizes) product.sizes = parseArray(sizes);
        if (colors) {
            const arr = parseArray(colors);
            product.colors = arr;
            product.color = arr[0] || product.color;
        }
        if (tags) product.tags = parseArray(tags);

        if (req.file) {
            const uploadedPath = `/uploads/products/${req.file.filename}`;
            product.image = uploadedPath;
            product.images = [uploadedPath, uploadedPath, uploadedPath];
        }

        const updatedProduct = await product.save();
        res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: Number(req.params.id) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted from inventory' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
