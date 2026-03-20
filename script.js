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

