// function loadScript(src) {
//     return new Promise((resolve, reject) => {
//         const script = document.createElement("script");
//         script.src = src;
//         script.onload = resolve;
//         script.onerror = reject;
//         document.body.appendChild(script);
//     });
// }

// // Load scripts one after another
// window.onload = async () => {
//     try {
//     	await loadScript("js/app.js");
//         await loadScript("js/oduMessages.js");
//         await loadScript("js/numerology.js");        
//         console.log("All scripts loaded successfully.");
//     } catch (error) {
//         console.error("Error loading scripts:", error);
//     }
// };

// <script type="text/javascript" src="js/oduMessages.js"></script>
// <script type="text/javascript" src="js/numerology.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
// <script src="https://js.paystack.co/v1/inline.js"></script>
// <script type="text/javascript" src="js/app.js"></script>
// <script type="text/javascript" src="js/obfuscatedOduMessages.js"></script>
// <script type="text/javascript" src="js/obfuscatedNumerology.js"></script>
// <script type="text/javascript" src="js/obfuscatedApp.js"></script>