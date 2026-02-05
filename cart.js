// =========================================
//  CART LOGIC (Shipping Bar + Recommendations)
// =========================================

let cart = [];
let allProductsData = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Products Data Load karna (products.js se)
    if(typeof localProducts !== 'undefined') {
        allProductsData = localProducts;
    }
    
    loadCart();
});

// 2. Main Load Function
function loadCart() {
    // LocalStorage se latest data uthana
    cart = JSON.parse(localStorage.getItem('myCart')) || [];
    renderCartItems();
    calculateTotals();
    renderRecommendations();
}

// 3. RENDER CART ITEMS (UI Update)
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const layout = document.getElementById('cart-content-layout');
    const emptyState = document.getElementById('empty-cart-msg');
    const countHeader = document.getElementById('cart-count-header');
    
    // Header count update
    if(countHeader) countHeader.innerText = `(${cart.length})`;

    // Empty Cart Logic
    if (cart.length === 0) {
        if(layout) layout.style.display = 'none';
        if(emptyState) emptyState.style.display = 'block';
        const shipContainer = document.getElementById('shipping-bar-container');
        if(shipContainer) shipContainer.style.display = 'none';
        return;
    } else {
        if(layout) layout.style.display = 'grid';
        if(emptyState) emptyState.style.display = 'none';
        const shipContainer = document.getElementById('shipping-bar-container');
        if(shipContainer) shipContainer.style.display = 'block';
    }

    // HTML Generate karna
    container.innerHTML = cart.map((item, index) => {
        let img = item.image ? item.image : 'image/placeholder.png';
        return `
        <div class="cart-item">
            <div class="cart-img-box">
                <img src="${img}" alt="${item.name}">
            </div>
            
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-meta">Size: ${item.size}</div>
                <div class="remove-btn" style="cursor:pointer; color:red; font-weight:600; margin-top:10px; display:inline-block;" 
                     onclick="removeItem(${index})">
                     <i class="fas fa-trash-alt"></i> REMOVE
                </div>
            </div>

            <div class="qty-control">
                <button class="qty-btn-sm" onclick="changeQty(${index}, -1)">−</button>
                <div class="qty-val">${item.quantity}</div>
                <button class="qty-btn-sm" onclick="changeQty(${index}, 1)">+</button>
            </div>

            <div class="item-total">₹${item.price * item.quantity}</div>
        </div>
        `;
    }).join('');
}

// 4. TOTALS & SHIPPING BAR CALCULATION
function calculateTotals() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const FREE_SHIP_THRESHOLD = 1500;
    const SHIPPING_FEE = 100;
    
    let shipping = (subtotal >= FREE_SHIP_THRESHOLD) ? 0 : SHIPPING_FEE;
    
    // Shipping Bar Progress
    const barEl = document.getElementById('progress-fill');
    const msgEl = document.getElementById('shipping-msg');

    if (barEl && msgEl) {
        let percentage = Math.min((subtotal / FREE_SHIP_THRESHOLD) * 100, 100);
        barEl.style.width = percentage + "%";

        if (subtotal >= FREE_SHIP_THRESHOLD) {
            msgEl.innerHTML = `🎉 You've unlocked <span style="color:#2ecc71">FREE SHIPPING!</span>`;
            barEl.style.background = "#2ecc71";
        } else {
            let diff = FREE_SHIP_THRESHOLD - subtotal;
            msgEl.innerHTML = `Spend <strong>₹${diff}</strong> more for <span style="color:#000">FREE SHIPPING</span>`;
            barEl.style.background = "#000";
        }
    }

    // Tax & Total
    let tax = Math.round(subtotal * 0.02);
    let total = subtotal + shipping + tax;

    // UI Updates
    document.getElementById('subtotal-price').innerText = `₹${subtotal}`;
    document.getElementById('tax-cost').innerText = `₹${tax}`;
    document.getElementById('total-price').innerText = `₹${total}`;
    
    const shipDisplay = document.getElementById('shipping-cost');
    if(shipDisplay) {
        shipDisplay.innerHTML = (shipping === 0) ? `<span style="color:#2ecc71; font-weight:700">FREE</span>` : `₹${shipping}`;
    }
}

// 5. WINDOW ACTIONS (Fixes 'function not found' error)
window.changeQty = function(index, change) {
    if(cart[index]) {
        let newQty = cart[index].quantity + change;
        if(newQty >= 1 && newQty <= 10) {
            cart[index].quantity = newQty;
            saveCartData();
        }
    }
}

window.removeItem = function(index) {
    // SweetAlert ya Confirm box (Optional)
    if(confirm("Are you sure you want to remove this item?")) {
        cart.splice(index, 1);
        saveCartData();
    }
}

function saveCartData() {
    localStorage.setItem('myCart', JSON.stringify(cart));
    loadCart(); // UI refresh
    if(typeof updateCartCountGlobal === 'function') updateCartCountGlobal();
}

// 6. RECOMMENDATIONS (Random Products)
function renderRecommendations() {
    const container = document.getElementById('rec-container');
    if(!container) return;
    
    let productsToShow = [];
    if(allProductsData.length > 0) {
        const cartIds = cart.map(c => c.id);
        const available = allProductsData.filter(p => !cartIds.includes(p.id));
        productsToShow = available.sort(() => 0.5 - Math.random()).slice(0, 4);
    }

    container.innerHTML = productsToShow.map(p => `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${p.id}'" style="cursor:pointer;">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h4>${p.name}</h4>
                <p class="price">₹${p.price}</p>
            </div>
        </div>
    `).join('');
}