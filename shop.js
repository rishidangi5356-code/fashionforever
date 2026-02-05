// =========================================
//  SHOP LOGIC (FILTER, SORT, SEARCH) - FINAL
// ========================================

let allProducts = []; // Global array

// 1. DATA SYNC LOGIC (Wait for products.js)
window.addEventListener('dataReady', () => {
    console.log("📥 Shop Page: Data Ready Event Received");
    allProducts = window.allProducts; // Sync global data
    applyInitialFilters(); // Filters check karo aur display karo
});

// Agar data pehle se load ho chuka hai (Navigation ke time)
if (window.allProducts && window.allProducts.length > 0) {
    allProducts = window.allProducts;
    setTimeout(applyInitialFilters, 100); 
}

// 2. APPLY FILTERS FROM URL (e.g., ?category=men)
function applyInitialFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const typeParam = urlParams.get('type');
    const searchParam = urlParams.get('search');

    // Set Category Radio
    if (categoryParam) {
        const radio = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
        if (radio) radio.checked = true;
    }

    // Set Type Checkbox
    if (typeParam) {
        const checkbox = document.querySelector(`.type-filter[value="${typeParam}"]`);
        if (checkbox) checkbox.checked = true;
    }

    // Set Search Box
    if (searchParam) {
        const sInput = document.getElementById('search-input');
        if(sInput) sInput.value = searchParam;
    }

    filterProducts(); // Run Filter initial load par
    setupEventListeners(); // Listeners attach karo
}

// 3. MAIN FILTER FUNCTION
function filterProducts() {
    if (!allProducts || allProducts.length === 0) return;

    // A. Get Filter Values
    const categoryEl = document.querySelector('input[name="category"]:checked');
    const selectedCategory = categoryEl ? categoryEl.value : 'all';
    
    const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
    
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect ? sortSelect.value : "default";

    // B. Filter Loop
    let filtered = allProducts.filter(product => {
        // Category Filter
        let categoryMatch = (selectedCategory === 'all') || 
                           (String(product.category).toLowerCase() === selectedCategory.toLowerCase());
        
        // Type Filter
        let typeMatch = (selectedTypes.length === 0) || 
                        selectedTypes.includes(String(product.type).toLowerCase());
        
        // Search Filter
        let searchMatch = String(product.name).toLowerCase().includes(searchTerm) || 
                          String(product.type).toLowerCase().includes(searchTerm);

        return categoryMatch && typeMatch && searchMatch;
    });

    // C. Sort Logic
    if (sortValue === 'low-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-low') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'newest') {
        filtered.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    // D. Update UI
    renderGrid(filtered);
    
    // Update Title
    const titleEl = document.getElementById('page-title');
    if(titleEl) {
        titleEl.innerText = selectedCategory !== 'all' ? selectedCategory.toUpperCase() + " COLLECTION" : "ALL COLLECTION";
    }
}

// 4. RENDER GRID (Dono function ko merge kar diya hai)
function renderGrid(products) {
    const container = document.getElementById('product-container') || document.getElementById('product-grid');
    const countEl = document.getElementById('result-count') || document.querySelector('.showing-count');
    
    if (!container) return;
    
    container.innerHTML = '';
    if(countEl) countEl.innerText = `Showing ${products.length} products`;

    if (products.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 50px;">
                                    <h3>No products found matching your filters.</h3>
                               </div>`;
        return;
    }

    container.innerHTML = products.map(p => {
        // Badge Logic
        let badgeHTML = '';
        if(p.isSale) {
            badgeHTML = `<span class="badge" style="background:#d32f2f">SALE</span>`;
        } else if (p.stock < 5 && p.stock > 0) {
            badgeHTML = `<span class="badge" style="background:#ff9800">Low Stock</span>`;
        }

        return `
            <div class="product-card" onclick="window.location.href='product-details.html?id=${p.id}'">
                <div class="product-image">
                    ${badgeHTML}
                    <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}">
                    <button class="btn-quick-add" onclick="addToCartQuick(event, '${p.id}', '${p.name}', ${p.price}, '${p.image}')">
                        <i class="fas fa-shopping-bag"></i> Add
                    </button>
                </div>
                <div class="product-info">
                    <p class="category">${p.category}</p>
                    <h3 class="name">${p.name}</h3>
                    <div class="price-box">
                        <span class="price">₹${p.price}</span>
                        ${p.oldPrice > p.price ? `<span class="old-price">₹${p.oldPrice}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 5. EVENT LISTENERS
function setupEventListeners() {
    // Inputs change par filter chalao
    document.querySelectorAll('input[type=radio], input[type=checkbox]').forEach(el => {
        el.addEventListener('change', filterProducts);
    });
    
    const sortSelect = document.getElementById('sort-select');
    if(sortSelect) sortSelect.addEventListener('change', filterProducts);
    
    const searchInput = document.getElementById('search-input');
    if(searchInput) searchInput.addEventListener('input', filterProducts);

    // Mobile Sidebar Toggle
    const filterBtn = document.getElementById('mobile-filter-btn');
    const sidebar = document.getElementById('filter-sidebar');
    const overlay = document.getElementById('filter-overlay');
    const closeBtn = document.getElementById('close-filter');
    const applyBtn = document.getElementById('apply-filters-btn');

    if (filterBtn && sidebar) {
        filterBtn.onclick = () => {
            sidebar.classList.add('active');
            if(overlay) overlay.classList.add('active');
        };

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            if(overlay) overlay.classList.remove('active');
        };

        if(closeBtn) closeBtn.onclick = closeSidebar;
        if(overlay) overlay.onclick = closeSidebar;
        if(applyBtn) applyBtn.onclick = closeSidebar;
    }
}

// Quick Add Function
window.addToCartQuick = function(event, id, name, price, image) {
    event.stopPropagation();
    const product = { id, name, price, image, size: "M", quantity: 1 };
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    
    const existing = cart.find(item => item.id === id);
    if(existing) existing.quantity++;
    else cart.push(product);
    
    localStorage.setItem('myCart', JSON.stringify(cart));
    
    // Global function check
    if(typeof updateCartCountGlobal === 'function') updateCartCountGlobal();
    
    alert(`${name} added to cart!`);
}
