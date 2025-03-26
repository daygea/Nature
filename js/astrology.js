const astrologyData = [
    {
        name: "Aries", symbol: "♈", animal: "Ram", element: "Fire", ruler: "Mars", start: "03-21", end: "04-19",
        traits: "Courageous, determined, confident, enthusiastic, passionate, impulsive.",
        strengths: "Leadership, bravery, high energy, strong willpower.",
        weaknesses: "Impatience, short temper, aggressive tendencies.",
        message: "Like the Ram, you charge forward with fearless energy. Your bold nature makes you a natural leader, but patience and balance will take you further.",
        planetaryInfluence: {
            planet: "Mars",
            effect: "Mars fuels your ambition, drive, and competitive spirit. It gives you a strong sense of initiative but can also make you impulsive and aggressive.",
            advice: "Use Mars' fiery energy for positive action rather than conflict. Channel your passion into productive goals."
        },
        transits: {
            majorInfluences: "Mars in Aries increases assertiveness and drive. However, be cautious of conflicts and impulsive decisions.",
            upcomingShift: "Venus entering Aries will bring balance, enhancing relationships and creativity."
        }
    },
    {
        name: "Taurus", symbol: "♉", animal: "Bull", element: "Earth", ruler: "Venus", start: "04-20", end: "05-20",
        traits: "Reliable, patient, practical, devoted, stable, stubborn.",
        strengths: "Determined, hardworking, loyal, sensual, financially wise.",
        weaknesses: "Stubborn, resistant to change, materialistic at times.",
        message: "Like the Bull, you are strong and persistent. Your patience leads to great achievements, but be open to new perspectives for greater growth.",
        planetaryInfluence: {
            planet: "Venus",
            effect: "Venus blesses you with a love for beauty, comfort, and stability. It makes you affectionate and loyal but also prone to materialism.",
            advice: "Balance your desire for security with flexibility. Appreciate beauty, but don't let it control your decisions."
        },
        transits: {
            majorInfluences: "Venus in Taurus enhances love and financial stability. It's a great time for personal growth and relationships.",
            upcomingShift: "Mercury retrograde may cause delays in communication and decision-making—stay patient and practical."
        }
    },
    {
        name: "Gemini", symbol: "♊", animal: "Twins", element: "Air", ruler: "Mercury", start: "05-21", end: "06-21",
        traits: "Adaptable, outgoing, intelligent, curious, communicative.",
        strengths: "Quick-witted, versatile, energetic, great conversationalist.",
        weaknesses: "Indecisive, inconsistent, restless, easily distracted.",
        message: "Like the Twins, you are dual-natured, adaptable, and quick-witted. Your curiosity fuels you, but learning to focus will amplify your success.",
        planetaryInfluence: {
            planet: "Mercury",
            effect: "Mercury enhances your intellect, curiosity, and communication skills. You excel in conversation and learning but may struggle with focus.",
            advice: "Use Mercury’s energy to your advantage by refining your ability to concentrate on one goal at a time."
        },
        transits: {
            majorInfluences: "Mercury in Gemini boosts communication and mental agility. Great time for learning, networking, and creative projects.",
            upcomingShift: "Mercury retrograde is coming—double-check details to avoid misunderstandings and confusion."
        }
    },
    {
        name: "Cancer", symbol: "♋", animal: "Crab", element: "Water", ruler: "Moon", start: "06-22", end: "07-22",
        traits: "Intuitive, nurturing, protective, emotional, loyal.",
        strengths: "Caring, deep emotional intelligence, strong family values.",
        weaknesses: "Moody, overly sensitive, defensive, sometimes manipulative.",
        message: "Like the Crab, you have a protective shell but a deeply sensitive heart. Trusting your intuition while managing emotions will bring you harmony.",
        planetaryInfluence: {
            planet: "Moon",
            effect: "The Moon governs emotions, intuition, and instincts. You are deeply in touch with your feelings but can be easily affected by mood swings.",
            advice: "Learn to balance your emotions and trust your inner wisdom without being overwhelmed by sensitivity."
        },
        transits: {
            majorInfluences: "Full Moon in Cancer intensifies emotions and personal revelations. A great time for deep reflection.",
            upcomingShift: "Mars entering Cancer soon may trigger emotional conflicts—stay grounded."
        }
    },
    {
        name: "Leo", symbol: "♌", animal: "Lion", element: "Fire", ruler: "Sun", start: "07-23", end: "08-22",
        traits: "Confident, ambitious, charismatic, creative, generous.",
        strengths: "Natural leader, strong-willed, inspiring, warm-hearted.",
        weaknesses: "Prideful, stubborn, attention-seeking, dramatic.",
        message: "Like the Lion, you radiate confidence and strength. Your charisma draws people in, but true greatness lies in humility and wisdom.",
        planetaryInfluence: {
            planet: "Sun",
            effect: "The Sun gives you confidence, vitality, and creativity. It makes you naturally radiant, but it can also lead to arrogance if not balanced.",
            advice: "Use the Sun’s warmth to uplift others rather than seeking constant validation."
        },
        transits: {
            majorInfluences: "Sun in Leo empowers self-expression, creativity, and leadership.",
            upcomingShift: "Saturn in opposition soon may bring challenges in responsibility—focus on patience."
        }
    },
    {
        name: "Virgo", symbol: "♍", animal: "Virgin", element: "Earth", ruler: "Mercury", start: "08-23", end: "09-22",
        traits: "Analytical, practical, detail-oriented, hardworking, kind.",
        strengths: "Highly organized, intelligent, perfectionist, service-driven.",
        weaknesses: "Overly critical, worry-prone, too detail-focused.",
        message: "Like the Virgin, you seek purity in thought and action. Your keen eye for detail is a gift, but learning to let go of perfection will set you free.",
        planetaryInfluence: {
            planet: "Mercury",
            effect: "Mercury sharpens your analytical skills and attention to detail. You are a problem-solver but can become overly critical of yourself and others.",
            advice: "Balance analysis with trust in the process. Not everything needs to be perfect."
        },
        transits: {
            majorInfluences: "Mercury in Virgo enhances analytical thinking and problem-solving. A great time for planning and organization.",
            upcomingShift: "Venus in Virgo may bring focus on self-care and health—nurture your well-being."
        }
    },
     {
        name: "Libra", symbol: "♎", animal: "Balance", element: "Air", ruler: "Venus", start: "09-23", end: "10-23",
        traits: "Diplomatic, charming, social, fair-minded, idealistic.",
        strengths: "Balanced, artistic, great mediator, relationship-focused.",
        weaknesses: "Indecisive, avoids confrontation, people-pleaser.",
        message: "Like the Balance, you seek harmony in all aspects of life. Your charm and diplomacy are your greatest strengths, but making firm decisions will help you grow.",
        planetaryInfluence: {
            planet: "Venus",
            effect: "Venus enhances your love for beauty, relationships, and diplomacy. It makes you social and charming but may cause indecisiveness.",
            advice: "Trust your judgment and make decisions with confidence. Seek balance without sacrificing your own needs."
        },
        transits: {
            majorInfluences: "Venus in Libra enhances relationships and social harmony. A great time for romance and creative projects.",
            upcomingShift: "Mars entering Libra may bring conflicts—stay calm and diplomatic in challenging situations."
        }
    },
    {
        name: "Scorpio", symbol: "♏", animal: "Scorpion", element: "Water", ruler: "Pluto & Mars", start: "10-24", end: "11-21",
        traits: "Passionate, intense, resourceful, determined, mysterious.",
        strengths: "Loyal, intuitive, fearless, emotionally deep.",
        weaknesses: "Jealous, secretive, possessive, sometimes manipulative.",
        message: "Like the Scorpion, you possess intense focus and deep emotions. Your ability to transform and rise from challenges makes you unstoppable.",
        planetaryInfluence: {
            planet: "Pluto & Mars",
            effect: "Pluto fuels your power of transformation and deep thinking. Mars gives you boldness and passion, but also intensity.",
            advice: "Use your emotional depth to heal and transform rather than control. Embrace vulnerability without fear."
        },
        transits: {
            majorInfluences: "Pluto in Scorpio deepens introspection and personal transformation.",
            upcomingShift: "Mars moving into Scorpio will amplify passion and ambition—use it wisely."
        }
    },
    {
        name: "Sagittarius", symbol: "♐", animal: "Archer", element: "Fire", ruler: "Jupiter", start: "11-22", end: "12-21",
        traits: "Adventurous, optimistic, independent, philosophical, free-spirited.",
        strengths: "Visionary, intelligent, open-minded, spontaneous.",
        weaknesses: "Impatient, tactless, overconfident, inconsistent.",
        message: "Like the Archer, your sights are set on new horizons. Your thirst for knowledge and adventure fuels you, but grounding yourself will bring greater fulfillment.",
        planetaryInfluence: {
            planet: "Jupiter",
            effect: "Jupiter expands your mind, opportunities, and luck. It makes you adventurous but can also lead to overindulgence or risk-taking.",
            advice: "Embrace your optimism but plan your journey wisely. Luck favors preparation."
        },
        transits: {
            majorInfluences: "Jupiter in Sagittarius brings expansion and opportunities for travel and education.",
            upcomingShift: "Saturn's influence may demand discipline—focus on long-term goals."
        }
    },
    {
        name: "Capricorn", symbol: "♑", animal: "Goat", element: "Earth", ruler: "Saturn", start: "12-22", end: "01-19",
        traits: "Disciplined, responsible, ambitious, practical, hardworking.",
        strengths: "Determined, patient, goal-oriented, wise.",
        weaknesses: "Workaholic, pessimistic, emotionally reserved.",
        message: "Like the Goat, you climb steadily toward your goals. Your patience and discipline are admirable, but balance is key to lasting success.",
        planetaryInfluence: {
            planet: "Saturn",
            effect: "Saturn instills discipline, structure, and wisdom. It teaches hard lessons but rewards perseverance.",
            advice: "Trust the process and stay disciplined, but remember to enjoy life along the way."
        },
        transits: {
            majorInfluences: "Saturn in Capricorn strengthens work ethic and goal-setting abilities.",
            upcomingShift: "Pluto’s influence may push you toward transformation in career or personal life—embrace growth."
        }
    },
    {
        name: "Aquarius", symbol: "♒", animal: "Water Bearer", element: "Air", ruler: "Uranus & Saturn", start: "01-20", end: "02-18",
        traits: "Innovative, independent, intellectual, humanitarian, unconventional.",
        strengths: "Visionary, open-minded, problem-solver, rebellious spirit.",
        weaknesses: "Detached, unpredictable, stubborn, emotionally distant.",
        message: "Like the Water Bearer, you bring new ideas to the world. Your intellect is your strength, but grounding in emotions will create deeper connections.",
        planetaryInfluence: {
            planet: "Uranus & Saturn",
            effect: "Uranus drives innovation and rebellion, while Saturn brings discipline and structure. This balance makes you a progressive thinker.",
            advice: "Use your originality to inspire others but stay connected to reality. Change should be meaningful, not chaotic."
        },
        transits: {
            majorInfluences: "Uranus in Aquarius fosters breakthroughs in technology and social causes.",
            upcomingShift: "Mercury retrograde may disrupt communication—double-check details in your plans."
        }
    },
    {
        name: "Pisces", symbol: "♓", animal: "Fish", element: "Water", ruler: "Neptune & Jupiter", start: "02-19", end: "03-20",
        traits: "Empathetic, intuitive, artistic, dreamy, compassionate.",
        strengths: "Highly creative, emotionally intelligent, spiritually connected.",
        weaknesses: "Overly idealistic, escapist, indecisive.",
        message: "Like the Fish, you flow with the tides of life. Your deep intuition guides you, but learning to set boundaries will protect your energy.",
        planetaryInfluence: {
            planet: "Neptune & Jupiter",
            effect: "Neptune enhances your imagination and spirituality, while Jupiter expands your dreams and wisdom. This makes you highly intuitive but also prone to illusion.",
            advice: "Trust your intuition but stay grounded in reality. Dream big, but take practical steps to manifest your vision."
        },
        transits: {
            majorInfluences: "Neptune in Pisces enhances creativity and spiritual insights.",
            upcomingShift: "Mars entering Pisces may heighten emotions—express feelings constructively."
        }
    }
];

