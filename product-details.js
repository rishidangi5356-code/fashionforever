// =========================================
//  PRODUCT DETAILS - FULL COMPLETED VERSION
// =========================================

let currentProduct = {};
let selectedSize = ""; // Yeh variable sync rahega
let currentQty = 1;
let currentRating = 0;
let allProductsData = [];

// ✅ GLOBAL FUNCTION: Click karne par main photo change karne ke liye
window.updateMainImage = function(element, imgSrc) {
    // Agar direct string aayi hai (backup call)
    if (typeof element === 'string') {
        imgSrc = element;
        element = null;
    }

    console.log("Changing main image to:", imgSrc);
    
    // Sabhi possible IDs check kar rahe hain jo HTML mein ho sakte hain
    const mainImg = document.getElementById('main-img') || 
                    document.getElementById('main-product-image') || 
                    document.getElementById('main-product-img');
                    
    if (mainImg) {
        mainImg.src = imgSrc;
    }
    
    // Active class (border) update logic
    document.querySelectorAll('.thumb-wrapper').forEach(el => el.classList.remove('active'));
    if(element && element.classList) {
        element.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateCartCountGlobal();
    
    // 🟢 DATA SYNC LOGIC: Wait until 'allProducts' is available from products.js
    const waitForData = setInterval(() => {
        const dataRef = (typeof allProducts !== 'undefined' && allProducts.length > 0) ? allProducts : 
                        (typeof window.allProducts !== 'undefined' && window.allProducts.length > 0) ? window.allProducts :
                        (typeof allProductsData !== 'undefined' && allProductsData.length > 0) ? allProductsData : null;

        if (dataRef) {
            allProductsData = dataRef;
            console.log("✅ Data Received in Details Page:", allProductsData);
            loadProductData();
            clearInterval(waitForData);
        }
    }, 100);

    setupListeners();
    initZoomEffect();
});

// =======================
//  CORE DATA LOADING
// =======================
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id')?.trim();

    if (!productId) { 
        window.location.href = 'shop.html'; 
        return; 
    }

    // Matching ID with string comparison to avoid type errors
    currentProduct = allProductsData.find(p => String(p.id).trim() === String(productId));

    if (currentProduct) {
        console.log("✅ Match Found:", currentProduct.name);
        renderPage();
    } else {
        console.error("❌ Product Not Found ID:", productId);
        console.log("Available IDs:", allProductsData.map(p => p.id));
        const nameEl = document.getElementById('p-name');
        if(nameEl) nameEl.innerText = "Product Not Found";
    }
}

