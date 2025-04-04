// NS6224.HOSTGATOR.COM
// NS6223.HOSTGATOR.COM
// Disable printing
// Allow printing only if admin is authenticated
window.onbeforeprint = function () {
    if (!isAdminAuthenticated) {
        alert("Printing is disabled on this application.");
        setTimeout(() => window.stop(), 100); // Stop printing
    }
};

// Disable Ctrl + P unless admin is logged in
window.addEventListener("keydown", function (event) {
    if (!isAdminAuthenticated && event.ctrlKey && event.key === "p") {
        alert("Printing is disabled.");
        event.preventDefault();
    }
});
// Disable right-click and clipboard actions
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());
// Block key combinations for DevTools and source code access
document.addEventListener("keydown", function (e) {
    if (e.keyCode === 123 ||  // F12
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.key === "U")) {  // Ctrl+U (View Source)
      e.preventDefault();
    }
});
// Improved DevTools Detection (no crashing)
setInterval(() => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > 250 || heightDiff > 250) { // Larger threshold to avoid false positives
        console.warn("DevTools Detected! Redirecting...");
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    }
}, 3000);
const allowedDomains = [
    "daygea.github.io/Nature", 
    "nature.aokfoundation.org" 
];
const userAgent = navigator.userAgent.toLowerCase();
const isLocal = location.protocol === "file:" || 
                location.hostname === "localhost" || 
                location.hostname === "127.0.0.1" || 
                allowedDomains.includes(location.hostname.toLowerCase());
// List of bot-like User-Agents
const botUserAgents = [
    "bot", "crawler", "spider", "Scrapy", "Python-urllib", "requests", "curl", "wget", "headless", "selenium", "phantomjs"
];
// Detect bots based on User-Agent
if (!isLocal && botUserAgents.some(bot => userAgent.includes(bot))) {
    console.warn("Bot detected! Blocking access...");
    setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
}
// Detect headless browsers
if (!isLocal && navigator.webdriver) {
    console.warn("Headless browser detected! Blocking access...");
    setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
}
// Prevent requests without JavaScript execution
document.addEventListener("DOMContentLoaded", function () {
    if (!isLocal && (!window.location || !navigator.userAgent)) {
        console.warn("Suspicious request detected! Blocking...");
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    }
});
// Block bot-like direct requests (only for suspicious cases)
setTimeout(() => {
    if (!isLocal && document.referrer === "" && botUserAgents.some(bot => userAgent.includes(bot))) {
        console.warn("No referrer, likely bot! Blocking...");
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    }
}, 500);
// Prevent console access (but without crashing)
(function () {
    if (!isLocal) {
        // Overwrite console methods to prevent access
        ["log", "info", "warn", "error", "debug"].forEach(method => {
            console[method] = function () {
                // Do nothing to block console output
            };
        });

        // Optional: Display a warning message when DevTools is open
        Object.defineProperty(console, '_commandLineAPI', {
            get: function () {
                throw new Error("Unauthorized console access detected.");
            }
        });
    }
})();
// async function hashPassword(password) {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(password);
//     const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//     return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
// }

// hashPassword("").then(console.log);

// openAI - "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"
