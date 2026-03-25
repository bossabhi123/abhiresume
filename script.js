import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCnKvNB4JBzW8PhUyQCbWJgr_-wCsFqDfM",
    authDomain: "abhi-resume-dd56f.firebaseapp.com",
    projectId: "abhi-resume-dd56f",
    storageBucket: "abhi-resume-dd56f.firebasestorage.app",
    messagingSenderId: "995622174674",
    appId: "1:995622174674:web:293d2b57b1ff40fbcd920b",
    measurementId: "G-J6TQR9BMYF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });

// --- LEAD CAPTURE (FORMSPREE) ---
async function logLead(name, email, phone, method) {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Email", email);
    formData.append("Phone", phone);
    formData.append("Method", method);
    formData.append("_subject", "🚀 Portfolio Unlock: " + name);

    try {
        await fetch("https://formspree.io/f/xyknvwdg", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
    } catch (e) { console.error("Log failed"); }
}

function unlockSite(name) {
    const finalName = name || localStorage.getItem('visitor_name') || "Recruiter";
    localStorage.setItem('abhi_unlocked', 'true');
    localStorage.setItem('visitor_name', finalName);

    document.getElementById('auth-gate').style.display = 'none';
    document.getElementById('protected-content').style.display = 'block';
    document.getElementById('protected-content').classList.add('unlocked-animation');
    
    showToast(finalName);
    reveal(); 
}

function showToast(name) {
    const toast = document.getElementById('welcome-toast');
    document.getElementById('toast-name').textContent = name;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// Google Login
async function handleGoogleLogin() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user; 
        await logLead(user.displayName, user.email, "N/A", "GOOGLE_AUTH");
        unlockSite(user.displayName); // Fixed missing parameter!
    } catch (error) { 
        console.error(error);
        alert("Google Sign-in failed."); 
    }
}

// SMS Login
async function handleSendOTP() {
    const name = document.getElementById('visitor-name').value;
    const email = document.getElementById('visitor-email').value;
    const phone = "+91" + document.getElementById('visitor-phone').value.trim();
    if(!name || !email || phone.length < 13) return alert("Fill all fields.");
    
    try {
        window.confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
        document.getElementById('gate-step-1').style.display = 'none';
        document.getElementById('gate-step-2').style.display = 'block';
    } catch (e) { alert(e.message); }
}

async function handleVerifyOTP() {
    const code = document.getElementById('otp-code').value;
    const name = document.getElementById('visitor-name').value;
    const email = document.getElementById('visitor-email').value;
    const phone = "+91" + document.getElementById('visitor-phone').value.trim();

    try {
        await confirmationResult.confirm(code);
        await logLead(name, email, phone, "SMS_OTP");
        unlockSite(name);
    } catch (e) { alert("Invalid Code"); }
}

// UI LOGIC INITIALIZATION
if (localStorage.getItem('abhi_unlocked') === 'true') {
    unlockSite();
}

document.getElementById('google-signin-btn').onclick = handleGoogleLogin;
document.getElementById('send-otp-btn').onclick = handleSendOTP;
document.getElementById('verify-otp-btn').onclick = handleVerifyOTP;

function reveal() {
    document.querySelectorAll(".reveal").forEach(r => {
        if (r.getBoundingClientRect().top < window.innerHeight - 100) r.classList.add("active");
    });
}
window.addEventListener("scroll", reveal);

const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
    const root = document.documentElement;
    if (root.getAttribute('data-theme') === 'dark') {
        root.removeAttribute('data-theme');
        toggleBtn.textContent = '🌙';
    } else {
        root.setAttribute('data-theme', 'dark');
        toggleBtn.textContent = '☀️';
    }
});

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) e.preventDefault();
});

function updateFooterDate() {
    const date = document.getElementById('last-updated');
    if (date) date.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
updateFooterDate();

// --- MODAL & CONTACT FORM LOGIC ---
const modal = document.getElementById('contact-modal');
const floatingBtn = document.getElementById('floating-contact-btn');
const closeBtn = document.getElementById('close-modal-btn');

if (floatingBtn && modal) {
    floatingBtn.onclick = () => modal.classList.add('active');
    closeBtn.onclick = () => modal.classList.remove('active');
    
    // Close modal if clicking the background blur
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
}

const contactForm = document.getElementById('contact-form');
const formWrapper = document.getElementById('form-wrapper');
const successMessage = document.getElementById('success-message');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = "Sending... ⏳";
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formWrapper.classList.add('fade-out');
                setTimeout(() => {
                    formWrapper.style.display = 'none';
                    successMessage.style.display = 'block';
                    successMessage.classList.add('fade-in');
                    contactForm.reset();
                    
                    // Auto-close after 3 seconds and reset
                    setTimeout(() => {
                        modal.classList.remove('active');
                        setTimeout(() => {
                            formWrapper.classList.remove('fade-out');
                            successMessage.classList.remove('fade-in');
                            formWrapper.style.display = 'block';
                            successMessage.style.display = 'none';
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                        }, 500); // Wait for fade
                    }, 3000);
                }, 500);

            } else { throw new Error('Failed'); }
        } catch (error) {
            alert("Error sending message. Please try again.");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