function renderPage() {
    console.log("Rendering for:", currentProduct.name);

    // 1. Force Remove Skeleton Classes
    const skeletons = document.querySelectorAll('.skeleton-text, .skeleton');
    skeletons.forEach(el => el.classList.remove('skeleton-text', 'skeleton'));

    // 2. Name & Breadcrumbs
    const nameEl = document.getElementById('p-name');
    const crumbEl = document.getElementById('p-name-crumb');
    if(nameEl) {
        nameEl.innerText = currentProduct.name;
        nameEl.style.visibility = 'visible';
        nameEl.style.opacity = '1';
    }
    if(crumbEl) crumbEl.innerText = currentProduct.name;
    
    // 3. Category & Price
    const catEl = document.getElementById('p-category');
    if(catEl) catEl.innerText = (currentProduct.category || "General").toUpperCase();
    
    const priceEl = document.getElementById('p-price');
    if(priceEl) priceEl.innerText = `₹${currentProduct.price}`;
    
    // 4. MAIN IMAGE & GALLERY LOGIC
    const mainImg = document.getElementById('main-img') || document.getElementById('main-product-image') || document.getElementById('main-product-img');
    if(mainImg && currentProduct.image) {
        mainImg.src = currentProduct.image;
    }

    renderGallery(); 

    // 5. Discount Section
    const oldPriceEl = document.getElementById('p-old-price');
    const badgeEl = document.getElementById('p-badge');
    const discountEl = document.getElementById('p-discount-label');

    const oldPrice = currentProduct.oldPrice || currentProduct['original price'] || 0;

    if(oldPrice > currentProduct.price) {
        if(oldPriceEl) {
            oldPriceEl.innerText = `₹${oldPrice}`;
            oldPriceEl.style.display = 'inline';
        }
        const percent = Math.round(((oldPrice - currentProduct.price) / oldPrice) * 100);
        if(badgeEl) {
            badgeEl.innerText = `-${percent}%`;
            badgeEl.style.display = 'block';
        }
        if(discountEl) {
            discountEl.innerText = `(${percent}% OFF)`;
            discountEl.style.display = 'inline';
        }
    } else {
        if(oldPriceEl) oldPriceEl.style.display = 'none';
        if(badgeEl) badgeEl.style.display = 'none';
        if(discountEl) discountEl.style.display = 'none';
    }

    // 6. Stock Logic
    const stockStatus = document.getElementById('stock-badge');
    const addBtn = document.getElementById('add-cart-btn');
    const stock = Number(currentProduct.stock) || 0;

    if (stock > 0) {
        if(stockStatus) {
            stockStatus.innerHTML = '<i class="fas fa-check-circle"></i> In Stock';
            stockStatus.style.color = '#2e7d32';
        }
        if(addBtn) {
            addBtn.disabled = false;
            addBtn.innerText = "ADD TO CART";
        }
    } else {
        if(stockStatus) {
            stockStatus.innerHTML = '<i class="fas fa-times-circle"></i> Out of Stock';
            stockStatus.style.color = '#c62828';
        }
        if(addBtn) {
            addBtn.disabled = true;
            addBtn.innerText = "OUT OF STOCK";
        }
    }

    renderRelated();
    if(typeof loadReviews === 'function') loadReviews(currentProduct.id);
}

// =======================
//  GALLERY SYSTEM
// =======================

function renderGallery() {
    const thumbContainer = document.getElementById('thumbnail-container');
    if (!thumbContainer || !currentProduct) return;

    // Collecting all possible images
    let imgs = [];
    
    if (currentProduct.gallery && Array.isArray(currentProduct.gallery)) {
        imgs = [...currentProduct.gallery];
    }
    
    // Backup: Check all individual image fields from your Sheet
    if(currentProduct.image) imgs.push(currentProduct.image);
    if(currentProduct.image1) imgs.push(currentProduct.image1);
    if(currentProduct.image2) imgs.push(currentProduct.image2);
    if(currentProduct.image3) imgs.push(currentProduct.image3);
    if(currentProduct.link1) imgs.push(currentProduct.link1);
    if(currentProduct.link2) imgs.push(currentProduct.link2);
    if(currentProduct.link3) imgs.push(currentProduct.link3);
    
    // Clean array: remove duplicates and empty strings
    imgs = [...new Set(imgs.filter(url => url && String(url).length > 10))];

    console.log("Images found for gallery:", imgs.length);

    if (imgs.length > 0) {
        thumbContainer.innerHTML = imgs.map((img, index) => `
            <div class="thumb-wrapper ${index === 0 ? 'active' : ''}" onclick="window.updateMainImage(this, '${img}')">
                <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
            </div>
        `).join('');
    }
}

// =======================
//  UI HELPERS & LISTENERS
// =======================
function setupListeners() {
    // 1. Size Selection (Static listener - for backup)
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
            window.selectedSize = selectedSize; // Syncing
            const err = document.getElementById('size-error');
            if(err) err.style.display = 'none';
        });
    });

    // 2. ADD TO CART
    const addCartIds = ['add-cart-btn', 'mobile-add-btn'];
    addCartIds.forEach(id => {
        const btn = document.getElementById(id);
        if(btn) btn.addEventListener('click', () => addToCart(false));
    });

    // 3. BUY NOW
    const buyNowIds = ['buy-now-btn', 'mobile-buy-btn'];
    buyNowIds.forEach(id => {
        const btn = document.getElementById(id);
        if(btn) btn.addEventListener('click', () => {
            if(addToCart(true)) window.location.href = 'checkout.html';
        });
    });

    const pinBtn = document.getElementById('check-pincode-btn');
    if(pinBtn) pinBtn.addEventListener('click', checkDelivery);
}

