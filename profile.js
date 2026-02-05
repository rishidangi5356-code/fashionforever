// =========================================
//  PROFILE DASHBOARD LOGIC
// =========================================

// Default User Data (If nothing is saved)
const defaultUser = {
    name: "Rishi Dangi",
    email: "rishi@fashionforever.com",
    phone: "+91 8839697440",
    city: "Bhopal",
    image: "https://ui-avatars.com/api/?name=Rishi+Dangi&background=000&color=fff",
    addresses: [
        { id: 1, type: "HOME", details: "124, Kolar Road", city: "Bhopal", pincode: "462003" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadAddresses();
    updateCartCountGlobal();

    // Edit Profile Logic
    document.getElementById('edit-btn').addEventListener('click', toggleEditMode);
    document.getElementById('cancel-btn').addEventListener('click', toggleEditMode);
    document.getElementById('profile-form').addEventListener('submit', saveProfile);
    
    // Address Modal Logic
    document.getElementById('address-form').addEventListener('submit', addNewAddress);
    
    // Image Upload
    document.getElementById('file-upload').addEventListener('change', handleImageUpload);
});

// 1. LOAD USER DATA
function loadUserProfile() {
    let user = JSON.parse(localStorage.getItem('ff_user_profile')) || defaultUser;
    
    // Sidebar
    document.getElementById('sidebar-name').innerText = user.name;
    document.getElementById('sidebar-avatar').src = user.image;

    // Form
    document.getElementById('inp-name').value = user.name;
    document.getElementById('inp-email').value = user.email;
    document.getElementById('inp-phone').value = user.phone;
    document.getElementById('inp-city').value = user.city;
    document.getElementById('main-avatar').src = user.image;
}

// 2. EDIT MODE TOGGLE
function toggleEditMode() {
    const inputs = document.querySelectorAll('#profile-form input');
    const actions = document.getElementById('save-actions');
    const editBtn = document.getElementById('edit-btn');
    const uploadLabel = document.getElementById('upload-label');
    const fileInput = document.getElementById('file-upload');

    const isDisabled = inputs[0].disabled;

    inputs.forEach(inp => inp.disabled = !isDisabled);
    actions.style.display = isDisabled ? 'flex' : 'none';
    editBtn.style.display = isDisabled ? 'none' : 'block';
    
    // Enable Image Upload
    if(isDisabled) {
        uploadLabel.style.pointerEvents = "auto"; 
        uploadLabel.style.opacity = "1";
        fileInput.disabled = false;
    } else {
        uploadLabel.style.pointerEvents = "none";
        uploadLabel.style.opacity = "0.5";
        fileInput.disabled = true;
    }
}

// 3. SAVE PROFILE
function saveProfile(e) {
    e.preventDefault();
    
    let user = JSON.parse(localStorage.getItem('ff_user_profile')) || defaultUser;

    user.name = document.getElementById('inp-name').value;
    user.phone = document.getElementById('inp-phone').value;
    user.email = document.getElementById('inp-email').value;
    user.city = document.getElementById('inp-city').value;
    // Image is saved in handleImageUpload

    localStorage.setItem('ff_user_profile', JSON.stringify(user));
    
    alert("Profile Updated Successfully!");
    toggleEditMode();
    loadUserProfile(); // Refresh UI
}

// 4. IMAGE UPLOAD
function handleImageUpload(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('main-avatar').src = event.target.result;
            
            // Save immediately to local storage object
            let user = JSON.parse(localStorage.getItem('ff_user_profile')) || defaultUser;
            user.image = event.target.result;
            localStorage.setItem('ff_user_profile', JSON.stringify(user));
            
            // Update Sidebar too
            document.getElementById('sidebar-avatar').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 5. ADDRESS MANAGEMENT
function loadAddresses() {
    let user = JSON.parse(localStorage.getItem('ff_user_profile')) || defaultUser;
    const container = document.getElementById('address-list');
    
    container.innerHTML = user.addresses.map((addr, index) => `
        <div class="address-card">
            <span class="addr-tag">${addr.type}</span>
            <p class="addr-details">${addr.details}<br>${addr.city} - ${addr.pincode}</p>
            <div class="addr-actions">
                <span class="addr-btn">Edit</span>
                <span class="addr-btn delete" onclick="deleteAddress(${index})">Delete</span>
            </div>
        </div>
    `).join('');
}

function deleteAddress(index) {
    if(confirm("Delete this address?")) {
        let user = JSON.parse(localStorage.getItem('ff_user_profile')) || defaultUser;
        user.addresses.splice(index, 1);
        localStorage.setItem('ff_user_profile', JSON.stringify(user));
        loadAddresses();
    }
}

// Modal Functions
window.openAddressModal = function() {
    document.getElementById('address-modal').classList.add('active');
}
window.closeAddressModal = function() {
    document.getElementById('address-modal').classList.remove('active');
}

function addNewAddress(e) {
    e.preventDefault();
    
    const newAddr = {
        type: document.getElementById('addr-type').value,
        details: document.getElementById('addr-details').value,
        city: document.getElementById('addr-city').value,
        pincode: document.getElementById('addr-pincode').value
    };

    let user = JSON.parse(localStorage.getItem('ff_user_profile')) || defaultUser;
    user.addresses.push(newAddr);
    localStorage.setItem('ff_user_profile', JSON.stringify(user));
    
    closeAddressModal();
    loadAddresses();
    e.target.reset();
}

// LOGOUT
window.logoutUser = function() {
    if(confirm("Are you sure you want to logout?")) {
        // Optional: Clear user session logic here
        window.location.href = 'index.html';
    }
}

function updateCartCountGlobal() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = count;
}