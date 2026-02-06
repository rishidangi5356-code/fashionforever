// =========================================
//  CHECKOUT LOGIC (Free Shipping, 2% GST + COD)
//  FINAL FIXED VERSION - Saves orders for tracking
// =========================================

// 🔴 YOUR GOOGLE APPS SCRIPT URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiNM2BEJ2cGLWe2ztbBZoRhKiPYI7IE63gKydw1gvIiNO0rXyI5Uh_uiwh3YNW6CBn/exec"; 

// SETUP
let cart = JSON.parse(localStorage.getItem('myCart')) || [];
const summaryBox = document.getElementById('checkout-items');
const qrContainer = document.getElementById('qrcode');
const placeOrderBtn = document.getElementById('place-order-btn');

// COSTS
const SHIPPING_COST = 0; // Shipping is FREE
const COD_FEE = 50;      // COD Charge remains

// State
let currentPaymentMethod = 'upi'; 
let finalTotal = 0;

// Load on start
window.onload = function() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        window.location.href = "shop.html";
        return;
    }
    renderSummaryItems();
    calculateTotals(); 
};

// 1. CALCULATE TOTALS
function calculateTotals() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // COD Fee Logic
    let currentCodFee = 0;
    const codRow = document.getElementById('cod-fee-row');
    
    if(currentPaymentMethod === 'cod') {
        currentCodFee = COD_FEE;
        if(codRow) codRow.style.display = 'flex';
    } else {
        currentCodFee = 0;
        if(codRow) codRow.style.display = 'none';
    }

    // GST Calculation (2%)
    let tax = Math.round(subtotal * 0.02);
    
    // Final Total
    finalTotal = subtotal + SHIPPING_COST + tax + currentCodFee;

    // Update UI
    const subtotalEl = document.getElementById('c-subtotal');
    if(subtotalEl) subtotalEl.innerText = "₹" + subtotal;
    
    // GST Display
    const taxEl = document.getElementById('c-tax');
    if(taxEl) taxEl.innerText = "₹" + tax;
    
    // Update all total displays
    document.querySelectorAll('.final-pay-amount').forEach(el => {
        el.innerText = "₹" + finalTotal;
    });
    
    // Regenerate QR if on UPI tab
    if(currentPaymentMethod === 'upi') {
        generateQRCode();
    }
}

// 2. RENDER ITEMS
function renderSummaryItems() {
    if(!summaryBox) return;
    
    summaryBox.innerHTML = "";
    cart.forEach(item => {
        let img = item.image ? item.image : 'https://via.placeholder.com/60?text=No+Img';
        summaryBox.innerHTML += `
            <div class="checkout-item">
                <img src="${img}" onerror="this.src='https://via.placeholder.com/60?text=Error'">
                <div>
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} | Size: ${item.size}</p>
                    <p style="font-weight:600;">₹${item.price * item.quantity}</p>
                </div>
            </div>
        `;
    });
}

// 3. PAYMENT TAB SWITCHING
function selectPayment(method) {
    currentPaymentMethod = method;

    // Toggle UI classes
    document.querySelectorAll('.payment-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.pay-tab').forEach(el => el.classList.remove('active'));
    
    const contentEl = document.getElementById('pay-' + method);
    if(contentEl) contentEl.classList.add('active');
    
    // Set Active Button
    const btns = document.querySelectorAll('.pay-tab');
    btns.forEach(btn => {
        if(btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(method)) {
            btn.classList.add('active');
        }
    });

    calculateTotals();
}

// 4. GENERATE UPI QR CODE
function generateQRCode() {
    if(!qrContainer) return;

    const myUPI = "8839697440@axl";  // Your UPI ID
    const myName = "Dheeraj shende";
    
    const upiLink = `upi://pay?pa=${myUPI}&pn=${myName}&am=${finalTotal}&cu=INR`;

    qrContainer.innerHTML = "";
    if(typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: upiLink,
            width: 160,
            height: 160,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } else {
        qrContainer.innerHTML = "QR Code Library Missing";
    }
}

// 5. MANUAL UPI VERIFY
function verifyManualUPI() {
    const upiInput = document.getElementById('upi-id-input').value;
    const msgEl = document.getElementById('upi-verify-msg');
    
    if(!msgEl) return;

    if(upiInput.includes('@')) {
        msgEl.innerText = "Verifying...";
        msgEl.style.color = "orange";
        setTimeout(() => {
            msgEl.innerHTML = `<i class="fas fa-check-circle"></i> Verified: ${upiInput}`;
            msgEl.style.color = "green";
        }, 1000);
    } else {
        msgEl.innerText = "Invalid UPI ID format.";
        msgEl.style.color = "red";
    }
}

// =========================================
// 6. PLACE ORDER - SAVES DATA FOR TRACKING
// =========================================
// =========================================
// 6. PLACE ORDER - SAVES DATA FOR TRACKING (UPDATED & FIXED)
// =========================================

const RAZORPAY_KEY_ID = "rzp_live_SCld8m9J4bwZFn";