function addToCart(isBuyNow) {
    // Check both local and global selectedSize
    const finalSize = selectedSize || window.selectedSize;

    if(!finalSize) { 
        const err = document.getElementById('size-error');
        if(err) err.style.display = 'block'; 
        const selectorBox = document.querySelector('.selector-box');
        if(selectorBox) selectorBox.scrollIntoView({behavior: 'smooth', block: 'center'});
        return false; 
    }
    
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const existing = cart.find(item => item.id === currentProduct.id && item.size === finalSize);
    
    if(existing) {
        existing.quantity += currentQty;
    } else {
        cart.push({
            id: currentProduct.id, 
            name: currentProduct.name, 
            price: currentProduct.price,
            image: currentProduct.image, 
            size: finalSize, 
            quantity: currentQty
        });
    }
    
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartCountGlobal();
    
    if(!isBuyNow) {
        const toast = document.getElementById("toast");
        if(toast) {
            toast.className = "show";
            setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
        }
    }
    return true;
}

function updateCartCountGlobal() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if(el) el.innerText = count;
}

function renderRelated() {
    const container = document.getElementById('related-container');
    if(!container) return;
    const related = allProductsData.filter(p => p.category === currentProduct.category && String(p.id) !== String(currentProduct.id)).slice(0,4);
    container.innerHTML = related.map(p => `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${p.id}'">
            <div class="product-image"><img src="${p.image}"></div>
            <div class="product-info"><h3>${p.name}</h3><div class="price">₹${p.price}</div></div>
        </div>
    `).join('');
}

function initZoomEffect() {
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('main-img') || document.getElementById('main-product-image') || document.getElementById('main-product-img');
    if(!container || !img) return;

    container.addEventListener('mousemove', (e) => {
        if(window.innerWidth <= 768) return;
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = "scale(2)";
    });

    container.addEventListener('mouseleave', () => {
        img.style.transform = "scale(1)";
        img.style.transformOrigin = "center center";
    });
}

window.updateQty = function(change) {
    let newQty = currentQty + change;
    if(newQty >= 1) { 
        currentQty = newQty; 
        const qtyInput = document.getElementById('qty-input');
        if(qtyInput) qtyInput.value = currentQty; 
    }
}

function checkDelivery() {
    const input = document.querySelector('.pincode-input-group input');
    const note = document.querySelector('.delivery-note');
    if(input && input.value.length === 6) {
        if(note) note.innerHTML = `<span style="color:green">Available for delivery</span>`;
    } else {
        alert("Enter valid 6-digit pincode");
    }
}

// =========================================
//  RATINGS & REVIEWS SYSTEM
// ========================================

let selectedStarValue = 0;

