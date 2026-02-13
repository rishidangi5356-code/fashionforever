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

    // 2. SMART SEARCH LOGIC (With 100+ Men's & Kids' Suggestions)
    const searchInput = document.getElementById('global-search');
    const suggestionsBox = document.getElementById('search-suggestions');

    // FULL Search Data (100+ Products focusing on Men & Kids)
    const searchData = [
        // --- MEN'S TOP WEAR ---
        { name: "Men's Casual White Shirt", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Black Slim Fit T-Shirt", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Oversized Graphic Tee", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Denim Jacket", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Checked Flannel Shirt", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's V-Neck Cotton Sweater", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Polo Neck T-Shirt", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Linen Summer Shirt", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Hoodie with Pocket", link: "shop.html?category=men&type=top-wear" },
        { name: "Men's Formal Blue Shirt", link: "shop.html?category=men&type=top-wear" },

        // --- MEN'S BOTTOM WEAR ---
        { name: "Men's Blue Straight Fit Jeans", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Black Skinny Jeans", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Beige Chino Trousers", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Olive Cargo Pants", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Cotton Grey Joggers", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Denim Shorts", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Formal Black Trousers", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Relaxed Fit Pyjamas", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Athletic Shorts", link: "shop.html?category=men&type=bottom-wear" },
        { name: "Men's Corduroy Pants", link: "shop.html?category=men&type=bottom-wear" },

        // --- MEN'S ETHNIC WEAR ---
        { name: "Men's Cotton Kurta", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Embroidered Sherwani", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Nehru Jacket", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Pathani Suit", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Silk Kurta Pajama Set", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Wedding Dhoti Set", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Bandhgala Blazer", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Lucknawi Chikankari Kurta", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Ethnic Waistcoat", link: "shop.html?category=men&type=ethnic-wear" },
        { name: "Men's Festive Dupion Silk Kurta", link: "shop.html?category=men&type=ethnic-wear" },

        // --- MEN'S SPORTS WEAR ---
        { name: "Men's Dry-Fit Training Tee", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Compression Leggings", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Full Zip Tracksuit", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Sleeveless Gym Vest", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Running Shorts", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Sports Windbreaker", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Football Jersey", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Training Joggers", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Padded Cycling Shorts", link: "shop.html?category=men&type=sports-wear" },
        { name: "Men's Breathable Mesh Tank Top", link: "shop.html?category=men&type=sports-wear" },

        // --- MEN'S FOOTWEAR ---
        { name: "Men's White Casual Sneakers", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Leather Oxford Shoes", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Suede Loafers", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Chelsea Boots", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Running Sports Shoes", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Leather Flip Flops", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Formal Derby Shoes", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Canvas Slip-Ons", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Hiking Outdoor Boots", link: "shop.html?category=men&type=footwear" },
        { name: "Men's Ethnic Jutis", link: "shop.html?category=men&type=footwear" },

        // --- KIDS TOP WEAR ---
        { name: "Kids Superhero Print Tee", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Hooded Sweatshirt", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Denim Shirt", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Polka Dot Cotton Top", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Striped Polo Shirt", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Cartoon Print T-Shirt", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Padded Winter Jacket", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Sleeveless Summer Vest", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Full Sleeve Graphic Tee", link: "shop.html?category=kids&type=top-wear" },
        { name: "Kids Casual Flannel Shirt", link: "shop.html?category=kids&type=top-wear" },

        // --- KIDS BOTTOM WEAR ---
        { name: "Kids Elastic Waist Jeans", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Cotton Cargo Shorts", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Printed Leggings", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Fleece Joggers", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Denim Bib Overalls", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids School Uniform Trousers", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Knit Shorts", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Chino Pants", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Pajama Bottoms", link: "shop.html?category=kids&type=bottom-wear" },
        { name: "Kids Track Pants", link: "shop.html?category=kids&type=bottom-wear" },

        // --- KIDS ETHNIC WEAR ---
        { name: "Kids Kurta Pajama Set", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Nehru Jacket for Boys", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Ethnic Dhoti Kurta", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Sherwani for Festivals", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Traditional Waistcoat", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids South Indian Pattu Pavadai", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Embroidered Ethnic Top", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Ethnic Gown", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Festive Kurta Set", link: "shop.html?category=kids&type=ethnic-wear" },
        { name: "Kids Bandhgala Suit", link: "shop.html?category=kids&type=ethnic-wear" },

        // --- KIDS FOOTWEAR & SPORTS ---
        { name: "Kids Light-up Sneakers", link: "shop.html?category=kids" },
        { name: "Kids School Black Shoes", link: "shop.html?category=kids" },
        { name: "Kids Velcro Strap Sandals", link: "shop.html?category=kids" },
        { name: "Kids Canvas Slip-ons", link: "shop.html?category=kids" },
        { name: "Kids Sports Running Shoes", link: "shop.html?category=kids" },
        { name: "Kids Cartoon Print Slippers", link: "shop.html?category=kids" },
        { name: "Kids Winter Fur Boots", link: "shop.html?category=kids" },
        { name: "Kids Rain Boots", link: "shop.html?category=kids" },
        { name: "Kids Football Cleats", link: "shop.html?category=kids" },
        { name: "Kids Ethnic Mojaris", link: "shop.html?category=kids" },

        // --- ACCESSORIES (MEN & KIDS) ---
        { name: "Men's Leather Belt", link: "shop.html?type=accessories" },
        { name: "Men's Analog Watch", link: "shop.html?type=accessories" },
        { name: "Men's Aviator Sunglasses", link: "shop.html?type=accessories" },
        { name: "Men's Leather Wallet", link: "shop.html?type=accessories" },
        { name: "Men's Woolen Beanie", link: "shop.html?type=accessories" },
        { name: "Men's Baseball Cap", link: "shop.html?type=accessories" },
        { name: "Men's Gym Duffle Bag", link: "shop.html?type=accessories" },
        { name: "Men's Cotton Socks Pack", link: "shop.html?type=accessories" },
        { name: "Kids School Backpack", link: "shop.html?type=accessories" },
        { name: "Kids Superhero Watch", link: "shop.html?type=accessories" },
        { name: "Kids Colorful Sunglasses", link: "shop.html?type=accessories" },
        { name: "Kids Hair Clips and Bands", link: "shop.html?type=accessories" },
        { name: "Kids Winter Scarf", link: "shop.html?type=accessories" },
        { name: "Kids Lunch Box and Bottle Bag", link: "shop.html?type=accessories" },
        { name: "Men's Laptop Messenger Bag", link: "shop.html?type=accessories" },
        { name: "Men's Stainless Steel Watch", link: "shop.html?type=accessories" },
        { name: "Men's Formal Tie and Pocket Square", link: "shop.html?type=accessories" },
        { name: "Men's Leather Laptop Sleeve", link: "shop.html?type=accessories" },
        { name: "Kids Cartoon Cap", link: "shop.html?type=accessories" },
        { name: "Kids Protective Knee Pads", link: "shop.html?type=accessories" }
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
if(searchTrigger){
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
}

// 2. Handle "Enter" key for both Desktop & Mobile
if(searchInput){
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

function performSearch(query) {
    if (query.trim() !== "") {
        console.log("Searching for:", query);
        window.location.href = `shop.html?search=${query}`;
    }
}
window.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-screen');
    if(intro){
        setTimeout(() => {
            intro.classList.add('fade-out');
            
            // Remove from DOM after transition finishes so it doesn't block clicks
            setTimeout(() => {
                intro.style.display = 'none';
            }, 800); 
            
        }, 3000); // 3000ms = 3 seconds
    }
});
window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');
    if(intro){
        setTimeout(() => {
            intro.classList.add('intro-exit');
            
            // Browser se element hatane ke liye taaki clicks block na hon
            setTimeout(() => {
                intro.style.display = 'none';
            }, 1000); 
        }, 3000); // 3 Second ka wait
    }
});
window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');
    if(intro){
        setTimeout(() => {
            intro.style.transition = "transform 1.2s cubic-bezier(0.7, 0, 0.3, 1)";
            intro.style.transform = "translateY(-100%)"; // Screen upar slide hogi
            
            setTimeout(() => {
                intro.style.display = 'none';
            }, 1200);
        }, 3000);
    }
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
// -----------------------------------------
    //  SECTION A: MOBILE SIDEBAR & MENU (FIXED)
    // -----------------------------------------

    // Function to close sidebar
    const closeSidebar = () => {
        if (sidebar) {
            sidebar.classList.remove('active');
            document.body.style.overflow = 'auto'; // Scroll vapas chalu
        }
    };

    // 1. Open Menu
    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    }

    // 2. Close Menu (Cross icon par click)
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    // 3. FIXED: Menu ke kisi bhi link par click ho toh menu band ho jaye
    const menuLinks = document.querySelectorAll('#sidebar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Agar link dropdown header nahi hai, toh menu band kar do
            if (!link.classList.contains('dropdown-header')) {
                closeSidebar();
            }
        });
    });

    // 4. Outside click par band karne ke liye (Optional but Pro)
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                closeSidebar();
            }
        }
    });
    // --- SECTION B: MOBILE SEARCH DIRECT FIX ---

if (searchTrigger) {
    searchTrigger.onclick = function(e) {
        console.log("Search Icon Clicked!"); // Agar ye console mein dikhe, matlab button clickable hai
        
        if (window.innerWidth <= 768) {
            e.preventDefault();
            
            // Search input ko toggle karo
            if (searchInput) {
                searchInput.classList.toggle('active');
                
                if (searchInput.classList.contains('active')) {
                    searchInput.focus();
                    console.log("Search Bar Opened");
                } else {
                    console.log("Search Bar Closed");
                }
            }
        }
    };
}
