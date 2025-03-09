(function() {
    const botUserAgents = [
        "bot", "crawler", "spider", "Scrapy", "Python-urllib", "requests", "curl", "wget", "headless"
    ];
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isLocal = location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";

    if (!isLocal && (botUserAgents.some(bot => userAgent.includes(bot)) || navigator.webdriver)) {
        document.body.innerHTML = "Access Denied!";
        setTimeout(() => window.location.href = "https://aokfoundation.org", 1000);
    }

    if (!isLocal && (!navigator.plugins.length || navigator.languages.length === 0)) {
        document.body.innerHTML = "Access Denied!";
        setTimeout(() => window.location.href = "https://aokfoundation.org", 1000);
    }

    setTimeout(() => {
        if (!isLocal && document.referrer === "") {
            document.body.innerHTML = "Access Denied!";
            setTimeout(() => window.location.href = "https://aokfoundation.org", 1000);
        }
    }, 500);

    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("copy", e => e.preventDefault());
    document.addEventListener("cut", e => e.preventDefault());
    document.addEventListener("paste", e => e.preventDefault());

    document.addEventListener("keydown", function (e) {
        if (e.key === "F12" || 
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
            (e.ctrlKey && e.key === "U") || 
            (e.ctrlKey && e.key === "S")) {
            document.body.innerHTML = "Access Denied!";
            setTimeout(() => window.location.href = "https://aokfoundation.org", 1000);
            e.preventDefault();
        }
    });

    setInterval(() => {
        if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
            document.body.innerHTML = "Access Denied!";
            setTimeout(() => window.location.href = "https://aokfoundation.org", 1000);
        }
    }, 1000);

    let rtc = new RTCPeerConnection({ iceServers: [] });
    rtc.createDataChannel('');
    rtc.createOffer().then(offer => rtc.setLocalDescription(offer));

    rtc.onicecandidate = function(event) {
        if (event && event.candidate && event.candidate.candidate.includes("relay")) {
            document.body.innerHTML = "Access Denied!";
            setTimeout(() => window.location.href = "https://aokfoundation.org", 1000);
        }
    };

    window.onbeforeprint = function () {
        alert("Printing is disabled.");
        setTimeout(() => window.stop(), 100);
    };

    window.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "p") {
            alert("Printing is disabled.");
            event.preventDefault();
        }
    });

    // Prevent Console Access - Redirects if DevTools is open
    function detectDevTools() {
        const before = new Date().getTime();
        debugger; // Triggers delay if DevTools is open
        const after = new Date().getTime();
        if (after - before > 100) {
            window.location.href = "about:blank";
        }
    }
    setInterval(detectDevTools, 1000);
    
    // Stronger Console Block
    (function() {
        let _consoleLog = console.log;
        let _consoleWarn = console.warn;
        let _consoleError = console.error;
        console.log = console.warn = console.error = function() {
            setTimeout(() => { window.location.href = "about:blank"; }, 500);
            return _consoleLog.apply(console, arguments);
        };
    })();

})();
