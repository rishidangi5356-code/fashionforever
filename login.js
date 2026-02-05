// ELEMENTS
const loginBox = document.getElementById('login-box');
const signupBox = document.getElementById('signup-box');
const forgotBox = document.getElementById('forgot-box');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotForm = document.getElementById('forgot-form');

// 1. SWITCH MODE FUNCTION (Login <-> Signup <-> Forgot)
function switchMode(mode) {
    // Hide all first
    loginBox.classList.remove('active');
    signupBox.classList.remove('active');
    forgotBox.classList.remove('active');

    // Show selected with delay for animation
    setTimeout(() => {
        if (mode === 'signup') {
            signupBox.classList.add('active');
        } else if (mode === 'forgot') {
            forgotBox.classList.add('active');
        } else {
            loginBox.classList.add('active');
        }
    }, 200);
}

// 2. HANDLE SIGNUP
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const pass = document.getElementById('reg-pass').value;

    const userProfile = {
        name: name,
        email: email,
        phone: phone,
        password: pass,
        dob: "",
        gender: "Male",
        location: "",
        avatar: "",
        addresses: []
    };

    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('isLoggedIn', 'true');
    
    alert("Welcome to the club, " + name + "!");
    window.location.href = "profile.html";
});

// 3. HANDLE LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    const savedUser = JSON.parse(localStorage.getItem('userProfile'));

    if (savedUser && savedUser.email === email && savedUser.password === pass) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "profile.html";
    } else {
        alert("Incorrect Email or Password. Please try again.");
    }
});

// 4. HANDLE FORGOT PASSWORD (NEW)
forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('forgot-email').value;
    const newPass = document.getElementById('new-pass').value;

    // Get current user data
    let savedUser = JSON.parse(localStorage.getItem('userProfile'));

    // Check if user exists and email matches
    if (savedUser && savedUser.email === email) {
        // Update Password
        savedUser.password = newPass;
        
        // Save back to LocalStorage
        localStorage.setItem('userProfile', JSON.stringify(savedUser));
        
        alert("Password Reset Successful! Please login with your new password.");
        switchMode('login'); // Go back to login screen
    } else {
        alert("This email is not registered with us.");
    }
});