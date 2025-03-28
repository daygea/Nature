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
            "|": "img/openOpele-before.png",
            "||": "img/closeOpele-before.png"
        };

       // Function to convert a symbol array into image elements
        const getOduImages = (symbols) => {
            return symbols.map(symbol => 
                `<img src="${imageMap[symbol]}" alt="${symbol}" class="odu-line">`
            ).join("");
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
        document.getElementById("mainCast").addEventListener("change", function() {
            const selectedOdu = this.value; // Get the selected Odu Ifa from the dropdown or input
            displayConfiguration(selectedOdu); // Pass it to the function
        });
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

// List of pre-hashed admin passwords (add more if needed)
const storedHashedPasswords = [
    "f3b4affffec5ec69ea24a382c3178b7440986fbe9b537b7afe90c5c1337d0e77",
    "43dc88eaab6c2de6208ba193a48ef66309f05e810d3af47e5c654218d8bfadd8",
    "4849a6a362ae149353a4077359f4886f6a1e89399c6aa90f3d0678d129c833eb",
    "01fcd586d878e01b7fc94d5ba229fe5a03e228ec54df1638cecced060c9b4e1e"
];
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

    if (storedHashedPasswords.includes(hashedInputPassword)) {
        isAdminAuthenticated = true;
        document.getElementById("adminPasswordContainer").style.display = "none";
        document.getElementById("adminLogoutContainer").style.display = "block";

    } else {
        alert("Incorrect password! Please try again.");
    }
};

function printDivinationResult() {
    if (!isAdminAuthenticated) {
        alert("Only admins can print.");
        return;
    }
    const printHeader = document.getElementById("configurationResult").innerHTML;
    const printContent = document.getElementById("divinationResult").innerHTML;

    // Create an iframe
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head>
            <title>Print - Nature Speaks</title>
            <style>
            body{
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            color: green;
            background-color: white;
            background-image: url('../img/background.jpg');
            background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
            font-family: Courier, monospace;
            font-weight: bold;
         }
        .odu-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        /*    width: fit-content;*/
            width: 12%;
            margin: auto;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        .odu-header {
            position: absolute;
            top: -25px; /* Adjust this value to move it up/down */
            z-index: 2;
            width: 80px;
        }
        .odu-footer {
            position: absolute;
            bottom: -25px; /* Adjust this value to move it up/down */
            z-index: 2;
            width: 80px;
        }
        .odu-line-container {
            display: flex;
            justify-content: center;
            gap: 22px;
            position: relative;
            z-index: 1;
        }
        .odu-line {
            width: 30px;
            height: 50px;
        }
        @media print {
            body { visibility: visible; }
        }
            </style>
        </head>
        <body>
        <center><a href="/" style="color: green; text-decoration: none;"><img src="img/logo.png" style="height:75px" alt="Nature Speaks Logo"/></a></center>
        <center><p>Mo juba <b>OLODUMARE</b>, Ajagunmale, Awonomaja, Odu Ologbooje, Egan, Gbogbo Eleye, Irinwo Imole, Igba Imole, Okanlenirinwo Imole, Otalelugba Imole, Oduduwa ati gbogbo Oba Alade. Mo juba gbogbo Ajunilo.</p></center>
            
           <center> ${printHeader} </center> <br/>
            ${printContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500); // Give time to render
}


// Admin Logout Function
const logoutAdmin = () => {
    isAdminAuthenticated = false;
    document.getElementById("adminPassword").value = "";
    document.getElementById("adminPasswordContainer").style.display = "block";
    document.getElementById("adminLogoutContainer").style.display = "none";
    resetSpeechState();
    location.reload();
};

