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
            badge: "Best Seller",
            color: "Black",
            tags: ["jacket", "outerwear"]
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
            badge: "Trending",
            color: "Blue",
            tags: ["jeans", "denim"]
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
            badge: "Premium",
            color: "Black",
            tags: ["watch", "accessories"]
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
            badge: "Sale",
            color: "Red",
            tags: ["tee", "shirt"]
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
            badge: "New",
            color: "White",
            tags: ["shoes", "sneakers"]
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
            badge: "",
            color: "Grey",
            tags: ["shirt", "checked"]
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
            badge: "",
            color: "Grey",
            tags: ["shorts", "cargo"]
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
            badge: "",
            color: "Black",
            tags: ["belt", "accessories"]
        }
    ];

    // Force database reset if color schema is missing in existing localStorage
    const existingProductsStr = localStorage.getItem('wrogn_products');
    if (!existingProductsStr || !JSON.parse(existingProductsStr)[0]?.hasOwnProperty('color')) {
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
        renderCartDrawerItems();
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
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            if (!window.location.pathname.includes('cart.html') && !window.location.pathname.includes('checkout.html')) {
                e.preventDefault();
                openCartDrawer();
            }
        });
    }
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const activeUser = getActiveUser();
            if (activeUser) {
                if (activeUser.isAdmin) {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "profile.html";
                }
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

    // ==========================================================================
    // Dynamic Global Components Injection (Cart Drawer & Support Widget)
    // ==========================================================================

    // 1. Cart Side Drawer Overlay & Panel
    const drawerOverlay = document.createElement('div');
    drawerOverlay.className = "cart-drawer-overlay";
    drawerOverlay.id = "cartDrawerOverlay";
    
    const drawer = document.createElement('div');
    drawer.className = "cart-drawer";
    drawer.id = "cartDrawer";
    drawer.innerHTML = `
        <div class="cart-drawer-header">
            <h3>Shopping Bag</h3>
            <button class="cart-drawer-close" id="cartDrawerClose">&times;</button>
        </div>
        <div class="cart-drawer-items" id="cartDrawerItems"></div>
        <div class="cart-drawer-footer">
            <div class="drawer-summary-row">
                <span>Subtotal</span>
                <strong id="drawerSubtotal">₹0</strong>
            </div>
            <div class="drawer-summary-row total">
                <span>Total Bill</span>
                <strong id="drawerTotal">₹0</strong>
            </div>
            <a href="cart.html" class="btn btn-secondary btn-full" style="margin-bottom: 10px; font-size: 13px;">View Full Cart</a>
            <a href="checkout.html" class="btn btn-primary btn-full" style="font-size: 13px;">Checkout Now</a>
        </div>
    `;
    document.body.appendChild(drawerOverlay);
    document.body.appendChild(drawer);

    function openCartDrawer() {
        renderCartDrawerItems();
        drawerOverlay.classList.add('open');
        drawer.classList.add('open');
    }
    function closeCartDrawer() {
        drawerOverlay.classList.remove('open');
        drawer.classList.remove('open');
    }

    document.getElementById('cartDrawerClose')?.addEventListener('click', closeCartDrawer);
    drawerOverlay.addEventListener('click', closeCartDrawer);

    function renderCartDrawerItems() {
        const cart = getCart();
        const itemsContainer = document.getElementById('cartDrawerItems');
        const subtotalEl = document.getElementById('drawerSubtotal');
        const totalEl = document.getElementById('drawerTotal');
        
        if (!itemsContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div style="text-align: center; margin-top: 60px; color: var(--text-muted);">
                    <p>Your bag is empty.</p>
                </div>
            `;
            subtotalEl.textContent = "₹0";
            totalEl.textContent = "₹0";
        } else {
            let subtotal = 0;
            itemsContainer.innerHTML = cart.map((item, idx) => {
                const lineCost = item.product.price * item.quantity;
                subtotal += lineCost;
                return `
                    <div class="drawer-item">
                        <img src="${item.product.image}" alt="${item.product.title}">
                        <div class="drawer-item-info">
                            <div>
                                <h4 class="drawer-item-title">${item.product.title}</h4>
                                <div class="drawer-item-meta">Size: ${item.size}</div>
                            </div>
                            <div class="drawer-item-bottom">
                                <span class="drawer-item-price">₹${lineCost}</span>
                                <div class="quantity-control" style="transform: scale(0.8); transform-origin: left center;">
                                    <button onclick="changeDrawerQty(${idx}, -1)">-</button>
                                    <input type="text" value="${item.quantity}" readonly style="width: 25px;">
                                    <button onclick="changeDrawerQty(${idx}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                        <button class="drawer-item-remove" onclick="removeDrawerItem(${idx})">&times;</button>
                    </div>
                `;
            }).join('');
            
            subtotalEl.textContent = `₹${subtotal}`;
            totalEl.textContent = `₹${subtotal}`;
        }
    }

    window.changeDrawerQty = function(idx, change) {
        let cart = getCart();
        cart[idx].quantity += change;
        if (cart[idx].quantity <= 0) {
            cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCartDrawerItems();
        if (document.getElementById('cart-page-container')) {
            renderCartPage();
        }
    };

    window.removeDrawerItem = function(idx) {
        let cart = getCart();
        cart.splice(idx, 1);
        saveCart(cart);
        renderCartDrawerItems();
        if (document.getElementById('cart-page-container')) {
            renderCartPage();
        }
        showToast("Item removed from bag");
    };

    // 2. Floating Mobile Support Chat Widget
    const supportContainer = document.createElement('div');
    supportContainer.className = "support-widget-container";
    supportContainer.innerHTML = `
        <button class="support-chat-btn" id="supportChatBtn" aria-label="Open support chat">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </button>
        <div class="support-chat-window" id="supportChatWindow">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">W</div>
                    <div class="chat-status">
                        <span class="name">Wrogn Support</span>
                        <span class="status">Online</span>
                    </div>
                </div>
                <button class="chat-close-btn" id="chatCloseBtn">&times;</button>
            </div>
            <div class="chat-body" id="chatBody">
                <div class="chat-bubble agent">Hey there! 👋 Need help with sizes, returns, or tracking? Let us know.</div>
            </div>
            <div class="chat-quick-replies">
                <button class="quick-reply-btn" data-query="track">Track Package</button>
                <button class="quick-reply-btn" data-query="return">Easy Returns</button>
                <button class="quick-reply-btn" data-query="coupon">Active Coupon</button>
                <button class="quick-reply-btn" data-query="agent">Ask Agent</button>
            </div>
            <div class="chat-footer">
                <input type="text" class="chat-input" id="chatInput" placeholder="Ask support...">
                <button class="chat-send-btn" id="chatSendBtn" aria-label="Send message">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(supportContainer);

    const supportChatBtn = document.getElementById('supportChatBtn');
    const supportChatWindow = document.getElementById('supportChatWindow');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    supportChatBtn?.addEventListener('click', () => {
        supportChatWindow.classList.toggle('open');
    });

    chatCloseBtn?.addEventListener('click', () => {
        supportChatWindow.classList.remove('open');
    });

    function appendChatMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.textContent = text;
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function triggerAgentReply(queryKey) {
        setTimeout(() => {
            let reply = "Thanks for reaching out! You can email us at support@wrogn.codealpha.com for manual tickets.";
            
            if (queryKey === 'track') {
                const orders = getOrders();
                if (orders.length > 0) {
                    const lastOrder = orders[orders.length - 1];
                    reply = `Your last order #${lastOrder.orderId} is currently status: "${lastOrder.status.toUpperCase()}". Scheduled to arrive soon!`;
                } else {
                    reply = "You don't have any placed orders yet. Add items to your cart to begin!";
                }
            } else if (queryKey === 'return') {
                reply = "We offer a 15-day return window. Pack your items, make sure tags are attached, and raise a return in your Profile portal.";
            } else if (queryKey === 'coupon') {
                reply = "Apply coupon code 'WROGN15' in your cart to claim 15% discount on checkout.";
            } else if (queryKey === 'agent') {
                reply = "All live chat agents are currently occupied. Please leave a contact query in our Contact page or call 1800 200 4567.";
            }
            
            appendChatMessage('agent', reply);
        }, 700);
    }

    chatSendBtn?.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
            appendChatMessage('user', text);
            chatInput.value = '';
            triggerAgentReply(text.toLowerCase());
        }
    });

    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            chatSendBtn.click();
        }
    });

    document.querySelectorAll('.support-widget-container .quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            appendChatMessage('user', btn.textContent);
            triggerAgentReply(query);
        });
    });

    // 3. Search Autocomplete Suggestions Dropdown
    if (searchInput && searchForm) {
        const suggestBox = document.createElement('div');
        suggestBox.className = "search-suggestions";
        suggestBox.id = "searchSuggestions";
        searchForm.appendChild(suggestBox);

        searchInput.addEventListener('input', () => {
            const val = searchInput.value.trim().toLowerCase();
            if (!val) {
                suggestBox.classList.remove('open');
                return;
            }

            const products = getProducts();
            const matches = products.filter(p => p.title.toLowerCase().includes(val) || p.category.toLowerCase().includes(val));

            if (matches.length === 0) {
                suggestBox.innerHTML = `
                    <div style="padding: 15px; color: var(--text-muted); font-size: 13px;">No suggestions found</div>
                `;
            } else {
                suggestBox.innerHTML = matches.slice(0, 5).map(p => `
                    <div class="suggestion-item" onclick="window.location.href='product-details.html?id=${p.id}'">
                        <img src="${p.image}" alt="${p.title}">
                        <div class="suggestion-details">
                            <span class="suggestion-title">${p.title}</span>
                            <span class="suggestion-meta">${p.category} | ₹${p.price}</span>
                        </div>
                    </div>
                `).join('');
            }
            suggestBox.classList.add('open');
        });

        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target)) {
                suggestBox.classList.remove('open');
            }
        });
    }

    // --- Search Submit Interaction ---
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
        openCartDrawer(); // Immediately open Cart Drawer visualizer
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
                        <div class="product-category">${product.category} | ${product.color}</div>
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
    if (document.title.includes("Navbar") || document.getElementById('homepage-marker')) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !document.getElementById('homepage-marker')) {
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
        let selectedColor = 'All';
        let jeansOnly = false;

        const sidebar = document.querySelector('.filter-sidebar');
        if (sidebar) {
            // Dynamically inject color swatch selector widget
            const colorWidget = document.createElement('div');
            colorWidget.className = "filter-widget";
            colorWidget.innerHTML = `
                <h3>Filter By Color</h3>
                <div class="color-swatch-grid">
                    <div class="color-swatch active" data-color="All" style="background: linear-gradient(135deg, #ff0000, #00ff00, #0000ff); border: 1px solid var(--divider-color);" title="All Colors"></div>
                    <div class="color-swatch" data-color="Black" style="background-color: #000000; border: 1px solid #333;" title="Black"></div>
                    <div class="color-swatch" data-color="Blue" style="background-color: #3498db;" title="Blue"></div>
                    <div class="color-swatch" data-color="White" style="background-color: #ffffff; border: 1px solid #ccc;" title="White"></div>
                    <div class="color-swatch" data-color="Red" style="background-color: #e74c3c;" title="Red"></div>
                    <div class="color-swatch" data-color="Grey" style="background-color: #95a5a6;" title="Grey"></div>
                </div>
            `;
            sidebar.appendChild(colorWidget);

            // Dynamically inject "Jeans Only" tags checkbox widget
            const tagWidget = document.createElement('div');
            tagWidget.className = "filter-widget";
            tagWidget.innerHTML = `
                <h3>Filter By Tag</h3>
                <ul class="filter-list">
                    <li>
                        <label style="display: flex; gap: 10px; align-items: center; cursor: pointer; font-size: 13.5px;">
                            <input type="checkbox" id="tagJeansCheckbox" style="width: 16px; height: 16px; accent-color: var(--accent-color);">
                            <span>Jeans / Denim Only</span>
                        </label>
                    </li>
                </ul>
            `;
            sidebar.appendChild(tagWidget);
        }

        const sidebarLinks = document.querySelectorAll('.filter-sidebar .filter-list a');
        const priceSlider = document.getElementById('priceRange');
        const priceDisplay = document.getElementById('priceDisplay');
        const sortSelect = document.getElementById('shopSort');
        const resultsCountText = document.getElementById('results-count');

        // Categories click handlers
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                selectedCategory = link.dataset.category;
                renderShop();
            });
        });

        // Price slider handler
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                maxPrice = parseInt(e.target.value);
                if (priceDisplay) priceDisplay.textContent = `₹${maxPrice}`;
                renderShop();
            });
        }

        // Sort handler
        sortSelect?.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderShop();
        });

        // Color swatches click handlers
        const swatches = document.querySelectorAll('.color-swatch');
        swatches.forEach(sw => {
            sw.addEventListener('click', () => {
                swatches.forEach(x => x.classList.remove('active'));
                sw.classList.add('active');
                selectedColor = sw.dataset.color;
                renderShop();
            });
        });

        // Tag filter checkbox handler
        const tagJeansBox = document.getElementById('tagJeansCheckbox');
        tagJeansBox?.addEventListener('change', (e) => {
            jeansOnly = e.target.checked;
            renderShop();
        });

        function renderShop() {
            let products = getProducts();

            // 1. Category Filter
            if (selectedCategory && selectedCategory !== 'All') {
                products = products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
            }

            // 2. Search query Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                products = products.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
            }

            // 3. Price Filter
            products = products.filter(p => p.price <= maxPrice);

            // 4. Color Filter
            if (selectedColor && selectedColor !== 'All') {
                products = products.filter(p => p.color.toLowerCase() === selectedColor.toLowerCase());
            }

            // 5. Tag Filter
            if (jeansOnly) {
                products = products.filter(p => p.tags.includes('jeans'));
            }

            // 6. Sorting logic
            if (currentSort === 'low-high') {
                products.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'high-low') {
                products.sort((a, b) => b.price - a.price);
            } else if (currentSort === 'rating') {
                products.sort((a, b) => b.rating - a.rating);
            }

            // Render output
            if (products.length === 0) {
                shopGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                        <h3>No products match your filters.</h3>
                        <p>Try resetting color selectors or broadening your price slider.</p>
                    </div>
                `;
            } else {
                shopGrid.innerHTML = products.map(p => createProductCardHTML(p)).join('');
            }

            if (resultsCountText) {
                resultsCountText.textContent = `Showing ${products.length} products`;
            }
        }

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
                        <span class="product-category" style="font-size: 13px;">${product.category} | ${product.color}</span>
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
                                        <p>Size: ${item.size} | Color: ${item.product.color}</p>
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
                                <strong id="cartPageSubtotal">₹${subtotal}</strong>
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
                                <strong id="cartPageTotal">₹${total}</strong>
                            </div>
                            
                            <!-- Promo Input -->
                            <div class="promo-form">
                                <input type="text" placeholder="Promo Code" class="form-control" id="promoCode" value="${localStorage.getItem('wrogn_promo') ? 'WROGN15' : ''}">
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
                                <div class="product-category">${p.category} | ${p.color}</div>
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
                setTimeout(updatePaymentSelection, 50);
            });
        });

        // UPI QR code renderer
        const upiRadio = document.getElementById('payUPI');
        function updatePaymentSelection() {
            const existingQR = document.getElementById('checkoutQR');
            existingQR?.remove();
            
            if (upiRadio?.checked) {
                const qrContainer = document.createElement('div');
                qrContainer.id = "checkoutQR";
                qrContainer.className = "qr-code-container";
                qrContainer.innerHTML = `
                    <div class="qr-code-box">
                        <div class="qr-code-pattern"></div>
                    </div>
                    <p style="margin-top: 12px; font-size: 13px; font-weight: 700; color: var(--text-color);">Scan QR to pay ₹${total}</p>
                    <p style="color: var(--text-muted); font-size: 11px; margin-top: 2px;">Accepts GooglePay, PhonePe, Paytm</p>
                `;
                upiRadio.closest('.payment-method').appendChild(qrContainer);
            }
        }
        updatePaymentSelection();

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

            // Generate receipt overlay modal
            const invoiceModal = document.createElement('div');
            invoiceModal.className = "invoice-modal-overlay";
            invoiceModal.id = "invoiceModalOverlay";
            
            const dateStr = new Date().toLocaleString();
            const itemsReceiptHTML = cart.map(item => `
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span>${item.product.title.slice(0, 20)}.. (${item.size}) x${item.quantity}</span>
                    <span>₹${item.product.price * item.quantity}</span>
                </div>
            `).join('');

            const paymentName = document.querySelector('input[name="paymentRadio"]:checked').closest('.payment-method').querySelector('.payment-method-details span').textContent;

            invoiceModal.innerHTML = `
                <div class="invoice-paper">
                    <div style="text-align: center;">
                        <h2 style="font-weight: 900; letter-spacing: 2px; margin-bottom: 5px;">WROGN</h2>
                        <p style="font-size: 11px; color: #555;">BREAK THE RULES CO.</p>
                        <p style="font-size: 10px; color: #777;">INDIRANAGAR, BANGALORE</p>
                    </div>
                    
                    <div class="invoice-dashed-line"></div>
                    
                    <div style="font-size: 11px; margin-bottom: 10px;">
                        <div><strong>INVOICE ID:</strong> ${orderId}</div>
                        <div><strong>DATE:</strong> ${dateStr}</div>
                        <div><strong>CUSTOMER:</strong> ${fullName}</div>
                        <div><strong>PHONE:</strong> ${phone}</div>
                        <div><strong>PAYMENT:</strong> ${paymentName}</div>
                    </div>
                    
                    <div class="invoice-dashed-line"></div>
                    
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-bottom: 8px;">
                            <span>ITEM DESCRIPTION</span>
                            <span>PRICE</span>
                        </div>
                        ${itemsReceiptHTML}
                    </div>
                    
                    <div class="invoice-dashed-line"></div>
                    
                    <div style="font-size: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>SUBTOTAL:</span>
                            <span>₹${subtotal}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>SHIPPING:</span>
                            <span>${shipping === 0 ? "FREE" : "₹" + shipping}</span>
                        </div>
                        ${discount > 0 ? `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #27ae60;">
                            <span>DISCOUNT (15%):</span>
                            <span>-₹${discount}</span>
                        </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 8px;">
                            <span>TOTAL PAID:</span>
                            <span>₹${total}</span>
                        </div>
                    </div>
                    
                    <div class="invoice-dashed-line"></div>
                    
                    <div style="text-align: center; font-size: 10px; margin-top: 15px; color: #555;">
                        <p>THANK YOU FOR SHOPPING WROGN!</p>
                        <p>NO RETURNS ON SALE ITEMS.</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 25px;">
                        <button class="btn btn-secondary btn-full" onclick="downloadInvoiceText('${orderId}', '${fullName}', '${total}', '${dateStr}')" style="background-color: #111; color: #fff; border-color: #111; font-size: 12.5px;">Download Invoice</button>
                        <button class="btn btn-primary btn-full" onclick="closeInvoiceRedirect()" style="color: #000; background-color: var(--accent-color); font-size: 12.5px;">Back to Profile</button>
                    </div>
                </div>
            `;
            document.body.appendChild(invoiceModal);

            window.downloadInvoiceText = function(id, name, totalAmt, date) {
                let content = `========================================\n`;
                content += `             WROGN INVOICE              \n`;
                content += `========================================\n`;
                content += `Invoice ID: ${id}\n`;
                content += `Date: ${date}\n`;
                content += `Customer: ${name}\n`;
                content += `Payment Method: ${paymentName}\n`;
                content += `----------------------------------------\n`;
                cart.forEach(item => {
                    content += `${item.product.title} (${item.size}) x${item.quantity} - Rs.${item.product.price * item.quantity}\n`;
                });
                content += `----------------------------------------\n`;
                content += `Subtotal: Rs.${subtotal}\n`;
                content += `Shipping: Rs.${shipping}\n`;
                if (discount > 0) content += `Discount: -Rs.${discount}\n`;
                content += `Total Paid: Rs.${totalAmt}\n`;
                content += `========================================\n`;
                content += `Thank you for shopping with WROGN!\n`;
                
                const blob = new Blob([content], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `wrogn-invoice-${id}.txt`;
                link.click();
                showToast("Invoice downloaded successfully!");
            };

            window.closeInvoiceRedirect = function() {
                invoiceModal.remove();
                saveCart([]);
                localStorage.removeItem('wrogn_promo');
                window.location.href = "profile.html";
            };
        });
    }

    // --- 7. Login Page (login.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Inject Forgot Password Modal dynamically
        const forgotModal = document.createElement('div');
        forgotModal.id = "forgotModalOverlay";
        forgotModal.className = "forgot-modal-overlay hidden";
        forgotModal.innerHTML = `
            <div class="auth-card" style="position: relative; margin: 0; max-width: 400px; background-color: var(--card-bg);">
                <button class="cart-drawer-close" id="closeForgotModal" style="position: absolute; top: 15px; right: 20px;">&times;</button>
                <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 10px; text-transform: uppercase;">Reset Password</h3>
                <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">Enter your email below. We'll send instructions to recover your credentials.</p>
                <form id="forgotForm">
                    <div class="form-group">
                        <label for="forgotEmail">Email Address</label>
                        <input type="email" id="forgotEmail" class="form-control" placeholder="name@example.com" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Send Reset Instructions</button>
                </form>
            </div>
        `;
        document.body.appendChild(forgotModal);

        const forgotTrigger = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim().toLowerCase().includes('forgot'));
        forgotTrigger?.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.classList.remove('hidden');
        });

        document.getElementById('closeForgotModal')?.addEventListener('click', () => {
            forgotModal.classList.add('hidden');
        });

        document.getElementById('forgotForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;
            forgotModal.classList.add('hidden');
            showToast(`Password recovery link sent to: ${email}`);
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const registeredUsers = JSON.parse(localStorage.getItem('wrogn_users')) || [];
            
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
            const userNameEl = document.getElementById('profile-user-name');
            const userEmailEl = document.getElementById('profile-user-email');
            const welcomeNameEl = document.getElementById('welcome-user-name');
            
            if (userNameEl) userNameEl.textContent = activeUser.name;
            if (userEmailEl) userEmailEl.textContent = activeUser.email;
            if (welcomeNameEl) welcomeNameEl.textContent = activeUser.name;

            const formName = document.getElementById('profileName');
            const formEmail = document.getElementById('profileEmail');
            if (formName) formName.value = activeUser.name;
            if (formEmail) formEmail.value = activeUser.email;

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

                renderAdminChart(orders);
            }

            function renderAdminChart(orders) {
                const categories = { Topwear: 1500, Bottomwear: 2000, Accessories: 1000 };
                orders.forEach(o => {
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

                // Pick a random image from our existing pool of assets (to prevent blank/broken files)
                const imagePool = [
                    "Images/jacket-1.jpg", "Images/jacket-2.jpg", "Images/jacket-3.jpg", "Images/jacket-4.jpg", "Images/jacket-5.jpg", "Images/jacket-6.jpg",
                    "Images/sports-1.jpg", "Images/sports-2.jpg", "Images/sports-3.jpg", "Images/sports-4.jpg", "Images/sports-5.jpg", "Images/sports-6.jpg",
                    "Images/shirt-1.jpg", "Images/shirt-2.jpg",
                    "Images/shoe-1.jpg", "Images/shoe-2.jpg", "Images/shoe-3.jpg", "Images/shoe-4.jpg", "Images/shoe-5.jpg",
                    "Images/watch-1.jpg", "Images/watch-2.jpg", "Images/watch-3.jpg", "Images/watch-4.jpg",
                    "Images/belt.jpg"
                ];
                const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];

                const newProd = {
                    id: newId,
                    title,
                    category,
                    price,
                    oldPrice,
                    rating: 4.5,
                    ratingCount: 1,
                    description: desc,
                    image: randomImage,
                    images: [randomImage, randomImage, randomImage],
                    badge: "New",
                    color: "Black",
                    tags: [category.toLowerCase()]
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
                document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
});