function setupReviewSystem() {
    const toggleBtn = document.getElementById('toggle-review-form');
    const formBox = document.getElementById('review-form-box');
    const closeBtn = document.getElementById('close-review-form');
    const stars = document.querySelectorAll('.star-input');
    const submitBtn = document.getElementById('submit-review-btn');
    const fileInput = document.getElementById('review-image');
    const fileNameDisplay = document.getElementById('file-name');

    if (toggleBtn && formBox) {
        toggleBtn.onclick = () => {
            formBox.style.display = formBox.style.display === 'none' ? 'block' : 'none';
            if(formBox.style.display === 'block') formBox.scrollIntoView({ behavior: 'smooth' });
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => formBox.style.display = 'none';
    }

    stars.forEach(star => {
        star.onclick = function() {
            selectedStarValue = this.getAttribute('data-value');
            stars.forEach(s => {
                const val = s.getAttribute('data-value');
                if (val <= selectedStarValue) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        };
    });

    if (fileInput) {
        fileInput.onchange = function() {
            fileNameDisplay.innerText = this.files[0] ? this.files[0].name : "No file chosen";
        };
    }

    if (submitBtn) {
        submitBtn.onclick = function() {
            const name = document.getElementById('review-name').value.trim();
            const text = document.getElementById('review-text').value.trim();

            if (!name || selectedStarValue === 0 || !text) {
                alert("Bhai, Name, Rating aur Description teeno bharo!");
                return;
            }

            const newReview = {
                name: name,
                rating: selectedStarValue,
                text: text,
                date: new Date().toLocaleDateString(),
                image: fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : null
            };

            addReviewToUI(newReview);
            alert("Review submitted successfully!");
            formBox.style.display = 'none';
            resetReviewForm();
        };
    }
}

function addReviewToUI(review) {
    const container = document.getElementById('reviews-list-container');
    if (!container) return;

    let starHTML = '';
    for (let i = 1; i <= 5; i++) {
        starHTML += i <= review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }

    const reviewHTML = `
        <div class="review-card">
            <div class="review-header">
                <strong>${review.name}</strong>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-stars" style="color: #f39c12; margin: 5px 0;">
                ${starHTML}
            </div>
            <p class="review-content">${review.text}</p>
            ${review.image ? `<img src="${review.image}" style="width:80px; height:80px; object-fit:cover; margin-top:10px; border-radius:4px;">` : ''}
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', reviewHTML);
}

function resetReviewForm() {
    const nameInput = document.getElementById('review-name');
    const textInput = document.getElementById('review-text');
    const imgInput = document.getElementById('review-image');
    if(nameInput) nameInput.value = '';
    if(textInput) textInput.value = '';
    if(imgInput) imgInput.value = '';
    if(document.getElementById('file-name')) document.getElementById('file-name').innerText = "No file chosen";
    selectedStarValue = 0;
    document.querySelectorAll('.star-input').forEach(s => {
        s.classList.remove('fas', 'active');
        s.classList.add('far');
    });
}

window.addEventListener('dataReady', () => {
    setupReviewSystem();
});
// ==========================================
// DYNAMIC SIZE RENDERING LOGIC (APPENDED)
// ==========================================

window.addEventListener('dataReady', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = window.allProducts?.find(p => p.id === productId);

    if (product && product.size) {
        renderSizes(product.size);
    }
});

// Agar data pehle se load ho chuka ho
if (window.allProducts && window.allProducts.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = window.allProducts.find(p => p.id === productId);
    if (product) renderSizes(product.size);
}

function renderSizes(sizeString) {
    const container = document.getElementById('size-container');
    if (!container) return;

    // 1. Purana kachra saaf karo
    container.innerHTML = '';

    // 2. String ko array mein badlo (e.g., "s, m, l" -> ["s", "m", "l"])
    const sizes = sizeString.split(',').map(s => s.trim()).filter(s => s !== "");

    if (sizes.length === 0) {
        container.innerHTML = '<p style="color:red; font-size:14px;">Out of Stock</p>';
        return;
    }

    // 3. Har size ke liye button banao
    sizes.forEach(sz => {
        const btn = document.createElement('div');
        btn.className = 'size-btn';
        btn.setAttribute('data-size', sz.toUpperCase());
        btn.innerText = sz.toUpperCase();

        // 4. Click event (Size select karne ke liye)
        btn.onclick = function() {
            // Baaki sabse active class hatao
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            // Ispe active class lagao
            this.classList.add('active');
            
            // ERROR FIX: Hiding error message on click
            const errorEl = document.getElementById('size-error');
            if(errorEl) errorEl.style.display = 'none';
            
            // SYNC FIX: Updating both local and global variables
            const szUpper = sz.toUpperCase();
            selectedSize = szUpper; 
            window.selectedSize = szUpper;
        };

        container.appendChild(btn);
    });
}