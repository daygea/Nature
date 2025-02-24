function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Load scripts one after another
window.onload = async () => {
    try {
    	await loadScript("js/app.js");
        await loadScript("js/oduMessages.js");
        await loadScript("js/numerology.js");        
        console.log("All scripts loaded successfully.");
    } catch (error) {
        console.error("Error loading scripts:", error);
    }
};
