// =========================================
//  ORDER HISTORY LOGIC
// =========================================

// MOCK DATA: Simulate a Database
const ordersDB = [
    {
        id: "FF9021",
        date: "12 Jan 2026",
        status: "Delivered",
        total: 4498,
        items: [
            { name: "Men's Classic Hoodie", image: "image/hoodie.jpg", price: 2499, qty: 1 },
            { name: "Urban Denim Jeans", image: "image/jeans.jpg", price: 1999, qty: 1 }
        ],
        address: "124, Kolar Road, Bhopal, MP - 462003",
        tracking: [
            { date: "12 Jan, 2:00 PM", status: "Delivered", loc: "Bhopal" },
            { date: "12 Jan, 9:00 AM", status: "Out for Delivery", loc: "Bhopal Hub" },
            { date: "11 Jan, 6:00 PM", status: "Arrived at Facility", loc: "Indore" },
            { date: "10 Jan, 10:00 AM", status: "Shipped", loc: "Mumbai Warehouse" }
        ]
    },
    {
        id: "FF8800",
        date: "Today",
        status: "Processing",
        total: 3499,
        items: [
            { name: "Pro Running Sneakers", image: "image/mensports.png", price: 3499, qty: 1 }
        ],
        address: "Office 202, MP Nagar, Bhopal",
        tracking: [
            { date: "Today, 4:00 PM", status: "Order Placed", loc: "Online" },
            { date: "Today, 4:05 PM", status: "Confirmed", loc: "System" }
        ]
    },
    {
        id: "FF7550",
        date: "10 Dec 2025",
        status: "Cancelled",
        total: 1299,
        items: [
            { name: "Slim Fit Cargo Pants", image: "image/menbottom.png", price: 1299, qty: 1 }
        ],
        address: "124, Kolar Road, Bhopal",
        tracking: []
    },
    {
        id: "FF7010",
        date: "05 Dec 2025",
        status: "Delivered",
        total: 1899,
        items: [
            { name: "Classic Brown Loafers", image: "image/menac.png", price: 1899, qty: 1 }
        ],
        address: "124, Kolar Road, Bhopal",
        tracking: [
            { date: "08 Dec, 10:00 AM", status: "Delivered", loc: "Bhopal" }
        ]
    }
];

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    updateCartCountGlobal();
    renderOrders(ordersDB);
    
    // Search Listener
    document.getElementById('order-search').addEventListener('keyup', (e) => {
        handleSearch(e.target.value);
    });
});

