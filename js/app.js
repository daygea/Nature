    document.getElementById("year").textContent = new Date().getFullYear();
    const SECRET_KEY = "DqUHBw7iFj3ia0pyp+QIvKJ5NgJFXE2PcZk95Kt2w6qpqOZ82iAF4Kx88Khb2KFl";
        // Encrypt data using AES
    function encryptData(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    }
    // Decrypt data
    function decryptData(encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (e) {
            return null;
        }
    }
    function isOduPaid(oduName, orientation, specificOrientation, solution, solutionDetails) {
        const storedData = localStorage.getItem("paidOdus");
        if (!storedData) return false;

        const paidOdus = decryptData(storedData);
        if (!paidOdus) return false;

        const combinationKey = `${oduName}-${orientation}-${specificOrientation}-${solution}-${solutionDetails}`;
        const expirationTime = paidOdus[combinationKey];

        return expirationTime && Date.now() < expirationTime;
    }
    function grantOduAccess(oduName, orientation, specificOrientation, solution, solutionDetails) {
        let paidOdus = decryptData(localStorage.getItem("paidOdus")) || {};
        
        const combinationKey = `${oduName}-${orientation}-${specificOrientation}-${solution}-${solutionDetails}`;
        paidOdus[combinationKey] = Date.now() + 24 * 60 * 60 * 1000; // Set 24-hour expiry

        localStorage.setItem("paidOdus", encryptData(paidOdus));
    }
    function payForOdu(oduName, orientation, specificOrientation, solution, solutionDetails) {
        let handler = PaystackPop.setup({
            key: "pk_live_b39b445fba8a155f04a04980705a3c10ae85d673",
            email: "info@aokfoundation.org",
            amount: 100000, // ₦1000 (amount is in kobo)
            currency: "NGN",
            callback: function(response) {
                alert("Donation made successfully, Thank you! Ref: " + response.reference);
                grantOduAccess(oduName, orientation, specificOrientation, solution, solutionDetails);
                performUserDivination();
            },
            onClose: function() {
                alert("Payment cancelled.");
            }
        });
        handler.openIframe();
    }
        // Base Odùs
        const baseOdus = {
            "Ejiogbe": ["|", "|", "|", "|"],
            "Oyeku Meji": ["||", "||", "||", "||"],
            "Iwori Meji": ["||", "|", "|", "||"],
            "Idi Meji": ["|", "||", "||", "|"],
            "Irosun Meji": ["|", "|", "||", "||"],
            "Owonrin Meji": ["||", "||", "|", "|"],
            "Obara Meji": ["|", "||", "||", "||"],
            "Okanran Meji": ["||", "||", "||", "|"],
            "Ogunda Meji": ["|", "|", "|", "||"],
            "Osa Meji": ["||", "|", "|", "|"],
            "Ika Meji": ["||", "|", "||", "||"],
            "Oturupon Meji": ["||", "||", "|", "||"],
            "Otura Meji": ["|", "||", "|", "|"],
            "Irete Meji": ["|", "|", "||", "|"],
            "Ose Meji": ["|", "||", "|", "||"],
            "Ofun Meji": ["||", "|", "||", "|"]
        };
        // Image paths for mapping
        const imageMap = {
            "|": "img/openOpele.png",
            "||": "img/closeOpele.png"
        };

        // Function to convert a symbol array into image elements
        const getOduImages = (symbols) => {
            return symbols.map(symbol => `<img src="${imageMap[symbol]}" alt="${symbol}" width="30" height="50">`).join("");
        };
        // Generate all 256 Odù combinations
        const generateOduCombinations = () => {
            const baseOduNames = Object.keys(baseOdus);
            const allOdus = [...baseOduNames];
            baseOduNames.forEach(firstOdu => {
                baseOduNames.forEach(secondOdu => {
                    if (firstOdu !== secondOdu) {
                        let firstName = firstOdu === "Ejiogbe" ? "Ogbe" : firstOdu.split(" ")[0];
                        let secondName = secondOdu === "Ejiogbe" ? "Ogbe" : secondOdu.split(" ")[0];
                        allOdus.push(`${firstName} ${secondName}`);
                    }
                });
            });
            return allOdus;
        };
        const allOdus = generateOduCombinations();
        // Populate dropdowns
        const populateDropdown = (dropdown, options) => {
            dropdown.innerHTML = ""; // Clear existing options
            options.forEach(option => {
                const optElement = document.createElement("option");
                optElement.value = option;
                optElement.textContent = option;
                dropdown.appendChild(optElement);
            });
        };
        const populateDropdowns = () => {
            const mainCastDropdown = document.getElementById("mainCast");
            populateDropdown(mainCastDropdown, allOdus);
            updateSpecificOrientation();
            updateSolutionDetails(); // Populate solution details on page load
        };
        // Check if oduMessages has data for the selected mainCast, fallback if not
        const getOduMessageData = (mainCast, orientation, specificOrientation, solution, specificSolution) => {
            const orientationData = oduMessages[mainCast]?.[orientation];
            const specificOrientationData = orientationData?.[specificOrientation];
            const solutionData = specificOrientationData?.[solution]?.[specificSolution];
            const messageData = orientationData?.[specificOrientation].Message;
            return {
                message: messageData || "No message available &",
                solutionInfo: solutionData || "no message available for the selected combination.",
                orientationMessage: orientationData?.Messages || "No general message available for this orientation.",
                specificOrientationMessage: specificOrientationData?.Message || "No message available for this specific orientation."
            };
        };
        const updateSpecificOrientation = () => {
                const orientation = document.getElementById("orientation").value;
                const specificOrientationDropdown = document.getElementById("specificOrientation");
                const mainCast = document.getElementById("mainCast").value;
                // Use fallback options if no data exists in `oduMessages`
                const defaultOptions =
                    orientation === "Positive"
                        ? ["Aiku", "Aje", "Isegun", "Igbale Ese", "Gbogbo Ire"]
                        : ["Iku", "Arun", "Ejo", "Ofo", "Okutagbunilese"];
                const options =
                    oduMessages[mainCast]?.[orientation] 
                        ? Object.keys(oduMessages[mainCast][orientation])
                        : defaultOptions;
                populateDropdown(specificOrientationDropdown, options);
            };
             const updateSolutionDetails = () => {
                const solution = document.getElementById("solution").value;
                const solutionDetailsDropdown = document.getElementById("solutionDetails");
                const mainCast = document.getElementById("mainCast").value;
                // Use fallback options if no data exists in `oduMessages`
                const defaultSolutionDetails =
                    solution === "Ebo"
                        ? ["Akoru", "Esha"]
                        : ["Ori", "Osha", "Eegun", "Ifa"];
                const details =
                    oduMessages[mainCast]?.Solution?.[solution] 
                        ? oduMessages[mainCast].Solution[solution]
                        : defaultSolutionDetails;
                populateDropdown(solutionDetailsDropdown, details);
            };
            const smoothScrollTo = (targetPosition, duration) => {
                const startPosition = window.scrollY;
                const distance = targetPosition - startPosition;
                let startTime = null;
                const animation = (currentTime) => {
                    if (!startTime) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                };
                const easeInOutQuad = (t) => {
                    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                };
                requestAnimationFrame(animation);
            };
