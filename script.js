const hamburgerBtn = document.getElementById('hamburger-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar-menu');

hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// --- SIDEBAR ACCORDION LOGIC ---
const dropdownHeaders = document.querySelectorAll('.dropdown-header');

dropdownHeaders.forEach(header => {
    header.addEventListener('click', () => {
        // 1. Get the parent <li>
        const parentLi = header.parentElement;
        
        // 2. Toggle the 'open' class
        parentLi.classList.toggle('open');
        
        // OPTIONAL: Close other menus when one opens (Accordion effect)
        // If you want multiple to stay open, remove this block.
        document.querySelectorAll('.dropdown-li').forEach(item => {
            if (item !== parentLi) {
                item.classList.remove('open');
            }
        });
    });
});
// =========================================
//  SMART HERO SLIDER LOGIC
// =========================================

// 1. DATA: Define what each slide should link to
const heroSlidesData = [
    { 
        // Slide 0: product-2.jpg
        title: "NEW ARRIVALS", 
        subtitle: "LATEST COLLECTION 2026", 
        link: "shop.html" 
    },
    { 
        // Slide 1: men.png
        title: "MEN'S COLLECTION", 
        subtitle: "SHARP. STYLISH. TIMELESS.", 
        link: "shop.html?category=men" 
    },
    { 
        // Slide 2: women.png
        title: "WOMEN'S FASHION", 
        subtitle: "ELEGANCE REDEFINED", 
        link: "shop.html?category=women" 
    },
    { 
        // Slide 3: kid.png
        title: "KIDS COLLECTION", 
        subtitle: "FUN. COMFORT. STYLE.", 
        link: "shop.html?category=kids" 
    },
    { 
        // Slide 4: acc.png
        title: "PREMIUM ACCESSORIES", 
        subtitle: "COMPLETE YOUR LOOK", 
        link: "shop.html?type=accessories" 
    },
    { 
        // Slide 5: trends.png
        title: "TRENDING NOW", 
        subtitle: "MOST LOVED STYLES", 
        link: "shop.html" 
    },
    { 
        // Slide 6: PRODUCT-7.jpg
        title: "SEASON SALE", 
        subtitle: "UP TO 50% OFF", 
        link: "shop.html" 
    }
];

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroBtn = document.getElementById('hero-btn');

// 2. FUNCTION TO CHANGE SLIDE
function setSlide(index) {
    // Reset Logic
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    // Remove Active Class
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Set Active Class
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // UPDATE CONTENT & LINK (Magic Part)
    const data = heroSlidesData[currentSlideIndex];
    
    // Animation reset for text
    heroTitle.style.animation = 'none';
    heroSubtitle.style.animation = 'none';
    heroBtn.style.animation = 'none';
    
    setTimeout(() => {
        heroTitle.innerText = data.title;
        heroSubtitle.innerText = data.subtitle;
        heroBtn.href = data.link; // <--- This Updates the Link!
        
        // Re-trigger animation
        heroTitle.style.animation = 'fadeInUp 0.8s ease forwards';
        heroSubtitle.style.animation = 'fadeInUp 0.8s ease forwards';
        heroBtn.style.animation = 'fadeInUp 0.8s ease forwards';
    }, 50);
}

// 3. AUTO PLAY
setInterval(() => {
    setSlide(currentSlideIndex + 1);
}, 4000); // Change every 4 seconds
// =========================================
//  GLOBAL SCRIPT (NAVBAR & SEARCH)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE SIDEBAR LOGIC
    const hamburger = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar-menu');

    if(hamburger) {
        hamburger.addEventListener('click', () => sidebar.classList.add('active'));
    }
    if(closeBtn) {
        closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    // Mobile Dropdowns (Accordion)
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');
    dropdownHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    // 2. SMART SEARCH LOGIC (With All New Categories)
    const searchInput = document.getElementById('global-search');
    const suggestionsBox = document.getElementById('search-suggestions');

    // FULL Search Data
    const searchData = [
        { name: "Men's Top Wear (Shirts, Tees)", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Bottom Wear (Jeans)", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Ethnic Wear", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Sports Wear", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Footwear", link: "shop.html?category=men&type=footwear" },
        
        { name: "Women's Top Wear", link: "shop.html?category=women&type=top-wear" },
        { name: "Women's Dresses", link: "shop.html?category=women&type=dresses" },
        { name: "Women's Ethnic Wear", link: "shop.html?category=women&type=ethnic-wear" },
        { name: "Women's Footwear", link: "shop.html?category=women&type=footwear" },
        
        { name: "Kids Top Wear", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Ethnic Wear", link: "shop.html?category=kids&type=ethnic-wear" },
        
        { name: "Accessories (Bags, Watches)", link: "shop.html?type=accessories" }
    ];

    if(searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const input = e.target.value.toLowerCase();
            suggestionsBox.innerHTML = ''; 

            if(input.length > 0) {
                const filtered = searchData.filter(item => item.name.toLowerCase().includes(input));
                
                if(filtered.length > 0) {
                    suggestionsBox.style.display = 'block';
                    filtered.forEach(item => {
                        const div = document.createElement('div');
                        div.classList.add('suggestion-item');
                        div.innerText = item.name;
                        div.onclick = () => window.location.href = item.link;
                        suggestionsBox.appendChild(div);
                    });
                } else {
                    suggestionsBox.style.display = 'none';
                }
            } else {
                suggestionsBox.style.display = 'none';
            }

            if(e.key === 'Enter') {
                window.location.href = `shop.html?search=${input}`;
            }
        });

        // Hide when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    updateCartCountGlobal();
});

