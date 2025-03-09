// Allowed Domains (Modify with your actual domains)
const allowedDomains = [
    "daygea.github.io/Nature/",  // GitHub Pages domain
    "nature.aokfoundation.org/",                // Your shared hosting subdomain
];

const userAgent = navigator.userAgent.toLowerCase();
const isLocal = location.protocol === "file:" || 
                location.hostname === "localhost" || 
                location.hostname === "127.0.0.1" || 
                allowedDomains.includes(location.hostname.toLowerCase());

// List of bot-like User-Agents
const botUserAgents = [
    "bot", "crawler", "spider", "Scrapy", "Python-urllib", "requests", "curl", "wget", "headless"
];

// Detect bots based on User-Agent
if (!isLocal && botUserAgents.some(bot => userAgent.includes(bot))) {
    document.body.innerHTML = "Access Denied!";
    setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
}

// Detect headless browsers
if (!isLocal && navigator.webdriver) {
    document.body.innerHTML = "Access Denied!";
    setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
}

// Prevent requests without JavaScript execution
document.addEventListener("DOMContentLoaded", function () {
    if (!isLocal && (!window.location || !navigator.userAgent)) {
        document.body.innerHTML = "Access Denied!";
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    }
});

// Block bot-like direct requests (only for suspicious requests)
setTimeout(() => {
    if (!isLocal && document.referrer === "" && botUserAgents.some(bot => userAgent.includes(bot))) {
        document.body.innerHTML = "Access Denied!";
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    }
}, 500);

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

// Stronger DevTools Detection (but no unnecessary redirection)
let checkDevTools = setInterval(() => {
    let before = new Date().getTime();
    debugger;
    let after = new Date().getTime();
    if (after - before > 100) { 
        document.body.innerHTML = "DevTools Detected! Page Locked!";
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    }
}, 2000);

// Prevent console access
(function () {
    let _consoleLog = console.log;
    console.log = function () {
        _consoleLog.apply(console, arguments);
        document.body.innerHTML = "Console access blocked!";
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    };
})();

// Detect changes in window size (sign of DevTools being opened)
setInterval(function () {
    if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
        document.body.innerHTML = "Access Denied!";
        setTimeout(() => window.location.href = "https://aokfoundation.org", 2000);
    }
}, 2000);

// Disable printing
window.onbeforeprint = function () {
    alert("Printing is disabled on this application.");
    setTimeout(() => window.stop(), 100); // Stop printing
};
window.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "p") { // Disable Ctrl + P
        alert("Printing is disabled.");
        event.preventDefault();
    }
});

// Log hostname to help debug
console.log("Current hostname: ", location.hostname);
