document.addEventListener('DOMContentLoaded', () => {
    // DOM Selectors
    const themeToggleBtn = document.getElementById('themeToggle');
    const moonIcon = themeToggleBtn.querySelector('.theme-icon-moon');
    const sunIcon = themeToggleBtn.querySelector('.theme-icon-sun');
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const navbarBottomWrapper = document.querySelector('.navbar-bottom-wrapper');
    
    const categoriesDropdownLink = document.getElementById('categoriesDropdownLink');
    const categoriesDropdownMenu = document.querySelector('.dropdown-menu');
    
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const micBtn = document.getElementById('micBtn');
    
    const navLinks = document.querySelectorAll('.nav-link');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const profileBtn = document.querySelector('.profile-btn');
    const toast = document.getElementById('toast');

    let cartCount = 0;

    // --- Toast Notification Helper ---
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        // Remove existing timers if any
        if (window.toastTimer) {
            clearTimeout(window.toastTimer);
        }
        
        window.toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- Dark/Light Theme Switching ---
    // Retrieve theme from localStorage or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
        
        showToast(`Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode`);
    });

    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        } else {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
    }

    // --- Active State for Navigation Links ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if it's the dropdown trigger on mobile (accordion behavior)
            if (window.innerWidth <= 768 && link.classList.contains('dropdown-trigger')) {
                e.preventDefault();
                return;
            }
            
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu when navigating (if not a dropdown toggle)
            if (window.innerWidth <= 768) {
                navbarBottomWrapper.classList.remove('open');
                mobileMenuBtn.classList.remove('open');
            }
        });
    });

    // --- Mobile Drawer Navigation (Open/Close) ---
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navbarBottomWrapper.classList.contains('open');
        if (isOpen) {
            navbarBottomWrapper.classList.remove('open');
            mobileMenuBtn.classList.remove('open');
        } else {
            navbarBottomWrapper.classList.add('open');
            mobileMenuBtn.classList.add('open');
        }
    });

    mobileCloseBtn.addEventListener('click', () => {
        navbarBottomWrapper.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
    });

    // Close mobile drawer when clicking overlay backdrop
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            // If drawer is open and click was outside header and drawer itself
            if (navbarBottomWrapper.classList.contains('open') && 
                !navbarBottomWrapper.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                navbarBottomWrapper.classList.remove('open');
                mobileMenuBtn.classList.remove('open');
            }
        }
    });

    // --- Mobile Categories Accordion Toggle ---
    categoriesDropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            categoriesDropdownMenu.classList.toggle('open');
            
            // Rotate dropdown caret icon
            const caret = categoriesDropdownLink.querySelector('.dropdown-caret');
            if (categoriesDropdownMenu.classList.contains('open')) {
                caret.style.transform = 'rotate(180deg)';
            } else {
                caret.style.transform = 'rotate(0deg)';
            }
        }
    });

    // --- Search Submit Interaction ---
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            showToast(`Searching for: "${query}"`);
            searchInput.value = '';
        } else {
            showToast('Please type a search query first.');
        }
    });

    // --- Voice Search (Microphone) click ---
    micBtn.addEventListener('click', () => {
        showToast('Listening for voice search... Speak now!');
        
        // Add active pulse class to mic button
        micBtn.style.transform = 'scale(1.2)';
        micBtn.style.backgroundColor = 'rgba(162, 155, 254, 0.25)';
        
        setTimeout(() => {
            micBtn.style.transform = '';
            micBtn.style.backgroundColor = '';
            showToast('Voice matched: "Wrogn distressed slim fit jeans"');
            searchInput.value = 'Wrogn distressed slim fit jeans';
            searchInput.focus();
        }, 2200);
    });

    // --- Actions Click Handlers (Wishlist, Cart, Profile) ---
    wishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Wishlist updated: Item added to favorites.');
    });

    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartCount++;
        cartBadge.textContent = cartCount;
        showToast(`Cart updated: +1 item (Total: ${cartCount})`);
        
        // Micro-animation for cart badge
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 300);
    });

    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Redirecting to your profile workspace...');
    });
});