function updateCartCountGlobal() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = totalCount;
}
// =========================================
//  QUICK ADD TO CART FUNCTION
// =========================================

function addToCartQuick(event, id, name, price, image) {
    // 1. Stop the card from clicking (Prevents opening Product Details)
    event.stopPropagation();

    // 2. Create Product Object
    const product = {
        id: id,
        name: name,
        price: price,
        image: image,
        size: "M", // Default size since it's a quick add
        quantity: 1
    };

    // 3. Get Existing Cart
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];

    // 4. Check if Item Exists
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity
    } else {
        cart.push(product); // Add new item
    }

    // 5. Save back to Storage
    localStorage.setItem('myCart', JSON.stringify(cart));

    // 6. Update Badge (Optional, but good practice)
    updateCartCountGlobal();

    // 7. Redirect to Cart Page
    window.location.href = 'cart.html';
}
const searchInput = document.getElementById('global-search');
const searchTrigger = document.getElementById('search-trigger');

// 1. Toggle search bar on mobile when icon is clicked
searchTrigger.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    } else {
        // Desktop logic: trigger search
        performSearch(searchInput.value);
    }
});

// 2. Handle "Enter" key for both Desktop & Mobile
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});

function performSearch(query) {
    if (query.trim() !== "") {
        console.log("Searching for:", query);
        // Add your search redirect or logic here
        // window.location.href = `/search?q=${query}`;
    }
}
window.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-screen');

    setTimeout(() => {
        intro.classList.add('fade-out');
        
        // Remove from DOM after transition finishes so it doesn't block clicks
        setTimeout(() => {
            intro.style.display = 'none';
        }, 800); 
        
    }, 3000); // 3000ms = 3 seconds
});
window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');
    
    setTimeout(() => {
        intro.classList.add('intro-exit');
        
        // Browser se element hatane ke liye taaki clicks block na hon
        setTimeout(() => {
            intro.style.display = 'none';
        }, 1000); 
    }, 3000); // 3 Second ka wait
});
window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        intro.style.transition = "transform 1.2s cubic-bezier(0.7, 0, 0.3, 1)";
        intro.style.transform = "translateY(-100%)"; // Screen upar slide hogi
        
        setTimeout(() => {
            intro.style.display = 'none';
        }, 1200);
    }, 3000);
});
// =========================================
//  DIRECT BUY / INSTANT CHECKOUT
// =========================================
function buyNowDirectly(event, id, name, price, image) {
    // 1. Stop propagation so it doesn't trigger the card's 'product-details' link
    event.stopPropagation();

    // 2. Create the Product Object
    const product = {
        id: id,
        name: name,
        price: price,
        image: image,
        size: "M", // Default size for instant buy
        quantity: 1
    };

    // 3. Clear existing cart for a "Clean" checkout, or just add it
    // Usually, "Buy Now" means you want only THIS item. 
    let instantCart = [product]; 

    // 4. Save to LocalStorage
    localStorage.setItem('myCart', JSON.stringify(instantCart));

    // 5. Redirect straight to Checkout
    window.location.href = 'checkout.html';
}
function renderPage() {
    // Console mein check karne ke liye (F12 dabakar Console tab dekhein)
    console.log("Current Product Data:", currentProduct);

    if (!currentProduct) return;

    // 1. Name Fix
    const nameEl = document.getElementById('p-name');
    if(nameEl) {
        nameEl.innerText = currentProduct.name;
        nameEl.classList.remove('skeleton-text'); // Skeleton effect hatane ke liye
    }

    // 2. Price Fix (Jo aapka ho gaya hai)
    document.getElementById('p-price').innerText = `₹${currentProduct.price}`;

    // 3. Image Fix
    const imgEl = document.getElementById('main-img');
    if(imgEl) {
        imgEl.src = currentProduct.image;
        console.log("Setting Image Source to:", currentProduct.image);
    }

    // 4. Breadcrumb Fix
    const crumbEl = document.getElementById('p-name-crumb');
    if(crumbEl) crumbEl.innerText = currentProduct.name;
}
function buyNowDirectly(event, id, name, price, img) {
    // Ye line card ke redirect ko rokne ke liye hai
    event.stopPropagation(); 

    // Instant cart object banana
    const quickBuyItem = {
        id: String(id),
        name: name,
        price: parseInt(price),
        image: img,
        size: "M", // Default size set kar di hai
        quantity: 1
    };

    // Cart ko update karna (Purana cart clear karke sirf ye item)
    localStorage.setItem('myCart', JSON.stringify([quickBuyItem]));

    // Seedha checkout page par bhejna
    window.location.href = 'checkout.html';
}