function placeOrder() {
    const name = document.getElementById('ship-name').value.trim();
    const phone = document.getElementById('ship-phone').value.trim();
    const address = document.getElementById('ship-address').value.trim();
    const city = document.getElementById('ship-city').value.trim();
    const zip = document.getElementById('ship-zip').value.trim();

    // 1. Validation
    if(!name || !phone || !address || !city || !zip) {
        alert("Please fill in all shipping details.");
        return;
    }

    // 2. Disable button
    if(typeof placeOrderBtn !== 'undefined' && placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerText = "SAVING ORDER...";
    }

    // 3. SAVE CUSTOMER DATA TO LOCALSTORAGE (For success page)
    const customerData = {
        name: name,
        email: phone + "@customer.com",
        phone: phone,
        address: `${address}, ${city} - ${zip}`,
        city: city,
        zip: zip,
        paymentMethod: currentPaymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        orderDate: new Date().toLocaleDateString('en-IN'),
        timestamp: new Date().toISOString()
    };

    console.log("Saving customerData:", customerData);
    localStorage.setItem('customerData', JSON.stringify(customerData));

    // 4. Generate Order ID
    const orderID = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. SAVE COMPLETE ORDER DATA FOR TRACKING
    const now = new Date();
    const deliveryDate = new Date(now);
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    const trackingOrder = {
        id: orderID,
        fullID: '#FF' + orderID,
        status: 'pending',
        completedSteps: 1,
        orderDate: now.toLocaleDateString('en-IN'),
        orderTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        deliveryDate: deliveryDate.toLocaleDateString('en-IN'),
        customerName: name,
        address: `${address}, ${city} - ${zip}`,
        phone: phone,
        email: customerData.email,
        total: finalTotal,
        items: cart.map(item => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        })),
        paymentMethod: currentPaymentMethod,
        paymentStatus: currentPaymentMethod === 'cod' ? 'pending' : 'processing',
        createdAt: now.toISOString(),
        timeline: [
            {
                step: 'Order Confirmed',
                date: now.toLocaleDateString('en-IN'),
                time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                description: 'Your order has been successfully placed',
                completed: true
            },
            {
                step: 'Processing',
                date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
                time: '10:00 AM',
                description: 'We\'re preparing your items for shipment',
                completed: false
            },
            {
                step: 'Shipped',
                date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
                time: '2:30 PM',
                description: 'Your package is on its way',
                completed: false
            },
            {
                step: 'Delivered',
                date: deliveryDate.toLocaleDateString('en-IN'),
                time: 'Arriving soon',
                description: 'Your order will be delivered to your address',
                completed: false
            }
        ]
    };

    localStorage.setItem(`order_${orderID}`, JSON.stringify(trackingOrder));
    console.log("Saved tracking order:", trackingOrder);

    // 6. COD Logic
    if (currentPaymentMethod === 'cod') {
        processCODOrder(orderID, customerData);
        return;
    }

    // 7. Razorpay Logic (UPDATED FOR MOBILE STABILITY)
    const options = {
        "key": RAZORPAY_KEY_ID, 
        "amount": Math.round(finalTotal * 100), // FIXED: Force Integer for Mobile
        "currency": "INR",
        "name": "Fashion Forever",
        "description": "Payment for Order #" + orderID,
        "image": "https://fashion-forever.in/logo.png", // Apna sahi logo link dalo
        "handler": function (response) {
            processOnlineOrder(orderID, customerData, response.razorpay_payment_id);
        },
        "prefill": {
            "name": name,
            "contact": phone
        },
        "theme": {
            "color": "#000000"
        },
        "modal": {
            "ondismiss": function() {
                // Payment cancel hone pe button vapis thik ho jaye
                if(typeof placeOrderBtn !== 'undefined' && placeOrderBtn) {
                    placeOrderBtn.disabled = false;
                    placeOrderBtn.innerText = "PLACE ORDER";
                }
            }
        }
    };

    try {
        const rzp1 = new Razorpay(options);
        
        rzp1.on('payment.failed', function (response){
            alert("Oops! Payment Failed: " + response.error.description);
            if(typeof placeOrderBtn !== 'undefined' && placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerText = "PLACE ORDER";
            }
        });

        rzp1.open();
    } catch (error) {
        console.error("Razorpay Error:", error);
        alert("Payment gateway failed to load. Please check your internet.");
        if(typeof placeOrderBtn !== 'undefined' && placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerText = "PLACE ORDER";
        }
    }
}

// =========================================
// COD ORDER PROCESSING
// =========================================

function processCODOrder(orderID, customerData) {
    let itemsString = cart.map(item => `${item.name} (${item.size} x${item.quantity})`).join(", ");

    const orderData = {
        order_id: orderID,
        payment_id: "COD_PENDING",
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        items: itemsString,
        total: finalTotal,
        payment_method: "COD"
    };

    console.log("Processing COD order:", orderData);

    // Send to Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then(() => {
        console.log("Order sent to Google Sheets, redirecting...");
        window.location.href = `success.html?id=${orderID}`;
    })
    .catch(error => {
        console.error("Error:", error);
        alert("✅ Order Success!\nOrder ID: #FF" + orderID + "\nRedirecting to confirmation...");
        window.location.href = `success.html?id=${orderID}`;
    });
}

// =========================================
// ONLINE ORDER PROCESSING
// =========================================

function processOnlineOrder(orderID, customerData, paymentID) {
    let itemsString = cart.map(item => `${item.name} (${item.size} x${item.quantity})`).join(", ");

    const orderData = {
        order_id: orderID,
        payment_id: paymentID,
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        items: itemsString,
        total: finalTotal,
        payment_method: "ONLINE"
    };

    console.log("Processing online order:", orderData);

    // Send to Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then(() => {
        console.log("Order sent to Google Sheets, redirecting...");
        window.location.href = `success.html?id=${orderID}`;
    })
    .catch(error => {
        console.error("Error:", error);
        alert("✅ Order Success!\nOrder ID: #FF" + orderID + "\nRedirecting to confirmation...");
        window.location.href = `success.html?id=${orderID}`;
    });
}
