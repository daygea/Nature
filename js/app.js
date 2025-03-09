        document.addEventListener("contextmenu", function (e) {
            e.preventDefault(); // Disable right-click
        });

        document.addEventListener("copy", function (e) {
            e.preventDefault(); // Disable copying
        });

        document.addEventListener("cut", function (e) {
            e.preventDefault(); // Disable cutting
        });

        document.addEventListener("paste", function (e) {
            e.preventDefault(); // Disable pasting
        });

        document.addEventListener("keydown", function (e) {
            if (
                e.key === "F12" || 
                (e.ctrlKey && e.shiftKey && e.key === "I") || 
                (e.ctrlKey && e.shiftKey && e.key === "J") || 
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault(); // Disable DevTools
            }
        });

        setInterval(function () {
            if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
                document.body.innerHTML = "Access Denied!";
                setTimeout(function () {
                    window.location.href = "about:blank"; // Redirect
                }, 1000);
            }
        }, 1000);

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

    // Define free Odùs (first 16)
    const freeOdus = [
        "Ejiogbe", "Osa Owonrin"
    ];
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


    // Check if an Odù is paid for and not expired
    function isOduPaid(oduName) {
        const storedData = localStorage.getItem("paidOdus");
        if (!storedData) return false;

        const paidOdus = decryptData(storedData);
        if (!paidOdus || !paidOdus[oduName]) return false;

        const expirationTime = paidOdus[oduName];
        return Date.now() < expirationTime; // True if still valid
    }

    // Save paid Odù access
    function grantOduAccess(oduName) {
        let paidOdus = decryptData(localStorage.getItem("paidOdus")) || {};
        paidOdus[oduName] = Date.now() + 24 * 60 * 60 * 1000; // Set 24-hour expiry
        localStorage.setItem("paidOdus", encryptData(paidOdus));
    }

    // Process Payment with Paystack
    function payForOdu(oduName) {
        let handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "info@aokfoundation.org", // Replace dynamically if possible
            amount: 100000, // ₦1000 (amount is in kobo)
            currency: "NGN",
            callback: function(response) {
                alert("Donation made successfully, Thank you! Ref: " + response.reference);
                grantOduAccess(oduName);
                // displayOduMessage(oduName);
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

            const performUserDivination = () => {
            const mainCast = document.getElementById("mainCast").value;
            // handleOduAccess(mainCast);
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

            //Map orientation to descriptive text
                const orientationText = orientation === "Positive" ? "Ire" : "Ayewo";
                const orientationEmi = orientation === "Positive" ? "Awonranmaja" : "Ajagunmale";

              // Generate numbered list for audio links
            const audioHTML = audioData.length
                ? audioData.map((item, index) => 
                    `<p style="margin-right:10px; float:left"> <a href="${item.url}" target="_blank"><img src="img/player.png" style="height: 20px;" />Listen to Audio</a> of ${item.author}</p>`
                  ).join("")
                : "<p></p>";

            // Generate numbered list for video links
            const videoHTML = videoData.length
                ? videoData.map((item, index) => 
                    `<p style="margin-right:5px; float:left"> <a href="${item.url}" target="_blank"><img src="img/player.png" style="height: 20px;" />Watch Video</a> of ${item.author}</p> `
                  ).join("")
                : "<p></p>";

            const resultElement = document.getElementById("divinationResult");

            // if (freeOdus.includes(mainCast) || isOduPaid(mainCast)) {
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
             // } else {
        //          document.getElementById("divinationResult").innerHTML = `
        //                <center> <h4 style="padding-top:30px;">Kindly donate ₦1,000 for 24-hour access to ${mainCast}</h4> <br/>
        //                 <button class="btn btn-lg" onclick="payForOdu('${mainCast}')">Donate Now</button></center>
        //                 <h3>About the NGO</h3>
        //                 <p>Aminat Olanbiwoninu Kadri - AOK Foundation was established in July, 2019 as an organisation committed to improving the quality of life for disadvantaged Africans, by partnering with visionary organizations to enable young people in Africa have access to quality education. <br/><br/>
        // We want a future where young people are driving transformative change and achieving their full potential. <a target="_blank" href="https://aokfoundation.org/">https://aokfoundation.org</a></p> <br/>
        //             `;
                // }
                displayConfiguration(mainCast);
                // Slow smooth scroll to result section (2 seconds duration)
                smoothScrollTo(resultElement.offsetTop, 2000);
        };

    const displayConfiguration = (oduName) => {
            const configurationElement = document.getElementById("configurationResult");
            let configHTML = "";

            if (baseOdus[oduName]) {
                // For the first 16 Odùs
                const config = baseOdus[oduName];
                configHTML = `<h1><b>Odu Ifa</b></h1>`;
                config.forEach(line => {
                    configHTML += `<p>&nbsp;&nbsp;${line} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${line}</p>`;
                });
            } else {
                // For combinations like "Ogbe Oyeku"
                const parts = oduName.split(" ");
                const firstPart = parts[0] === "Ogbe" ? "Ejiogbe" : `${parts[0]} Meji`;
                const secondPart = parts[1] === "Ogbe" ? "Ejiogbe" : `${parts[1]} Meji`;

                const firstConfig = baseOdus[firstPart];
                const secondConfig = baseOdus[secondPart];

                if (firstConfig && secondConfig) {
                    configHTML = `<h1><b>Odu Ifa</b></h1>`;
                    firstConfig.forEach((line, index) => {
                        configHTML += `<p>&nbsp;&nbsp;${secondConfig[index]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${line}</p>`;
                    });
                } else {
                    configHTML = `<h2>Odu</h2><p>Configuration not found for ${oduName}.</p>`;
                }
            }

            configurationElement.innerHTML = configHTML;
             // smoothScrollTo(configurationElement.offsetTop, 2000);

        };

        // Initialize on page load
        window.onload = function() {
            document.getElementById("preloader").style.display = "none";
            generateHiddenButtons();
            populateDropdowns();
        };


        // Generate calculator buttons with hidden numbers
        function generateHiddenButtons() {
            const calculatorDiv = document.getElementById("calculator");
            calculatorDiv.innerHTML = ""; // Clear existing buttons

            let numbers = Array.from({ length: 9 }, (_, i) => i + 1);
            numbers.sort(() => Math.random() - 0.5); // Shuffle numbers

            numbers.forEach((num) => {
                const button = document.createElement("button");
                button.textContent = ""; // Hide number initially
                button.dataset.number = num; // Store the actual number in a data attribute

                button.onclick = function () {
                    this.textContent = this.dataset.number; // Reveal number on click
                    displayMeaning(this.dataset.number, button);
                    setTimeout(generateHiddenButtons, 1000); // Re-randomize after 1 sec
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
                <h3 style="text-align: center; margin-top:20px">Numerology: ${numerologyNumber}</h3>
                <p>${numerologyMeanings[numerologyNumber]}</p>
            `;
            configHTML += `<img class="moving-bg" src="img/eye3.gif" />`;
            configurationElement.innerHTML = configHTML;
            // Slow smooth scroll to result section (2 seconds duration)
            smoothScrollTo(resultElement.offsetTop, 2000);
        }

          // Function to simulate a random button click
        // document.getElementById("random-btn").onclick = () => {
        //     const randomNum = Math.floor(Math.random() * 9) + 1;
        //     const randomButton = calculatorDiv.children[randomNum - 1];
        //     displayMeaning(randomNum, randomButton);
        // };


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

            if (!birthdate) {
                resultDiv.style.display = "block inline";
                resultDiv.innerHTML = "<span style='color:red; font-size:14px'>Select your birth date.</span>";
                return;
            }

            // Get the single-digit numerology number
            const numerologyNumber = getNumerologyNumber(birthdate);
            resultDiv.style.display = "none";
            const resultElement = document.getElementById("divinationResult");
            resultElement.innerHTML = `
                <h3 style="text-align: center; margin-top:20px">Numerology: ${numerologyNumber}</h3>
                <p>${numerologyMeanings[numerologyNumber]}</p>
            `;
            configHTML += `<img class="moving-bg" src="img/eye3.gif" />`;
            configurationElement.innerHTML = configHTML;
            // Slow smooth scroll to result section (2 seconds duration)
            smoothScrollTo(resultElement.offsetTop, 2000);
        };