const planetaryTransits = {
    "Sun": {
        yorubaName: "Orun",
        currentInfluence: "Illuminating your purpose and inner strength. A period of clarity and leadership.",
        upcomingShift: "Moving into a phase where your destiny aligns with spiritual growth.",
        ifaProverb: "Orun lo ran wa si aiye – The Sun sent us into the world (your destiny is divine)."
    },
    "Moon": {
        yorubaName: "Oṣupa",
        currentInfluence: "Emotional tides are strong. Trust your intuition and connect with your ancestors.",
        upcomingShift: "A time of deep reflection, heightened spiritual insight, and dream revelations.",
        ifaProverb: "Oṣupa tan imole si ona – The Moon lights the path of wisdom."
    },
    "Mercury": {
        yorubaName: "Èsù",
        currentInfluence: "Your communication skills are heightened. A good time for negotiations and decisions.",
        upcomingShift: "Expect unexpected changes—be flexible and adapt at life’s crossroads.",
        ifaProverb: "Èsù máa gba àlàbí, ki a má ṣe ìdàgbà – Èsù grants clarity so we do not lose direction."
    },
    "Venus": {
        yorubaName: "Oshun",
        currentInfluence: "Relationships, creativity, and love are flourishing. Beauty and harmony are in focus.",
        upcomingShift: "An emotional phase where self-love and deep connections take priority.",
        ifaProverb: "Omi ni Oshun, o gbodo ma kun – Oshun is water, she must never run dry."
    },
    "Mars": {
        yorubaName: "Ogun",
        currentInfluence: "Energy and ambition are at their peak. A time for action, but avoid unnecessary conflict.",
        upcomingShift: "Prepare for transformation—channel strength wisely to build, not destroy.",
        ifaProverb: "Ogun l’ogun, a fi ogun se ogun – Ogun is war; it takes battle to win battles."
    },
    "Jupiter": {
        yorubaName: "Obatala",
        currentInfluence: "Wisdom and expansion are guiding your journey. Great for learning and career growth.",
        upcomingShift: "A period of mentorship and spiritual awakening. Be open to new opportunities.",
        ifaProverb: "Obatala ni a fi mo ise aye – Obatala is the one who shaped the world."
    },
    "Saturn": {
        yorubaName: "Sango",
        currentInfluence: "Discipline and justice are in focus. Time to take responsibility and act with integrity.",
        upcomingShift: "Expect trials that will test your patience but ultimately strengthen your foundation.",
        ifaProverb: "Sango ti ko ni idariji – Sango does not tolerate injustice."
    },
    "Uranus": {
        yorubaName: "Oya",
        currentInfluence: "Sudden change and innovation are on the horizon. Break free from old limitations.",
        upcomingShift: "Transformation is coming. Embrace the winds of change for personal evolution.",
        ifaProverb: "Oya ni afefe aye – Oya is the wind that brings transformation."
    },
    "Neptune": {
        yorubaName: "Olokun",
        currentInfluence: "Spiritual enlightenment and dreams are heightened. Trust your intuition.",
        upcomingShift: "A deeper connection to the unseen world is unfolding. Listen to the whispers of the universe.",
        ifaProverb: "Olokun ni omi jin – Olokun is the deep ocean of mysteries."
    }
};
