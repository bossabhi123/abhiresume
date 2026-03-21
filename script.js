// 1. Dark Mode Toggle
const toggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

toggleBtn.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        rootElement.removeAttribute('data-theme');
        toggleBtn.textContent = '🌙'; // Shows moon in light mode
    } else {
        rootElement.setAttribute('data-theme', 'dark');
        toggleBtn.textContent = '☀️'; // Shows sun in dark mode
    }
});

// 2. Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100; 

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal(); // Trigger once on load

// 3. Tap to Copy to Clipboard
const copyItems = document.querySelectorAll('.copy-item');
copyItems.forEach(item => {
    item.addEventListener('click', () => {
        const textToCopy = item.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = item.innerHTML;
            item.innerHTML = "Copied to clipboard! ✅";
            item.style.color = "var(--accent-1)";
            
            setTimeout(() => {
                item.innerHTML = originalHTML;
                item.style.color = "var(--text-color)";
            }, 2000);
        });
    });
});

// --- Security & Protection ---

// 1. Disable Right-Click Menu
document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

// 2. Disable Keyboard Shortcuts (F12, Inspect Element, View Source)
document.addEventListener('keydown', event => {
    // Prevent F12
    if (event.key === 'F12') {
        event.preventDefault();
    }
    // Prevent Ctrl+Shift+I / Cmd+Option+I (Inspect)
    if (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'i')) {
        event.preventDefault();
    }
    // Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
    if (event.ctrlKey && event.shiftKey && (event.key === 'J' || event.key === 'j')) {
        event.preventDefault();
    }
    // Prevent Ctrl+U / Cmd+U (View Source)
    if (event.ctrlKey && (event.key === 'U' || event.key === 'u')) {
        event.preventDefault();
    }
});

// 3. Disable the Copy Command (Ctrl+C / Cmd+C)
document.addEventListener('copy', event => {
    event.preventDefault();
});

// --- Modal Popup Logic ---
const contactModal = document.getElementById('contact-modal');
const floatingContactBtn = document.getElementById('floating-contact-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

// Open modal when floating button is clicked
floatingContactBtn.addEventListener('click', () => {
    contactModal.classList.add('active');
});

// Close modal when the "X" is clicked
closeModalBtn.addEventListener('click', () => {
    contactModal.classList.remove('active');
});

// Close modal if the user clicks anywhere outside the frosted card
contactModal.addEventListener('click', (event) => {
    if (event.target === contactModal) {
        contactModal.classList.remove('active');
    }
});

// --- Form Submission & Success Animation ---
const form = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop the page from redirecting
    
    // Change button text while sending
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Sending... ⏳";
    submitBtn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Hide the form and show the success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            form.reset(); // Clear the typed text
            
            // Automatically close the modal after 3.5 seconds
            setTimeout(() => {
                document.getElementById('contact-modal').classList.remove('active');
                
                // Reset everything back to normal for the next time they open it
                setTimeout(() => {
                    form.style.display = 'flex';
                    successMessage.style.display = 'none';
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 500); // Wait for the modal fade-out animation to finish
            }, 3500);
            
        } else {
            alert("Oops! There was a problem sending your message.");
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert("Oops! There was a network error.");
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// --- Auto-Updating Footer Date ---
function updateFooterDate() {
    const dateElement = document.getElementById('last-updated');
    if (dateElement) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Run it when the page loads
updateFooterDate();
