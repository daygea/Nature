let currentLanguage = "en";

const translations = {
  welcomeMessage: {
    en: "Welcome to NatureSpeaks!",
    yo: "Kaabọ si NatureSpeaks!",
    sw: "Karibu kwenye NatureSpeaks!",
    fr: "Bienvenue sur NatureSpeaks!"
  },
  enterDOB: {
    en: "Enter your date of birth",
    yo: "Tẹ ọjọ ibi rẹ sii",
    sw: "Weka tarehe yako ya kuzaliwa",
    fr: "Entrez votre date de naissance"
  },
  numerologyResult: {
    en: "Your Numerology Reading",
    yo: "Itumọ Numerology Rẹ",
    sw: "Usomaji wa Numerology Yako",
    fr: "Votre lecture de numérologie"
  },
  chatPlaceholder: {
    en: "Ask me about Ifá, planets, or destiny...",
    yo: "Beere mi nipa Ifá, awọn irawọ, tabi ayanmọ...",
    sw: "Niulize kuhusu Ifá, sayari, au hatima...",
    fr: "Demandez-moi sur Ifá, les planètes ou le destin..."
  }
};

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("appLang", lang);
  translateUI();
}

function translateText(key) {
  return translations[key] && translations[key][currentLanguage] || key;
}

function translateUI() {
  const welcome = document.getElementById("welcome-msg");
  const dob = document.getElementById("dob-label");
  const numerology = document.getElementById("numerology-header");
  const input = document.getElementById("chatbot-input");

  if (welcome) welcome.innerText = translateText("welcomeMessage");
  if (dob) dob.innerText = translateText("enterDOB");
  if (numerology) numerology.innerText = translateText("numerologyResult");
  if (input) input.placeholder = translateText("chatPlaceholder");
}


console.log("Current Language:", currentLanguage);
console.log("Translated welcomeMessage:", translateText("welcomeMessage"));