// Function to handle divination with admin access check
const performUserDivination = async () => {
    resetSpeechState();
    const mainCast = document.getElementById("mainCast").value;
    const orientation = document.getElementById("orientation").value;
    const specificOrientation = document.getElementById("specificOrientation").value;
    const solution = document.getElementById("solution").value;
    const solutionDetails = document.getElementById("solutionDetails").value;
    
    const { message, solutionInfo } = getOduMessageData(mainCast, orientation, specificOrientation, solution, solutionDetails);
    
    const oduData = oduMessages[mainCast] || {};
    const orisha = oduData.Orisha;
    const taboo = oduData.Taboo;
    const names = oduData.Names;
    const occupation = oduData.Occupation;
    const credit = oduData.Credit;
    const alias = oduData.alias;
    const audioData = oduData.audioData || [];
    const videoData = oduData.videoData || [];

    const orientationText = orientation === "Positive" ? "Ire" : "Ayewo";

    // Generate audio & video HTML if available
    const audioHTML = audioData.length
        ? audioData.map(item => 
            `<p style="margin-right:10px; float:left"> 
                <a href="${item.url}" target="_blank"><img src="img/player.png" style="height: 20px;" />Listen to Audio</a> of ${item.author}
            </p>`
          ).join("")
        : "";

    const videoHTML = videoData.length
        ? videoData.map(item => 
            `<p style="margin-right:5px; float:left"> 
                <a href="${item.url}" target="_blank"><img src="img/player.png" style="height: 20px;" />Watch Video</a> of ${item.author}
            </p>`
          ).join("")
        : "";

    const resultElement = document.getElementById("divinationResult");

    if (isAdminAuthenticated || freeOdus.includes(mainCast) || isOduPaid(mainCast, orientation, specificOrientation, solution, solutionDetails)) {
        let resultHTML = `
            <h3 style="text-align: center; margin-top:20px">${mainCast}, ${orientationText} (${specificOrientation}), ${solution} ${solutionDetails}</h3>
            <p>${message} ${solutionInfo}</p><hr>
        `;

        if (orisha) resultHTML += `<p><strong>Orisha:</strong> ${orisha}</p><hr>`;
        if (alias) resultHTML += `<p><strong>Alias:</strong> ${alias}</p><hr>`;
        if (taboo) resultHTML += `<p><strong>Taboo:</strong> ${taboo}</p><hr>`;
        if (names) resultHTML += `<p><strong>Names:</strong> ${names}</p><hr>`;
        if (occupation) resultHTML += `<p><strong>Occupation:</strong> ${occupation}</p><hr>`;
        resultHTML += `${audioHTML} ${videoHTML} <br style="clear:both;"/> <hr>`;
        if (credit) resultHTML += `<p style="padding-bottom:50px"><strong>Credit:</strong> ${credit}</p>`;
        resultElement.innerHTML = resultHTML;
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
    removeControl();
    displayConfiguration(mainCast);
    smoothScrollTo(resultElement.offsetTop, 2000);
};

// Function to display Odù configuration with overlapping images
const displayConfiguration = (oduName) => {
    const configurationElement = document.getElementById("configurationResult");

    let configHTML = `
        <div class="odu-container" id="odu-container">
            <img src="img/chain.png" alt="Odu Header" class="odu-header">
    `;

    if (baseOdus[oduName]) {
        // For the first 16 Odùs
        const config = baseOdus[oduName];

        config.forEach(line => {
            configHTML += `
                <div class="odu-line-container">
                    ${getOduImages([line])} ${getOduImages([line])}
                </div>
            `;
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
                configHTML += `
                    <div class="odu-line-container">
                        ${getOduImages([secondConfig[index]])} ${getOduImages([line])}
                    </div>
                `;
            });
        } else {
            configHTML = `<h2>Odu</h2><p>Configuration not found for ${oduName}.</p>`;
        }
    }

    configHTML += `
            <img src="img/opeleFooter.png" alt="Odu Footer" class="odu-footer">
        </div>
    `;

    configurationElement.innerHTML = configHTML;

    // Apply background image dynamically after content is inserted
    setTimeout(() => {
        const oduContainer = document.getElementById("odu-container");
        if (oduContainer) {
            oduContainer.style.backgroundImage = "url('img/opon.png')"; // Change path as needed
        }
    }, 100);
};


        // Initialize on page load
        window.onload = function() {
             setTimeout(() => {
                document.getElementById("preloader").style.display = "none";
            }, 3000); // Adjust time as needed
            generateCircularButtons();
            populateDropdowns();
            speechSynthesis.cancel(); // Stop any ongoing speech
        };
         // Generate calculator buttons with hidden numbers
        let canClick = true;
        function generateCircularButtons() {
            if (!canClick) return; // Prevent rapid clicks
            canClick = false;
            setTimeout(() => (canClick = true), 500); // Allow clicking after 500ms

            const calculatorDiv = document.getElementById("calculator");
            if (!calculatorDiv) return;
            calculatorDiv.innerHTML = ""; // Clear existing buttons

            let numbers = Array.from({ length: 9 }, (_, i) => i + 1);
            numbers.sort(() => Math.random() - 0.5); // Shuffle numbers
            let radius = 80;
            let centerX = 100, centerY = 100;

            numbers.forEach((num, index) => {
                const angle = (index * (360 / numbers.length)) * (Math.PI / 180);
                const x = centerX + radius * Math.cos(angle) - 25;
                const y = centerY + radius * Math.sin(angle) - 25;

                const button = document.createElement("button");
                button.textContent = num;
                button.dataset.number = num;
                button.style.left = `${x}px`;
                button.style.top = `${y}px`;

                button.onclick = function () {
                    if (!canClick) return;
                    this.classList.add("clicked");
                    displayMeaning(this.dataset.number, button);
                    setTimeout(generateCircularButtons, 1000);
                };

                calculatorDiv.appendChild(button);
            });
        }

        // Function to display Numerology and Astrological meaning and highlight the selected button
        function displayMeaning(number, selectedButton) {
            resetSpeechState();
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
            showControls();
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

// Function to calculate week number within a month
function getWeekOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
}

