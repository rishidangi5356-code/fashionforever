// =========================================
//  SMART AI CHATBOT (ENGLISH ONLY - PRO VERSION)
//  Covers 500+ Variations of Questions
// =========================================

const chatWindow = document.getElementById('chat-window');
const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');

// 1. Toggle Chat Window
function toggleChat() {
    if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
        chatWindow.style.display = "flex";
        if(chatBody.innerHTML.trim() === "") {
            botReply("Hello! 👋 Welcome to Fashion Forever.\nI am your personal styling assistant. How can I help you today?");
        }
    } else {
        chatWindow.style.display = "none";
    }
}

// 2. Handle Enter Key
function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// 3. Send Message
function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage(text, 'user-msg');
    userInput.value = "";

    // Show Typing Indicator
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-msg');
    typingDiv.innerText = "Typing...";
    typingDiv.id = "typing-indicator";
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Delay for realism
    setTimeout(() => {
        if(document.getElementById('typing-indicator')) {
            document.getElementById('typing-indicator').remove();
        }
        getSmartResponse(text);
    }, 600); 
}

// 4. Add Message to UI
function addMessage(text, className) {
    const div = document.createElement('div');
    div.classList.add('message', className);
    div.innerHTML = text.replace(/\n/g, "<br>");
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(text) {
    addMessage(text, 'bot-msg');
}

// ============================================
//  5. THE KNOWLEDGE BASE (ENGLISH ONLY)
// ============================================

function getSmartResponse(input) {
    let text = input.toLowerCase().trim();

    // --- 1. GREETINGS & SMALL TALK ---
    if (match(text, ['hi', 'hello', 'hey', 'good morning', 'good evening', 'yo', 'sup', 'greetings'])) {
        const answers = [
            "Hello! Ready to explore the latest trends? 🌟",
            "Hi there! How can I assist you with your shopping today?",
            "Hey! Welcome to Fashion Forever. Looking for anything specific?"
        ];
        botReply(random(answers));
    }
    else if (match(text, ['how are you', 'how r u', 'doing', 'whats up'])) {
        botReply("I'm doing great! Just busy organizing our new collection. How are you doing? 😊");
    }
    else if (match(text, ['who are you', 'your name', 'bot', 'robot', 'human', 'real person'])) {
        botReply("I am the Fashion Forever Virtual Assistant. I'm here 24/7 to help you with orders, sizing, and styling!");
    }
    else if (match(text, ['thank', 'thx', 'appreciate', 'cool', 'great', 'awesome', 'nice'])) {
        botReply("You're very welcome! Happy Shopping! 🛍️");
    }
    else if (match(text, ['bye', 'goodbye', 'see you', 'later', 'cya'])) {
        botReply("Goodbye! Come back soon for more fashion updates. Stay stylish! ✨");
    }

    // --- 2. SHIPPING & TRACKING ---
    else if (match(text, ['track', 'where is my order', 'status', 'location', 'shipped', 'dispatch'])) {
        botReply("To track your order, please check the tracking link sent to your email or SMS. You can also view it in your 'My Account' section.");
    }
    else if (match(text, ['how long', 'time', 'days', 'arrive', 'reach', 'when', 'delivery', 'duration'])) {
        botReply("Standard delivery takes **3-5 business days**. Remote areas might take a bit longer. We strive to get your fashion to you fast! 🚚");
    }
    else if (match(text, ['shipping charge', 'delivery fee', 'cost', 'free delivery', 'shipping free'])) {
        botReply("Shipping is flat ₹100. However, if you order for **₹2500 or more**, shipping is completely **FREE**! 🎉");
    }
    else if (match(text, ['international', 'outside india', 'usa', 'uk', 'global'])) {
        botReply("Currently, we only ship within India. We are working on expanding globally soon! 🌏");
    }

    // --- 3. RETURNS, REFUNDS & CANCELLATION ---
    else if (match(text, ['return', 'exchange', 'replace', 'don\'t like', 'fit', 'size issue', 'back'])) {
        botReply("No stress! We have a **7-Day Easy Return & Exchange Policy**. If the fit isn't right, just go to 'My Orders' and request a return.");
    }
    else if (match(text, ['refund', 'money back', 'wallet'])) {
        botReply("Refunds are processed to your original payment method within 5-7 days after we receive the returned product.");
    }
    else if (match(text, ['cancel', 'stop order', 'mistake'])) {
        botReply("You can cancel your order if it hasn't been shipped yet. Please contact our support team immediately via WhatsApp.");
    }
    else if (match(text, ['damaged', 'broken', 'defect', 'torn', 'wrong product'])) {
        botReply("We are so sorry about that! Please send us a photo on WhatsApp immediately, and we will send a replacement free of charge.");
    }

    // --- 4. PAYMENT METHODS ---
    else if (match(text, ['pay', 'payment', 'method', 'card', 'credit', 'debit', 'wallet', 'net banking'])) {
        botReply("We accept all secure payment modes: **Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking**.");
    }
    else if (match(text, ['cod', 'cash', 'pay on delivery'])) {
        botReply("Yes, **Cash on Delivery (COD)** is available! Please note there is a small handling fee of ₹50 for COD orders.");
    }
    else if (match(text, ['safe', 'secure', 'trust'])) {
        botReply("Absolutely. Our website uses SSL encryption and trusted payment gateways. Your data is 100% safe with us. 🔒");
    }

    // --- 5. PRODUCTS & STOCK ---
    else if (match(text, ['men', 'guy', 'male', 'boy'])) {
        botReply("Our Men's Collection features trending Hoodies, Oversized Tees, Jeans, and Jackets. Check out the 'Men' category!");
    }
    else if (match(text, ['women', 'lady', 'girl', 'female'])) {
        botReply("Our Women's section has the latest Tops, Dresses, and Co-ords. Perfect for any occasion!");
    }
    else if (match(text, ['shoes', 'sneakers', 'footwear', 'boots'])) {
        botReply("Yes! We have a premium collection of Sneakers and Casual Shoes. They sell out fast, so grab yours soon.");
    }
    else if (match(text, ['accessories', 'watch', 'belt', 'wallet', 'cap', 'hat', 'sunglasses'])) {
        botReply("Don't forget to accessorize! We have Caps, Wallets, Sunglasses, and more to complete your look.");
    }
    else if (match(text, ['stock', 'available', 'sold out'])) {
        botReply("If a product is visible on the site, it is in stock. If it says 'Sold Out', we are working on restocking it soon!");
    }

    // --- 6. SIZING & QUALITY ---
    else if (match(text, ['size', 'chart', 'measure', 'fitting', 'large', 'small', 'medium'])) {
        botReply("We follow standard brand sizing (S, M, L, XL, XXL). If you prefer an oversized look (which is trending!), go one size up.");
    }
    else if (match(text, ['quality', 'fabric', 'material', 'cotton', 'polyester', 'wash'])) {
        botReply("We prioritize quality. Most of our tees are **100% Premium Cotton** or high-quality blends. They are soft, durable, and color-fast.");
    }

    // --- 7. DISCOUNTS & OFFERS ---
    else if (match(text, ['discount', 'coupon', 'code', 'promo', 'offer', 'sale', 'deal', 'cheap'])) {
        botReply("Current Offer: **Free Shipping on orders above ₹2500!** 🔥\nAlso, check our 'Sale' section for products up to 40% off.");
    }

    // --- 8. ABOUT BRAND / OWNER ---
    else if (match(text, ['owner', 'founder', 'ceo', 'creator', 'who made'])) {
        botReply("Fashion Forever was founded by **Mr. Rishi Dangi**. His vision is to make premium fashion accessible to everyone.");
    }
    else if (match(text, ['location', 'city', 'address', 'where', 'office'])) {
        botReply("We are headquartered in the beautiful city of **Bhopal, India**. 🇮🇳");
    }

    // --- 9. CONTACT & SUPPORT ---
    else if (match(text, ['contact', 'call', 'phone', 'mobile', 'whatsapp', 'email', 'support', 'help', 'talk'])) {
        botReply("You can reach our support team directly:\n📞 **WhatsApp:** +91 8962211576\n📧 **Email:** rishidangi5356@gmail.com\nWe usually reply within 2 hours!");
    }

    // --- FALLBACK (If no keyword matches) ---
    else {
        const fallbacks = [
            "I'm not sure I understood that correctly. 🤔\nYou can ask me about Shipping, Returns, Sizing, or our Collection.",
            "Could you rephrase that? I'm still learning! You can also ask to 'Contact Support'.",
            "I can help you shop! Try asking about 'Men's T-shirts' or 'Delivery Time'."
        ];
        botReply(random(fallbacks));
    }
}

// ============================================
//  HELPER FUNCTIONS
// ============================================

// Check if any keyword exists in the input text
function match(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

// Pick a random response from an array
function random(array) {
    return array[Math.floor(Math.random() * array.length)];
}