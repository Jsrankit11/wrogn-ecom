document.addEventListener('DOMContentLoaded', () => {
    // --- Global Theme & Selectors ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const moonIcon = themeToggleBtn?.querySelector('.theme-icon-moon');
    const sunIcon = themeToggleBtn?.querySelector('.theme-icon-sun');
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const navbarBottomWrapper = document.querySelector('.navbar-bottom-wrapper');
    
    const categoriesDropdownLink = document.getElementById('categoriesDropdownLink');
    const categoriesDropdownMenu = document.querySelector('.dropdown-menu');
    
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const micBtn = document.getElementById('micBtn');
    
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const profileBtn = document.querySelector('.profile-btn');
    const toast = document.getElementById('toast');

    // --- Database Initialization (localStorage) ---
    const defaultProducts = [
        {
            id: 1,
            title: "Wrogn Hooded Windcheater Jacket",
            category: "Topwear",
            price: 2499,
            oldPrice: 3999,
            rating: 4.6,
            ratingCount: 220,
            description: "High-performance windcheater with an adjustable hood, water-resistant outer shell, and warm inner fleece lining. Perfect for winter streetwear styling.",
            image: "Images/jacket-1.jpg",
            images: ["Images/jacket-1.jpg", "Images/jacket-2.jpg", "Images/jacket-3.jpg"],
            badge: "Best Seller"
        },
        {
            id: 2,
            title: "Wrogn Distressed Slim Fit Jeans",
            category: "Bottomwear",
            price: 1999,
            oldPrice: 3499,
            rating: 4.4,
            ratingCount: 185,
            description: "Premium washed cotton denim with engineered rip details, regular-rise waist, and a tapered slim fit to show off your rebel edge.",
            image: "Images/sports-1.jpg",
            images: ["Images/sports-1.jpg", "Images/sports-2.jpg", "Images/sports-3.jpg"],
            badge: "Trending"
        },
        {
            id: 3,
            title: "Wrogn Chronograph Men Watch",
            category: "Accessories",
            price: 4999,
            oldPrice: 7999,
            rating: 4.8,
            ratingCount: 95,
            description: "Elegant quartz chronograph watch featuring a matte-black stainless steel case, luxury genuine leather strap, and 50m water resistance.",
            image: "Images/watch-1.jpg",
            images: ["Images/watch-1.jpg", "Images/watch-2.jpg", "Images/watch-3.jpg"],
            badge: "Premium"
        },
        {
            id: 4,
            title: "Wrogn Activewear Sports Tee",
            category: "Topwear",
            price: 999,
            oldPrice: 1499,
            rating: 4.2,
            ratingCount: 310,
            description: "Dry-fit moisture-wicking technology keeps you cool and dry during workouts. Ergonomic seams ensure maximum flexibility.",
            image: "Images/shirt-1.jpg",
            images: ["Images/shirt-1.jpg", "Images/shirt-2.jpg", "Images/sports-4.jpg"],
            badge: "Sale"
        },
        {
            id: 5,
            title: "Wrogn High-Top White Sneakers",
            category: "Accessories",
            price: 3299,
            oldPrice: 4999,
            rating: 4.5,
            ratingCount: 142,
            description: "Crisp white faux-leather upper with retro panels, padded high-top ankle collar, and vulcanized rubber sole for vintage appeal.",
            image: "Images/shoe-1.jpg",
            images: ["Images/shoe-1.jpg", "Images/shoe-2.jpg", "Images/shoe-3.jpg"],
            badge: "New"
        },
        {
            id: 6,
            title: "Wrogn Casual Checked Shirts",
            category: "Topwear",
            price: 1599,
            oldPrice: 2499,
            rating: 4.3,
            ratingCount: 78,
            description: "Pure cotton lightweight flannel shirt in a striking black and red windowpane check pattern. Perfect for layering over graphic tees.",
            image: "Images/shirt-2.jpg",
            images: ["Images/shirt-2.jpg", "Images/jacket-4.jpg", "Images/jacket-5.jpg"],
            badge: ""
        },
        {
            id: 7,
            title: "Wrogn Casual Cargo Shorts",
            category: "Bottomwear",
            price: 1299,
            oldPrice: 1999,
            rating: 4.1,
            ratingCount: 65,
            description: "Multi-pocket cotton twill cargo shorts featuring a relaxed fit, secure button closures, and utility belt loops. Ideal for summer travels.",
            image: "Images/sports-2.jpg",
            images: ["Images/sports-2.jpg", "Images/sports-3.jpg", "Images/sports-4.jpg"],
            badge: ""
        },
        {
            id: 8,
            title: "Wrogn Classic Leather Belt",
            category: "Accessories",
            price: 899,
            oldPrice: 1599,
            rating: 4.7,
            ratingCount: 204,
            description: "Full-grain genuine oil-pulled leather belt with a brushed gunmetal single-prong buckle. Refined and durable.",
            image: "Images/belt.jpg",
            images: ["Images/belt.jpg", "Images/watch-3.jpg", "Images/watch-4.jpg"],
            badge: ""
        }
    ];

    if (!localStorage.getItem('wrogn_products')) {
        localStorage.setItem('wrogn_products', JSON.stringify(defaultProducts));
    }

    // --- State Accessors ---
    function getProducts() {
        return JSON.parse(localStorage.getItem('wrogn_products')) || defaultProducts;
    }
    function getCart() {
        return JSON.parse(localStorage.getItem('wrogn_cart')) || [];
    }
    function saveCart(cart) {
        localStorage.setItem('wrogn_cart', JSON.stringify(cart));
        updateHeaderCounters();
    }
    function getWishlist() {
        return JSON.parse(localStorage.getItem('wrogn_wishlist')) || [];
    }
    function saveWishlist(wishlist) {
        localStorage.setItem('wrogn_wishlist', JSON.stringify(wishlist));
        updateHeaderCounters();
    }
    function getActiveUser() {
        return JSON.parse(localStorage.getItem('wrogn_active_user')) || null;
    }
    function getOrders() {
        return JSON.parse(localStorage.getItem('wrogn_orders')) || [];
    }
    function saveOrders(orders) {
        localStorage.setItem('wrogn_orders', JSON.stringify(orders));
    }

    // --- Toast Notification Helper ---
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        
        if (window.toastTimer) {
            clearTimeout(window.toastTimer);
        }
        
        window.toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- Global Theme & Navigation ---
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    themeToggleBtn?.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
        showToast(`Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode`);
    });

    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            moonIcon?.classList.remove('hidden');
            sunIcon?.classList.add('hidden');
        } else {
            moonIcon?.classList.add('hidden');
            sunIcon?.classList.remove('hidden');
        }
    }

    // Map Header navigation icons to the correct pages
    if (wishlistBtn) wishlistBtn.href = "wishlist.html";
    if (cartBtn) cartBtn.href = "cart.html";
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (getActiveUser()) {
                window.location.href = "profile.html";
            } else {
                window.location.href = "login.html";
            }
        });
    }

    // --- Mobile Drawer Navigation (Open/Close) ---
    mobileMenuBtn?.addEventListener('click', () => {
        const isOpen = navbarBottomWrapper.classList.contains('open');
        if (isOpen) {
            navbarBottomWrapper.classList.remove('open');
            mobileMenuBtn.classList.remove('open');
        } else {
            navbarBottomWrapper.classList.add('open');
            mobileMenuBtn.classList.add('open');
        }
    });

    mobileCloseBtn?.addEventListener('click', () => {
        navbarBottomWrapper.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && navbarBottomWrapper) {
            if (navbarBottomWrapper.classList.contains('open') && 
                !navbarBottomWrapper.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                navbarBottomWrapper.classList.remove('open');
                mobileMenuBtn.classList.remove('open');
            }
        }
    });

    categoriesDropdownLink?.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            categoriesDropdownMenu?.classList.toggle('open');
            
            const caret = categoriesDropdownLink.querySelector('.dropdown-caret');
            if (caret) {
                if (categoriesDropdownMenu?.classList.contains('open')) {
                    caret.style.transform = 'rotate(180deg)';
                } else {
                    caret.style.transform = 'rotate(0deg)';
                }
            }
        }
    });

    // --- Header Counter Updater ---
    function updateHeaderCounters() {
        if (cartBadge) {
            const cart = getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            
            // Micro-animation
            cartBadge.style.transform = 'scale(1.25)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 300);
        }
    }
    updateHeaderCounters();

    // --- Search Logic ---
    searchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        } else {
            showToast('Please type a search query first.');
        }
    });

    micBtn?.addEventListener('click', () => {
        showToast('Listening for voice search... Speak now!');
        micBtn.style.transform = 'scale(1.2)';
        micBtn.style.backgroundColor = 'rgba(162, 155, 254, 0.25)';
        
        setTimeout(() => {
            micBtn.style.transform = '';
            micBtn.style.backgroundColor = '';
            showToast('Voice matched: "Windcheater Jacket"');
            window.location.href = `shop.html?search=Jacket`;
        }, 2200);
    });

    // --- Dynamic Add to Cart / Wishlist Actions ---
    window.handleAddToCart = function(productId, size = 'M', quantity = 1) {
        const products = getProducts();
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) return;

        let cart = getCart();
        const existingItem = cart.find(item => item.product.id === product.id && item.size === size);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ product, quantity, size });
        }
        
        saveCart(cart);
        showToast(`Added ${product.title} (${size}) to Cart!`);
    };

    window.handleToggleWishlist = function(productId, btnElement) {
        let wishlist = getWishlist();
        const id = parseInt(productId);
        const index = wishlist.indexOf(id);
        const products = getProducts();
        const product = products.find(p => p.id === id);
        
        if (index > -1) {
            wishlist.splice(index, 1);
            saveWishlist(wishlist);
            btnElement?.classList.remove('active');
            showToast(`Removed from Wishlist`);
        } else {
            wishlist.push(id);
            saveWishlist(wishlist);
            btnElement?.classList.add('active');
            showToast(`Added ${product?.title || "Item"} to Wishlist!`);
        }
    };

    // Helper to generate a generic product card HTML
    function createProductCardHTML(product) {
        const wishlist = getWishlist();
        const isWishlisted = wishlist.includes(product.id) ? 'active' : '';
        const badgeHTML = product.badge ? `<span class="card-badge">${product.badge}</span>` : '';
        
        return `
            <div class="product-card" data-id="${product.id}">
                ${badgeHTML}
                <button class="card-wishlist-btn ${isWishlisted}" onclick="handleToggleWishlist(${product.id}, this)" aria-label="Toggle wishlist">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <div class="product-image-container">
                    <a href="product-details.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                    </a>
                </div>
                <div class="product-info">
                    <div>
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.title}</a></h3>
                    </div>
                    <div class="product-meta">
                        <div class="product-price-wrapper">
                            <span class="product-price">₹${product.price}</span>
                            <span class="product-old-price">₹${product.oldPrice}</span>
                        </div>
                        <button class="card-add-btn" onclick="handleAddToCart(${product.id})" aria-label="Add to cart">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // Page-Specific Scripts
    // ==========================================================================

    // --- 1. Home Page (index.html) ---
    const homeProductsGrid = document.querySelector('.hero').nextElementSibling; // Just a placeholder check
    if (document.title.includes("Navbar") || document.getElementById('homepage-marker')) {
        // If there's an anchor or container for products, we can render some
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !document.getElementById('homepage-marker')) {
            // Append a featured collection section below hero
            const featuredSection = document.createElement('section');
            featuredSection.className = 'container';
            featuredSection.id = 'homepage-marker';
            featuredSection.innerHTML = `
                <div class="page-header" style="border-bottom: none; margin-bottom: 20px;">
                    <h2>Best Sellers</h2>
                    <p>Wrogn's most popular styles selected just for you</p>
                </div>
                <div class="product-grid" id="home-featured-grid"></div>
            `;
            mainContent.appendChild(featuredSection);
            
            const grid = document.getElementById('home-featured-grid');
            if (grid) {
                const products = getProducts().slice(0, 4); // Show top 4
                grid.innerHTML = products.map(p => createProductCardHTML(p)).join('');
            }
        }
    }

    // --- 2. Shop Page (shop.html) ---
    const shopGrid = document.getElementById('shop-products-grid');
    if (shopGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        let selectedCategory = urlParams.get('category') || 'All';
        let searchQuery = urlParams.get('search') || '';
        let currentSort = 'popular';
        let maxPrice = 8000;

        const sidebarLinks = document.querySelectorAll('.filter-list a');
        const priceSlider = document.getElementById('priceRange');
        const priceDisplay = document.getElementById('priceDisplay');
        const sortSelect = document.getElementById('shopSort');
        const resultsCountText = document.getElementById('results-count');

        // Initial setup for search input in sidebar if needed
        if (searchQuery) {
            showToast(`Filtering by search: "${searchQuery}"`);
        }

        // Sidebar category listeners
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                selectedCategory = link.dataset.category;
                renderShop();
            });
        });

        // Price Slider
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                maxPrice = parseInt(e.target.value);
                if (priceDisplay) priceDisplay.textContent = `₹${maxPrice}`;
                renderShop();
            });
        }

        // Sorting
        sortSelect?.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderShop();
        });

        function renderShop() {
            let products = getProducts();

            // 1. Filter by category
            if (selectedCategory && selectedCategory !== 'All') {
                products = products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
            }

            // 2. Filter by search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                products = products.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
            }

            // 3. Filter by price
            products = products.filter(p => p.price <= maxPrice);

            // 4. Sort
            if (currentSort === 'low-high') {
                products.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'high-low') {
                products.sort((a, b) => b.price - a.price);
            } else if (currentSort === 'rating') {
                products.sort((a, b) => b.rating - a.rating);
            }

            // Render
            if (products.length === 0) {
                shopGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                        <h3>No products match your filters.</h3>
                        <p>Try adjusting your selectors or clearing your search.</p>
                    </div>
                `;
            } else {
                shopGrid.innerHTML = products.map(p => createProductCardHTML(p)).join('');
            }

            if (resultsCountText) {
                resultsCountText.textContent = `Showing ${products.length} products`;
            }
        }

        // Initialize shop
        renderShop();
    }

    // --- 3. Product Details Page (product-details.html) ---
    const detailsContainer = document.getElementById('details-container');
    if (detailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1;
        const products = getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            detailsContainer.innerHTML = `
                <div class="empty-state">
                    <h2>Product Not Found</h2>
                    <p>The product you are looking for does not exist or has been removed.</p>
                    <a href="shop.html" class="btn btn-primary">Go to Shop</a>
                </div>
            `;
        } else {
            // Render Details
            let selectedSize = 'M';
            const wishlist = getWishlist();
            const isWishlisted = wishlist.includes(product.id) ? 'active' : '';

            detailsContainer.innerHTML = `
                <div class="details-layout">
                    <!-- Gallery -->
                    <div class="gallery-container">
                        <div class="main-image-view">
                            <img src="${product.image}" id="mainProductImg" alt="${product.title}">
                        </div>
                        <div class="thumbnail-strip">
                            ${product.images.map((img, i) => `
                                <img src="${img}" class="thumbnail ${i === 0 ? 'active' : ''}" onclick="switchDetailImage('${img}', this)" alt="Thumbnail ${i+1}">
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Content Details -->
                    <div class="details-content">
                        <span class="product-category" style="font-size: 13px;">${product.category}</span>
                        <h2>${product.title}</h2>
                        
                        <div class="rating-stars">
                            <span>★ ★ ★ ★ ☆</span>
                            <span class="rating-count">(${product.ratingCount} Customer Reviews)</span>
                        </div>
                        
                        <div class="details-price-wrapper">
                            <span class="details-price">₹${product.price}</span>
                            <span class="details-old-price">₹${product.oldPrice}</span>
                        </div>
                        
                        <p class="details-description">${product.description}</p>
                        
                        <!-- Size Selector -->
                        <div class="size-selector">
                            <h4>Select Size</h4>
                            <div class="sizes-grid">
                                <button class="size-btn" onclick="selectDetailSize('S', this)">S</button>
                                <button class="size-btn active" onclick="selectDetailSize('M', this)">M</button>
                                <button class="size-btn" onclick="selectDetailSize('L', this)">L</button>
                                <button class="size-btn" onclick="selectDetailSize('XL', this)">XL</button>
                            </div>
                        </div>
                        
                        <!-- Actions -->
                        <div class="action-buttons-row">
                            <button class="btn btn-primary" onclick="triggerDetailAddToCart(${product.id})">Add To Cart</button>
                            <button class="details-wish-btn ${isWishlisted}" onclick="triggerDetailWishlist(${product.id}, this)">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Global handlers bound to window so onclick inline binds can access them
            window.switchDetailImage = function(src, element) {
                document.getElementById('mainProductImg').src = src;
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                element.classList.add('active');
            };

            window.selectDetailSize = function(size, element) {
                selectedSize = size;
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                element.classList.add('active');
            };

            window.triggerDetailAddToCart = function(id) {
                window.handleAddToCart(id, selectedSize, 1);
            };

            window.triggerDetailWishlist = function(id, element) {
                window.handleToggleWishlist(id, element);
            };
        }
    }

    // --- 4. Cart Page (cart.html) ---
    const cartContainer = document.getElementById('cart-page-container');
    if (cartContainer) {
        function renderCartPage() {
            const cart = getCart();
            if (cart.length === 0) {
                cartContainer.innerHTML = `
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                    </div>
                `;
            } else {
                let subtotal = 0;
                const itemsHTML = cart.map((item, index) => {
                    const totalLine = item.product.price * item.quantity;
                    subtotal += totalLine;
                    return `
                        <tr>
                            <td>
                                <div class="cart-item">
                                    <img src="${item.product.image}" alt="${item.product.title}">
                                    <div class="cart-item-details">
                                        <h4>${item.product.title}</h4>
                                        <p>Size: ${item.size} | Category: ${item.product.category}</p>
                                    </div>
                                </div>
                            </td>
                            <td>₹${item.product.price}</td>
                            <td>
                                <div class="quantity-control">
                                    <button onclick="changeCartQty(${index}, -1)">-</button>
                                    <input type="text" value="${item.quantity}" readonly>
                                    <button onclick="changeCartQty(${index}, 1)">+</button>
                                </div>
                            </td>
                            <td>₹${totalLine}</td>
                            <td>
                                <button class="remove-item-btn" onclick="removeCartItem(${index})" aria-label="Remove item">
                                    &times;
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');

                const shipping = subtotal > 3000 ? 0 : 150;
                const discount = localStorage.getItem('wrogn_promo') ? Math.round(subtotal * 0.15) : 0; // 15% off
                const total = subtotal + shipping - discount;

                cartContainer.innerHTML = `
                    <div class="cart-layout">
                        <!-- Table Column -->
                        <div class="cart-items-container">
                            <table class="cart-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHTML}
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Summary Column -->
                        <div class="cart-summary">
                            <h3>Order Summary</h3>
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <strong>₹${subtotal}</strong>
                            </div>
                            <div class="summary-row">
                                <span>Shipping</span>
                                <strong>${shipping === 0 ? "FREE" : "₹" + shipping}</strong>
                            </div>
                            ${discount > 0 ? `
                            <div class="summary-row" style="color: #2ecc71;">
                                <span>Promo Discount (15%)</span>
                                <strong>-₹${discount}</strong>
                            </div>
                            ` : ''}
                            <div class="summary-row total">
                                <span>Total Price</span>
                                <strong>₹${total}</strong>
                            </div>
                            
                            <!-- Promo Input -->
                            <div class="promo-form">
                                <input type="text" placeholder="Promo Code" class="form-control" id="promoCode" value="${localStorage.getItem('wrogn_promo') || ''}">
                                <button class="btn btn-secondary" onclick="applyPromo()">Apply</button>
                            </div>
                            
                            <a href="checkout.html" class="btn btn-primary btn-full">Proceed to Checkout</a>
                        </div>
                    </div>
                `;
            }
        }

        window.changeCartQty = function(index, change) {
            let cart = getCart();
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            saveCart(cart);
            renderCartPage();
        };

        window.removeCartItem = function(index) {
            let cart = getCart();
            cart.splice(index, 1);
            saveCart(cart);
            renderCartPage();
            showToast("Item removed from Cart");
        };

        window.applyPromo = function() {
            const code = document.getElementById('promoCode').value.trim().toUpperCase();
            if (code === 'WROGN15') {
                localStorage.setItem('wrogn_promo', 'true');
                showToast("Promo applied successfully! 15% discount.");
                renderCartPage();
            } else {
                localStorage.removeItem('wrogn_promo');
                showToast("Invalid code. Use 'WROGN15' for 15% off.");
                renderCartPage();
            }
        };

        renderCartPage();
    }

    // --- 5. Wishlist Page (wishlist.html) ---
    const wishlistGrid = document.getElementById('wishlist-grid');
    if (wishlistGrid) {
        function renderWishlist() {
            const wishlist = getWishlist();
            const products = getProducts();
            const wishlistProducts = products.filter(p => wishlist.includes(p.id));

            if (wishlistProducts.length === 0) {
                wishlistGrid.parentElement.innerHTML = `
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <h2>Your Wishlist is Empty</h2>
                        <p>Create a stash of your favorite items for later.</p>
                        <a href="shop.html" class="btn btn-primary">Start Saving Styles</a>
                    </div>
                `;
            } else {
                wishlistGrid.innerHTML = wishlistProducts.map(p => `
                    <div class="product-card">
                        <button class="card-wishlist-btn active" onclick="wishlistRemove(${p.id})" aria-label="Remove from wishlist">
                            &times;
                        </button>
                        <div class="product-image-container">
                            <a href="product-details.html?id=${p.id}">
                                <img src="${p.image}" alt="${p.title}">
                            </a>
                        </div>
                        <div class="product-info">
                            <div>
                                <div class="product-category">${p.category}</div>
                                <h3 class="product-title"><a href="product-details.html?id=${p.id}">${p.title}</a></h3>
                            </div>
                            <div class="product-meta">
                                <div class="product-price-wrapper">
                                    <span class="product-price">₹${p.price}</span>
                                </div>
                                <button class="btn btn-primary" onclick="wishlistMoveToCart(${p.id})" style="padding: 8px 14px; font-size: 11px;">
                                    Move to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        window.wishlistRemove = function(id) {
            let wishlist = getWishlist();
            const idx = wishlist.indexOf(id);
            if (idx > -1) {
                wishlist.splice(idx, 1);
                saveWishlist(wishlist);
                renderWishlist();
                showToast("Removed from Wishlist");
            }
        };

        window.wishlistMoveToCart = function(id) {
            window.handleAddToCart(id, 'M', 1);
            window.wishlistRemove(id);
        };

        renderWishlist();
    }

    // --- 6. Checkout Page (checkout.html) ---
    const checkoutSummary = document.getElementById('checkout-order-summary');
    if (checkoutSummary) {
        const cart = getCart();
        let subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const shipping = subtotal > 3000 ? 0 : 150;
        const discount = localStorage.getItem('wrogn_promo') ? Math.round(subtotal * 0.15) : 0;
        const total = subtotal + shipping - discount;

        // Render Checkout summary side-panel
        checkoutSummary.innerHTML = `
            <h3>Your Order</h3>
            ${cart.map(item => `
                <div class="summary-row">
                    <span>${item.product.title} (x${item.quantity})</span>
                    <strong>₹${item.product.price * item.quantity}</strong>
                </div>
            `).join('')}
            
            <div class="summary-row" style="margin-top: 15px; border-top: 1px solid var(--divider-color); padding-top: 10px;">
                <span>Subtotal</span>
                <strong>₹${subtotal}</strong>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <strong>${shipping === 0 ? "FREE" : "₹" + shipping}</strong>
            </div>
            ${discount > 0 ? `
            <div class="summary-row" style="color: #2ecc71;">
                <span>Discount</span>
                <strong>-₹${discount}</strong>
            </div>
            ` : ''}
            <div class="summary-row total">
                <span>Total</span>
                <strong>₹${total}</strong>
            </div>
        `;

        // Payment Toggle Selection
        const methods = document.querySelectorAll('.payment-method');
        methods.forEach(m => {
            m.addEventListener('click', () => {
                methods.forEach(x => x.classList.remove('active'));
                m.classList.add('active');
                const radio = m.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });

        // Checkout form submission
        const checkoutForm = document.getElementById('checkoutForm');
        checkoutForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (cart.length === 0) {
                showToast("Your cart is empty. Cannot place order.");
                return;
            }

            const activeUser = getActiveUser();
            if (!activeUser) {
                showToast("Please log in to place an order.");
                setTimeout(() => window.location.href = "login.html", 1500);
                return;
            }

            const fullName = document.getElementById('fullName').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;

            // Save order in history
            const orders = getOrders();
            const orderId = `WR-${Math.floor(100000 + Math.random() * 900000)}`;
            const newOrder = {
                orderId,
                date: new Date().toLocaleDateString(),
                customer: activeUser.name,
                total,
                status: "pending",
                items: cart.length
            };
            orders.push(newOrder);
            saveOrders(orders);

            // Clear Cart
            saveCart([]);
            localStorage.removeItem('wrogn_promo');

            showToast("Order placed successfully! Redirecting...");
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 2000);
        });
    }

    // --- 7. Login Page (login.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Basic check against local mock accounts or dynamic registration
            const registeredUsers = JSON.parse(localStorage.getItem('wrogn_users')) || [];
            
            // Standard developer default user matching global config:
            // user.email=dev@codealpha.com, user.name=CodeAlpha Developer
            let user = registeredUsers.find(u => u.email === email && u.password === password);

            if (email === 'dev@codealpha.com' && password === 'admin123') {
                user = { name: "CodeAlpha Developer", email: "dev@codealpha.com", isAdmin: true };
            }

            if (user) {
                localStorage.setItem('wrogn_active_user', JSON.stringify(user));
                showToast(`Welcome back, ${user.name}!`);
                setTimeout(() => {
                    if (user.isAdmin) {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "profile.html";
                    }
                }, 1500);
            } else {
                showToast("Invalid credentials. Try dev@codealpha.com / admin123");
            }
        });
    }

    // --- 8. Register Page (register.html) ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (password !== confirmPassword) {
                showToast("Passwords do not match.");
                return;
            }

            const registeredUsers = JSON.parse(localStorage.getItem('wrogn_users')) || [];
            if (registeredUsers.some(u => u.email === email)) {
                showToast("User with this email already exists.");
                return;
            }

            const newUser = { name, email, password, isAdmin: false };
            registeredUsers.push(newUser);
            localStorage.setItem('wrogn_users', JSON.stringify(registeredUsers));
            localStorage.setItem('wrogn_active_user', JSON.stringify(newUser));

            showToast("Account registered successfully!");
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1500);
        });
    }

    // --- 9. Profile Page (profile.html) ---
    const profileContainer = document.getElementById('profile-container');
    if (profileContainer) {
        const activeUser = getActiveUser();
        if (!activeUser) {
            window.location.href = "login.html";
        } else {
            // Setup Profile Fields
            const userNameEl = document.getElementById('profile-user-name');
            const userEmailEl = document.getElementById('profile-user-email');
            const welcomeNameEl = document.getElementById('welcome-user-name');
            
            if (userNameEl) userNameEl.textContent = activeUser.name;
            if (userEmailEl) userEmailEl.textContent = activeUser.email;
            if (welcomeNameEl) welcomeNameEl.textContent = activeUser.name;

            // Load Personal Info Form
            const formName = document.getElementById('profileName');
            const formEmail = document.getElementById('profileEmail');
            if (formName) formName.value = activeUser.name;
            if (formEmail) formEmail.value = activeUser.email;

            // Render Orders history
            const ordersList = document.getElementById('orders-list-body');
            if (ordersList) {
                const orders = getOrders().filter(o => o.customer === activeUser.name);
                if (orders.length === 0) {
                    ordersList.innerHTML = `
                        <tr>
                            <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">
                                You haven't placed any orders yet.
                            </td>
                        </tr>
                    `;
                } else {
                    ordersList.innerHTML = orders.map(o => `
                        <tr>
                            <td><strong>#${o.orderId}</strong></td>
                            <td>${o.date}</td>
                            <td>₹${o.total}</td>
                            <td><span class="status-badge ${o.status}">${o.status}</span></td>
                        </tr>
                    `).join('');
                }
            }

            // Tab Switching Navigation
            const menuBtns = document.querySelectorAll('.profile-menu-item button');
            const panes = document.querySelectorAll('.tab-pane');
            
            menuBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.dataset.tab;
                    
                    menuBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    panes.forEach(p => {
                        p.classList.remove('active');
                        if (p.id === tabId) p.classList.add('active');
                    });
                });
            });

            // Logout Action
            window.handleLogout = function() {
                localStorage.removeItem('wrogn_active_user');
                showToast("Logged out successfully");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            };
        }
    }

    // --- 10. Admin Page (admin.html) ---
    const adminContainer = document.getElementById('admin-container');
    if (adminContainer) {
        // Authenticate admin user
        const activeUser = getActiveUser();
        if (!activeUser || !activeUser.isAdmin) {
            adminContainer.innerHTML = `
                <div class="empty-state">
                    <h2>Access Denied</h2>
                    <p>Only store administrators can view this workspace dashboard.</p>
                    <a href="login.html" class="btn btn-primary">Login as Admin</a>
                </div>
            `;
        } else {
            function updateAdminStats() {
                const orders = getOrders();
                const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
                const products = getProducts();

                document.getElementById('admin-total-sales').textContent = `₹${totalSales}`;
                document.getElementById('admin-total-orders').textContent = orders.length;
                document.getElementById('admin-total-products').textContent = products.length;

                // Load Order list table
                const ordersBody = document.getElementById('admin-orders-body');
                if (ordersBody) {
                    if (orders.length === 0) {
                        ordersBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No orders logged yet.</td></tr>`;
                    } else {
                        ordersBody.innerHTML = orders.slice().reverse().map(o => `
                            <tr>
                                <td>#${o.orderId}</td>
                                <td>${o.customer}</td>
                                <td>${o.date}</td>
                                <td>₹${o.total}</td>
                                <td><span class="status-badge ${o.status}">${o.status}</span></td>
                            </tr>
                        `).join('');
                    }
                }

                // Load Product catalog table
                const productsBody = document.getElementById('admin-products-body');
                if (productsBody) {
                    productsBody.innerHTML = products.map(p => `
                        <tr>
                            <td><img src="${p.image}" style="width: 35px; height: 42px; object-fit: cover; border-radius: 4px;"></td>
                            <td><strong>${p.title}</strong></td>
                            <td>${p.category}</td>
                            <td>₹${p.price}</td>
                            <td>
                                <button class="remove-item-btn" onclick="deleteAdminProduct(${p.id})" style="padding: 4px 8px;">Delete</button>
                            </td>
                        </tr>
                    `).join('');
                }

                // Render dynamic CSS sales chart
                renderAdminChart(orders);
            }

            function renderAdminChart(orders) {
                // Compile sales by category or mock trends
                const categories = { Topwear: 1500, Bottomwear: 2000, Accessories: 1000 };
                
                // Add actual order totals to categories if we have matches
                const products = getProducts();
                orders.forEach(o => {
                    // Spread values proportionally as mock data or assign based on orders
                    categories.Topwear += Math.round(o.total * 0.4);
                    categories.Bottomwear += Math.round(o.total * 0.45);
                    categories.Accessories += Math.round(o.total * 0.15);
                });

                const maxVal = Math.max(...Object.values(categories));

                const chartContainer = document.getElementById('admin-sales-chart');
                if (chartContainer) {
                    chartContainer.innerHTML = Object.entries(categories).map(([cat, val]) => {
                        const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                        return `
                            <div class="chart-bar-row">
                                <div class="chart-label">${cat}</div>
                                <div class="chart-track">
                                    <div class="chart-fill" style="width: ${pct}%;"></div>
                                </div>
                                <div class="chart-value">₹${val}</div>
                            </div>
                        `;
                    }).join('');
                }
            }

            window.deleteAdminProduct = function(id) {
                let products = getProducts();
                products = products.filter(p => p.id !== id);
                localStorage.setItem('wrogn_products', JSON.stringify(products));
                showToast("Product deleted from inventory.");
                updateAdminStats();
            };

            // Add Product form submission
            const addProductForm = document.getElementById('adminAddProductForm');
            addProductForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('adminProdTitle').value.trim();
                const category = document.getElementById('adminProdCategory').value;
                const price = parseInt(document.getElementById('adminProdPrice').value);
                const oldPrice = parseInt(document.getElementById('adminProdOldPrice').value) || price + 500;
                const desc = document.getElementById('adminProdDesc').value.trim();

                const products = getProducts();
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

                // Pick a default image based on category
                let image = "Images/jacket-1.jpg";
                if (category === 'Bottomwear') image = "Images/sports-1.jpg";
                if (category === 'Accessories') image = "Images/watch-1.jpg";

                const newProd = {
                    id: newId,
                    title,
                    category,
                    price,
                    oldPrice,
                    rating: 4.5,
                    ratingCount: 1,
                    description: desc,
                    image,
                    images: [image, image, image],
                    badge: "New"
                };

                products.push(newProd);
                localStorage.setItem('wrogn_products', JSON.stringify(products));
                showToast("Product added successfully!");
                addProductForm.reset();
                updateAdminStats();
            });

            updateAdminStats();
        }
    }

    // --- 11. FAQ Page (faq.html) ---
    const faqAccordions = document.querySelectorAll('.accordion-header');
    if (faqAccordions.length > 0) {
        faqAccordions.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all accordion items
                document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                
                // Toggle clicked
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
});