// Handle button click to determine the meaning
document.getElementById("determine-btn").onclick = () => {
    resetSpeechState();
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
    
    const birthDateObj = new Date(birthdate);
    const birthDay = birthDateObj.getDate();
    const birthMonth = birthDateObj.getMonth() + 1;
    const birthYear = birthDateObj.getFullYear();
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const currentWeek = getWeekOfMonth(currentDate);

    // Calculate different numerology vibrations
    const lifeTimeVibration = getNumerologyNumber(`${birthDay}${birthMonth}${birthYear}`);
    const currentYearVibration = getNumerologyNumber(`${birthDay}${birthMonth}${currentYear}`);
    const currentMonthVibration = getNumerologyNumber(`${birthDay}${birthMonth}${currentYear}${currentMonth}`);
    const currentWeekVibration = getNumerologyNumber(`${birthDay}${birthMonth}${currentYear}${currentMonth}${currentWeek}`);
    const currentDayVibration = getNumerologyNumber(`${birthDay}${birthMonth}${currentYear}${currentMonth}${currentDay}`);

    const astrologyData = getZodiacSign(birthdate);
    if (!astrologyData) {
        console.log("Invalid Date of Birth.");
        return;
    }

    let userSign = astrologyData; 
    let rulers = userSign.ruler.includes("&") ? userSign.ruler.split(" & ") : [userSign.ruler]; // Handle single & dual rulers

    const resultElement = document.getElementById("divinationResult");
    resultElement.innerHTML = `
        <h3 style="text-align: center; margin-top:20px; font-weight:bold;">Message</h3>        
        <p><strong style="font-weight:bold; font-size: 22px;">Today's Vibration is ${currentDayVibration}</strong> - ${numerologyMeanings[currentDayVibration]}</p>
        <hr>
        <p><strong style="font-weight:bold; font-size: 22px;">This week's Vibration is ${currentWeekVibration}</strong> - ${numerologyMeanings[currentWeekVibration]}</p>
        <hr>
        <p><strong style="font-weight:bold; font-size: 22px;">This month's Vibration is ${currentMonthVibration}</strong> - ${numerologyMeanings[currentMonthVibration]}</p>
        <hr>
        <p><strong style="font-weight:bold; font-size: 22px;">This year's Vibration is ${currentYearVibration}</strong> - ${numerologyMeanings[currentYearVibration]}</p>
        <hr>
        <p><strong style="font-weight:bold; font-size: 22px;">Lifetime Vibration is ${lifeTimeVibration}</strong> - ${numerologyMeanings[lifeTimeVibration]}</p>
       <center><p><strong style="font-weight:bold; font-size: 22px;">Notes on your Astrology Data</strong></p></center>
       <hr>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">🔮 Astrology Sign:</strong> ${astrologyData.symbol} ${astrologyData.name} (${astrologyData.animal})</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">🪐 Ruling Planet:</strong> ${astrologyData.ruler}</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">✨ Element:</strong> ${astrologyData.element}</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">🔥 Traits:</strong> ${astrologyData.traits}</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">💪 Strengths:</strong> ${astrologyData.strengths}</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">⚠️ Weaknesses:</strong> ${astrologyData.weaknesses}</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">📖 Meaning:</strong> ${astrologyData.message}</p>
        <hr>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">🌌 Planetary Influence: </strong> ${astrologyData.planetaryInfluence.planet}</p>
       
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">🔮 Effect:</strong> ${astrologyData.planetaryInfluence.effect}</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">📢 Advice:</strong> ${astrologyData.planetaryInfluence.advice}</p>
        <hr>
        <p><strong style="font-weight:bold; font-size: 22px; text-align: justify;">🚀 Planetary Transits</strong></p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">💫 Major Influence:</strong> ${astrologyData.transits.majorInfluences}</p>
        <p><strong style="font-weight:bold; font-size: 20px; text-align: justify;">🔄 Upcoming Shift:</strong> ${astrologyData.transits.upcomingShift}</p>
        

    `;
    resultElement.innerHTML += `
        <hr>
        <h3 style="text-align: center; font-weight:bold;">🌍 Planetary Wisdom</h3>
    `;
    rulers.forEach(ruler => {
    let planetData = planetaryTransits[ruler] || {
        yorubaName: "Unknown",
        currentInfluence: "No specific influence found for this planet.",
        upcomingShift: "No upcoming transits available.",
        ifaProverb: "Wisdom is beyond the stars – seek your inner truth."
    };

    resultElement.innerHTML += `
        <p><strong style="font-weight:bold; font-size: 22px;">🔆 Planetary Influence:</strong> ${planetData.yorubaName} (${ruler})</p>
        <p><strong style="font-weight:bold; font-size: 22px;">🌀 Influence:</strong> ${planetData.currentInfluence}</p>
        <p><strong style="font-weight:bold; font-size: 22px;">🔄 Upcoming Shift:</strong> ${planetData.upcomingShift}</p>
        <p><strong style="font-weight:bold; font-size: 22px;">📜 Itumo:</strong> "${planetData.ifaProverb}"</p>
        <hr>
    `;
});

    configHTML += `<img class="moving-bg" src="img/bird.gif" />`;
    configurationElement.innerHTML = configHTML;

    showControls();
    
    // Slow smooth scroll to result section (2 seconds duration)
    smoothScrollTo(resultElement.offsetTop, 2000);
};