// Function to hash the password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
// Store the hashed admin password securely (replace with your actual hash)
const storedHashedPassword = "c2b6df82a1f9e1ae08bffac7d5358d8b752b191f35601e975bb33e43ad948b8b"; 
let isAdminAuthenticated = false;
// Tap detection for mobile users
let tapCount = 0;
document.getElementById("hiddenTapArea").addEventListener("click", function() {
    tapCount++;
    if (tapCount === 9) {
        document.getElementById("adminPasswordContainer").style.display = "block";
        tapCount = 0; // Reset tap count
    }
    setTimeout(() => (tapCount = 0), 3000); // Reset if no tap in 3 sec
});
// Detect "Enter" key press in admin password input field
document.getElementById("adminPassword").addEventListener("keypress", async function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior
        await authenticateAdmin(); // Call the admin authentication function
    }
});
// Admin Login Function
const authenticateAdmin = async () => {
    const adminPasswordInput = document.getElementById("adminPassword").value;
    const hashedInputPassword = await hashPassword(adminPasswordInput);

    if (hashedInputPassword === storedHashedPassword) {
        isAdminAuthenticated = true;
        document.getElementById("adminPasswordContainer").style.display = "none";
        document.getElementById("adminLogoutContainer").style.display = "block";
    } else {
        alert("Incorrect password! Please try again.");
    }
};
// Admin Logout Function
const logoutAdmin = () => {
    isAdminAuthenticated = false;
    document.getElementById("adminPassword").value = ""; // Clear password field
    document.getElementById("adminPasswordContainer").style.display = "block";
    document.getElementById("adminLogoutContainer").style.display = "none";
    location.reload();
};
// Function to handle divination with admin access check
const performUserDivination = async () => {
    const mainCast = document.getElementById("mainCast").value;
    const orientation = document.getElementById("orientation").value;
    const specificOrientation = document.getElementById("specificOrientation").value;
    const solution = document.getElementById("solution").value;
    const solutionDetails = document.getElementById("solutionDetails").value;
    const { message, solutionInfo } = getOduMessageData(mainCast, orientation, specificOrientation, solution, solutionDetails);
    const orisha = oduMessages[mainCast]?.Orisha || "No orisha data available.";
    const taboo = oduMessages[mainCast]?.Taboo || "No taboo available.";
    const names = oduMessages[mainCast]?.Names || "No names available.";
    const occupation = oduMessages[mainCast]?.Occupation || "No occupation available.";
    const credit = oduMessages[mainCast]?.Credit || "No credit available.";
    const alias = oduMessages[mainCast]?.alias || "No alias available.";
    const audioData = oduMessages[mainCast]?.audioData || [];
    const videoData = oduMessages[mainCast]?.videoData || [];
    const orientationText = orientation === "Positive" ? "Ire" : "Ayewo";
    const audioHTML = audioData.length
        ? audioData.map((item, index) => 
            `<p style="margin-right:10px; float:left"> 
                <a href="${item.url}" target="_blank"><img src="img/player.png" style="height: 20px;" />Listen to Audio</a> of ${item.author}
            </p>`
          ).join("")
        : "<p></p>";
    const videoHTML = videoData.length
        ? videoData.map((item, index) => 
            `<p style="margin-right:5px; float:left"> 
                <a href="${item.url}" target="_blank"><img src="img/player.png" style="height: 20px;" />Watch Video</a> of ${item.author}
            </p>`
          ).join("")
        : "<p></p>";
    const resultElement = document.getElementById("divinationResult");
    if (isAdminAuthenticated || freeOdus.includes(mainCast) || isOduPaid(mainCast, orientation, specificOrientation, solution, solutionDetails)) {
        resultElement.innerHTML = `
            <h3 style="text-align: center; margin-top:20px">${mainCast}, ${orientationText} (${specificOrientation}), ${solution} ${solutionDetails}</h3>
            <p>${message} ${solutionInfo}</p>
            <p><strong>Orisha:</strong> ${orisha}</p>
            <p><strong>Alias:</strong> ${alias}</p>
            <p><strong>Taboo:</strong> ${taboo}</p>
            <p><strong>Names:</strong> ${names}</p>
            <p><strong>Occupation:</strong> ${occupation}</p>
            ${audioHTML}
            ${videoHTML}
            <br style="clear:both;"/>
            <p style="padding-bottom:50px"><strong>Credit:</strong> ${credit}</p>
        `;
    } else {
        resultElement.innerHTML = `
            <center>
                <h4 style="padding-top:30px;">
                    Kindly donate N1,000 to the NGO for a 24-hour access to 
                    ${mainCast}, ${orientationText} (${specificOrientation}), ${solution} ${solutionDetails}.
                </h4>
                <br/>
                <button class="btn btn-lg btn-warning" 
                    onclick="payForOdu('${mainCast}', '${orientation}', '${specificOrientation}', '${solution}', '${solutionDetails}')">
                    Donate Now
                </button>
            </center>
        `;
    }
    displayConfiguration(mainCast);
    smoothScrollTo(resultElement.offsetTop, 2000);
};

        const displayConfiguration = (oduName) => {
            const configurationElement = document.getElementById("configurationResult");
            let configHTML = `<h1><b>Odu Ifa</b></h1>`;

            if (baseOdus[oduName]) {
                // For the first 16 Odùs
                const config = baseOdus[oduName];
                config.forEach(line => {
                    configHTML += `<div style="display: flex; align-items: center; gap: 20px; padding-left:150px;">
                                    ${getOduImages([line])} ${getOduImages([line])}
                                   </div>`;
                });
            } else {
                // For combinations like "Ogbe Oyeku"
                const parts = oduName.split(" ");
                const firstPart = parts[0] === "Ogbe" ? "Ejiogbe" : `${parts[0]} Meji`;
                const secondPart = parts[1] === "Ogbe" ? "Ejiogbe" : `${parts[1]} Meji`;
                const firstConfig = baseOdus[firstPart];
                const secondConfig = baseOdus[secondPart];

                if (firstConfig && secondConfig) {
                    firstConfig.forEach((line, index) => {
                        configHTML += `<div style="display: flex; align-items: center; gap: 20px; padding-left:150px;">
                                        ${getOduImages([secondConfig[index]])} ${getOduImages([line])}
                                       </div>`;
                    });
                } else {
                    configHTML = `<h2>Odu</h2><p>Configuration not found for ${oduName}.</p>`;
                }
            }

            configurationElement.innerHTML = configHTML;
        };


        // Initialize on page load
        window.onload = function() {
             setTimeout(() => {
                document.getElementById("preloader").style.display = "none";
            }, 3000); // Adjust time as needed
            generateHiddenButtons();
            populateDropdowns();
        };
         // Generate calculator buttons with hidden numbers
        function generateHiddenButtons() {
            const calculatorDiv = document.getElementById("calculator");
            if (!calculatorDiv) return;
            calculatorDiv.innerHTML = ""; // Clear existing buttons
            let numbers = Array.from({ length: 9 }, (_, i) => i + 1);
            numbers.sort(() => Math.random() - 0.5); // Shuffle numbers
            let radius = 80; // Radius of the circle
            let centerX = 100, centerY = 100; // Center position
            numbers.forEach((num, index) => {
                const angle = (index * (360 / numbers.length)) * (Math.PI / 180);
                const x = centerX + radius * Math.cos(angle) - 25; // Adjust for button size
                const y = centerY + radius * Math.sin(angle) - 25;
                const button = document.createElement("button");
                button.textContent = "";
                button.dataset.number = num;
                button.style.left = `${x}px`;
                button.style.top = `${y}px`;
                button.onclick = function () {
                    this.textContent = this.dataset.number;
                    this.classList.add("clicked");
                    displayMeaning(this.dataset.number, button);
                    setTimeout(generateHiddenButtons, 1000);
                };
                calculatorDiv.appendChild(button);
            });
        }
        // Function to display Numerology and Astrological meaning and highlight the selected button
        function displayMeaning(number, selectedButton) {
             // Get the single-digit numerology number
            const numerologyNumber = number;
            const resultDiv = document.getElementById("result");
            const configurationElement = document.getElementById("configurationResult");
            let configHTML = "";
            resultDiv.style.display = "none";
            const resultElement = document.getElementById("divinationResult");
            resultElement.innerHTML = `
                <h3 style="text-align: center; margin-top:20px; font-weight:bold;">Numerology: ${numerologyNumber}</h3>
                <p>${numerologyMeanings[numerologyNumber]}</p>
            `;
            configHTML += `<img class="moving-bg" src="img/bird.gif" />`;
            configurationElement.innerHTML = configHTML;
            // Slow smooth scroll to result section (2 seconds duration)
            smoothScrollTo(resultElement.offsetTop, 2000);
        }
         // Function to calculate the single-digit numerology number
        function getNumerologyNumber(dateString) {
            let digits = dateString.replace(/[^0-9]/g, ""); // Remove non-numeric characters
            let sum = digits.split("").reduce((acc, num) => acc + parseInt(num), 0);
            // Reduce to a single-digit number
            while (sum > 9) {
                sum = sum.toString().split("").reduce((acc, num) => acc + parseInt(num), 0);
            }
            return sum;
        }
       //Handle button click to determine the meaning
        document.getElementById("determine-btn").onclick = () => {
            const birthdate = document.getElementById("birthdate").value;
            const resultDiv = document.getElementById("result");
            const configurationElement = document.getElementById("configurationResult");
            let configHTML = "";
            // Reset previous error messages before checking birthdate
            resultDiv.innerHTML = "";
            resultDiv.style.display = "none"; 
            if (!birthdate) {
                resultDiv.style.display = "block";
                resultDiv.innerHTML = "<span style='color:red; font-size:14px'>Select your birth date.</span>";
                return;
            }
            // Get the single-digit numerology number
            const numerologyNumber = getNumerologyNumber(birthdate);
            const resultElement = document.getElementById("divinationResult");
            resultElement.innerHTML = `
                <h3 style="text-align: center; margin-top:20px; font-weight:bold;">Numerology: ${numerologyNumber}</h3>
                <p>${numerologyMeanings[numerologyNumber]}</p>
            `;
            configHTML += `<img class="moving-bg" src="img/bird.gif" />`;
            configurationElement.innerHTML = configHTML;
            // Slow smooth scroll to result section (2 seconds duration)
            smoothScrollTo(resultElement.offsetTop, 2000);
        };

