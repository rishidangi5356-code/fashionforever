// 1. FAQ ACCORDION LOGIC
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');

        // Close others
        document.querySelectorAll('.faq-answer').forEach(item => {
            if(item !== answer) {
                item.style.maxHeight = null;
                item.previousElementSibling.querySelector('i').classList.remove('fa-minus');
                item.previousElementSibling.querySelector('i').classList.add('fa-plus');
            }
        });

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        }
    });
});

// 2. WHATSAPP FORM HANDLER
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Get Values
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value; // NEW FIELD
    const email = document.getElementById('c-email').value;
    const subject = document.getElementById('c-subject').value;
    const message = document.getElementById('c-message').value;

    // 2. Format Message for WhatsApp
    // %0a creates a new line
    const whatsappMessage = `*NEW CUSTOMER INQUIRY* %0a%0a` + 
                            `*Name:* ${name} %0a` +
                            `*Mobile:* ${phone} %0a` +  // NEW LINE IN MESSAGE
                            `*Email:* ${email} %0a` +
                            `*Subject:* ${subject} %0a` +
                            `*Message:* ${message}`;

    // 3. Your Phone Number (Country Code + Number)
    const phoneNumber = "918839697440"; 

    // 4. Create WhatsApp URL
    const url = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

    // 5. Open WhatsApp
    window.open(url, '_blank').focus();

    // Optional: Reset form
    contactForm.reset();
});
// =========================================
//  CONTACT PAGE LOGIC
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FAQ ACCORDION LOGIC
    const faqs = document.querySelectorAll('.faq-question');
    
    faqs.forEach(faq => {
        faq.addEventListener('click', function() {
            // Close all others
            const activeItem = document.querySelector('.faq-item.active');
            if(activeItem && activeItem !== this.parentElement) {
                activeItem.classList.remove('active');
            }
            
            // Toggle clicked
            this.parentElement.classList.toggle('active');
        });
    });

});

// 2. SEND FORM TO WHATSAPP
function sendToWhatsapp(e) {
    e.preventDefault();

    // Get Values
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const subject = document.getElementById('c-subject').value;
    const message = document.getElementById('c-message').value.trim();

    if(!name || !phone || !message) {
        alert("Please fill in the required fields.");
        return;
    }

    // Format Message for WhatsApp
    // %0a creates a new line
    const whatsappMsg = `*New Inquiry from Website* %0a%0a` + 
                        `👤 *Name:* ${name} %0a` +
                        `📞 *Phone:* ${phone} %0a` +
                        `📧 *Email:* ${email} %0a` +
                        `📌 *Subject:* ${subject} %0a%0a` +
                        `📝 *Message:* %0a${message}`;

    // Your Phone Number (No spaces, include country code)
    const myNumber = "918839697440"; 

    // Create Link
    const url = `https://wa.me/${myNumber}?text=${whatsappMsg}`;

    // Open in new tab
    window.open(url, '_blank');
    
    // Optional: Reset form
    document.getElementById('contact-form').reset();
}