// Function to determine Zodiac Sign based on Date of Birth
function getZodiacSign(dob) {
    const [year, month, day] = dob.split("-").map(num => parseInt(num, 10));
    const dobFormatted = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    for (const sign of astrologyData) {
        if ((dobFormatted >= sign.start && dobFormatted <= sign.end) ||
            (sign.start.startsWith("12") && dobFormatted >= sign.start) ||
            (sign.end.startsWith("01") && dobFormatted <= sign.end)) {
            return sign;
        }
    }
    return null;
}

let speech = null;
let isPlaying = false;
let isPaused = false;

function togglePlayPause() {
    const playPauseBtn = document.getElementById("playPauseBtn");

    if (isPlaying && !isPaused) {
        // Pause the speech
        window.speechSynthesis.pause();
        isPaused = true;
        playPauseBtn.innerHTML = "▶️ Resume";
    } else if (isPaused) {
        // Resume the speech
        window.speechSynthesis.resume();
        isPaused = false;
        playPauseBtn.innerHTML = "⏸ Pause";
    } else {
        // Restart the speech from the beginning
        playResult();
        playPauseBtn.innerHTML = "⏸ Pause";
    }

    isPlaying = true;
}

function playResult() {
    const text = document.getElementById("divinationResult").textContent;

    if (!text.trim()) return;

    // Stop any ongoing speech before playing new one
    window.speechSynthesis.cancel();

    speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // Change this for Yoruba support

    speech.onend = () => {
        isPlaying = false;
        isPaused = false;
        document.getElementById("playPauseBtn").innerHTML = "🔊 Play Voice"; // Reset button
    };

    window.speechSynthesis.speak(speech);
    isPlaying = true;
    isPaused = false;
}

function resetSpeechState() {
    // Cancel ongoing speech when navigating elsewhere
    window.speechSynthesis.cancel();
    isPlaying = false;
    isPaused = false;
    const playPauseBtn = document.getElementById("playPauseBtn");
    if (playPauseBtn) {
        playPauseBtn.innerHTML = "🔊 Play Voice"; // Reset button text
    }
}


function showControls() {
    let controls = document.getElementById("voiceControls");

    // If controls already exist, do nothing
    if (controls) return;

    // Create controls dynamically
    controls = document.createElement("div");
    controls.id = "voiceControls";
    controls.style.textAlign = "center";
    controls.style.marginTop = "20px";
    
     controls.innerHTML = `
        <button id="playPauseBtn" onclick="togglePlayPause()" style="padding: 10px; font-size: 16px;">🔊 Play Voice</button>
    `;

    document.getElementById("divinationResult").appendChild(controls);
}

function removeControl() {
    const controls = document.getElementById("voiceControls");
    if (controls) {
        controls.remove(); // Remove the entire div, not just hide it
    }
}