// 1. RENDER ORDERS
function renderOrders(data) {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';

    if(data.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#888;">No orders found.</div>`;
        return;
    }

    data.forEach(order => {
        // Status Class
        let statusClass = '';
        if(order.status === 'Delivered') statusClass = 'status-delivered';
        else if(order.status === 'Cancelled') statusClass = 'status-cancelled';
        else statusClass = 'status-processing';

        // Thumbnails Logic (Show max 3)
        let thumbsHTML = order.items.slice(0, 3).map(item => 
            `<img src="${item.image}" class="o-thumb-img" alt="img">`
        ).join('');
        
        if(order.items.length > 3) {
            thumbsHTML += `<div class="o-more-count">+${order.items.length - 3}</div>`;
        }

        // Main Item Name (First item + count)
        const mainItemName = order.items[0].name + (order.items.length > 1 ? ` + ${order.items.length - 1} more` : '');

        // Actions Logic
        let actionsHTML = `<button class="btn-sm-outline" onclick="openDetails('${order.id}')">View Details</button>`;
        
        if(order.status === 'Delivered') {
            actionsHTML += `<button class="btn-sm-black" onclick="buyAgain('${order.id}')">Buy Again</button>`;
        } else if(order.status === 'Processing') {
            actionsHTML += `<button class="btn-sm-black" onclick="openTrackModal('${order.id}')">Track</button>`;
        } else if(order.status === 'Cancelled') {
            actionsHTML += `<button class="btn-sm-outline" style="color:red; border-color:red;" disabled>Cancelled</button>`;
        }

        const html = `
            <div class="order-card">
                <div class="o-header">
                    <div>
                        <div class="o-id">#${order.id}</div>
                        <div class="o-date">Ordered on ${order.date}</div>
                    </div>
                    <div class="o-status ${statusClass}">${order.status}</div>
                </div>
                <div class="o-body">
                    <div class="o-info">
                        <div class="o-thumbs">${thumbsHTML}</div>
                        <div class="o-text">
                            <h4>${mainItemName}</h4>
                            <p>Total: ₹${order.total}</p>
                        </div>
                    </div>
                    <div class="o-actions">
                        ${actionsHTML}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// 2. FILTER LOGIC
function filterOrders(status) {
    currentFilter = status.toLowerCase();
    
    // Update Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if(status === 'all') {
        renderOrders(ordersDB);
    } else {
        const filtered = ordersDB.filter(o => o.status.toLowerCase() === currentFilter);
        renderOrders(filtered);
    }
}

// 3. SEARCH LOGIC
function handleSearch(query) {
    const term = query.toLowerCase();
    const filtered = ordersDB.filter(o => 
        o.id.toLowerCase().includes(term) || 
        o.items.some(i => i.name.toLowerCase().includes(term))
    );
    renderOrders(filtered);
}

// 4. MODAL: ORDER DETAILS
window.openDetails = function(id) {
    const order = ordersDB.find(o => o.id === id);
    if(!order) return;

    document.getElementById('modal-order-id').innerText = `#${order.id}`;
    document.getElementById('modal-address').innerText = order.address;
    
    // Calc Tax
    const tax = Math.round(order.total * 0.03);
    const subtotal = order.total - tax; // Approx breakdown
    
    document.getElementById('modal-subtotal').innerText = `₹${subtotal}`;
    document.getElementById('modal-tax').innerText = `₹${tax}`;
    document.getElementById('modal-total').innerText = `₹${order.total}`;

    // Items
    const itemsContainer = document.getElementById('modal-items-list');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="modal-product-item">
            <img src="${item.image}" class="mp-img">
            <div class="mp-info">
                <h5>${item.name}</h5>
                <p>Qty: ${item.qty} | ₹${item.price}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('details-modal').classList.add('active');
}

// 5. MODAL: TRACKING
window.openTrackModal = function(id) {
    const order = ordersDB.find(o => o.id === id);
    if(!order) return;

    document.getElementById('track-order-id').innerText = `#${order.id}`;
    document.getElementById('track-est-date').innerText = "Arriving Soon";

    const container = document.getElementById('tracking-timeline');
    
    // Generate Timeline
    // If no tracking, show pending
    if(!order.tracking || order.tracking.length === 0) {
        container.innerHTML = `<p style="padding:10px;">Tracking information not available yet.</p>`;
    } else {
        container.innerHTML = order.tracking.map((step, index) => `
            <div class="tl-step ${index === 0 ? 'current' : 'completed'}">
                <div class="tl-date">${step.date}</div>
                <div class="tl-status">${step.status}</div>
                <div class="tl-loc">${step.loc}</div>
            </div>
        `).join('');
    }

    document.getElementById('tracking-modal').classList.add('active');
}

// 6. BUY AGAIN (Add to Cart)
window.buyAgain = function(id) {
    const order = ordersDB.find(o => o.id === id);
    if(!order) return;

    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    
    // Add all items from order to cart
    order.items.forEach(item => {
        // Check duplicates
        const existing = cart.find(c => c.name === item.name);
        if(existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: Date.now() + Math.random(), // New ID
                name: item.name,
                price: item.price,
                image: item.image,
                size: "M", // Default
                quantity: 1
            });
        }
    });

    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartCountGlobal();
    
    // Toast
    const toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// UTILS
window.closeModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function updateCartCountGlobal() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = count;
}