// Function to stop any ongoing speech before starting a new one
function stopSpeech() {
    if (speechSynthesis.speaking || speechSynthesis.paused) {
        speechSynthesis.cancel();
        isPaused = false;
        if (document.getElementById("pauseBtn")) {
            document.getElementById("pauseBtn").innerText = "Pause";
        }
    }
}

function toggleChatbot() {
    let chatbot = document.getElementById("chatbot-container");
    let toggleButton = document.getElementById("chatbot-toggle");

    if (window.innerWidth <= 768) {  
        // Mobile: Show chatbot as a full-width bottom overlay
        chatbot.style.position = "fixed";
        chatbot.style.bottom = "0";
        chatbot.style.left = "0";
        chatbot.style.width = "100%";
        chatbot.style.height = "60vh"; 
        chatbot.style.display = "block";  
    } else {
        // Desktop: Show floating chatbot
        if (chatbot.style.display === "none" || chatbot.style.display === "") {
            chatbot.style.display = "block";
            toggleButton.style.display = "none"; 
        } else {
            chatbot.style.display = "none";
            toggleButton.style.display = "block"; 
        }
    }
}



// Ensure chatbot starts minimized
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("chatbot-container").style.display = "none";
    document.getElementById("chatbot-toggle").style.display = "block";
});



// Handle Enter and Shift+Enter keypress
document.getElementById("chatbot-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent new line
        sendMessage();
    }
});

// Display chat messages dynamically
function displayMessage(text, sender) {
    let messagesDiv = document.getElementById("chatbot-messages");
    let messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender === "user" ? "You" : "NatureSpeaks"}:</strong> ${text}`;
    messagesDiv.appendChild(messageElement);
}

async function getAIResponse(userInput) {
    const apiKey = "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"; // Replace with your actual API key
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const data = {
        model: "gpt-3.5-turbo", // Use "gpt-4" if available
        messages: [
            { role: "system", content: "You are a helpful assistant specializing in Ifa divination and Yoruba spirituality." },
            { role: "user", content: userInput }
        ],
        max_tokens: 200,
        temperature: 0.7
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.choices && responseData.choices.length > 0) {
            return responseData.choices[0].message.content.trim();
        } else {
            return "I'm sorry, I couldn't generate a response. Please try again.";
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Sorry, I'm having trouble processing your request right now.";
    }
}

async function getBotResponse(userInput) {
    userInput = userInput.toLowerCase();
    let bestMatch = null;

    // Check if the user's input matches a keyword in ifaKnowledgeBase
    for (let keyword in ifaKnowledgeBase) {
        if (userInput.includes(keyword)) {
            bestMatch = ifaKnowledgeBase[keyword];
            break; // Stop searching after finding a match
        }
    }

    // If a match is found, return the knowledge base response
    if (bestMatch) {
        return bestMatch;
    } else {
        // If no match is found, use AI to generate an answer
        return await getAIResponse(userInput);
    }
}


async function sendMessage() {
    let inputField = document.getElementById("chatbot-input");
    let messagesDiv = document.getElementById("chatbot-messages");
    let userMessage = inputField.value.trim().toLowerCase(); // Normalize input

    if (userMessage === "") return; // Don't send empty messages

     // Create user message element
    let userMessageElement = document.createElement("div");
    userMessageElement.classList.add("chat-message", "user-message");
    userMessageElement.innerHTML = `> ${userMessage}`;
    messagesDiv.appendChild(userMessageElement);

    // Clear input field
    inputField.value = "";

    // Show loading message
    let botResponseElement = document.createElement("div");
    botResponseElement.classList.add("chat-message", "bot-message");
    botResponseElement.innerHTML = `<em>>> Thinking...</em>`;
    messagesDiv.appendChild(botResponseElement);

    // Check if the question exists in ifaKnowledgeBase
    let response = checkIfaKnowledgeBase(userMessage);

    if (!response) {
        try {
            response = await getAIResponse(userMessage); // Call AI only if no local match
        } catch (error) {
            console.error("Error fetching AI response:", error);
            response = "Sorry, I couldn't process your request.";
        }
    }

    // Update response in chat
    botResponseElement.innerHTML = `>> ${response}`;

    // Auto-scroll to latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function checkIfaKnowledgeBase(userMessage) {
    for (let key in ifaKnowledgeBase) {
        if (userMessage.includes(key)) {
            return ifaKnowledgeBase[key]; // Return the matching answer
        }
    }
    return null; // No match found
}
