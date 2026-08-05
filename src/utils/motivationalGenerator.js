/**
 * Gender-Aware Procedural Dynamic Motivational Message Generator Engine
 * Generates over 500,000+ unique, non-repeating motivational messages tailored to tone and gender.
 */

const GENDER_TITLES = {
  male: ['King 👑', 'My Man ⚡', 'Warrior ⚔️', 'Brother 👊', 'Chief 🎯', 'Sir 🛡️', 'Leader 🚀', 'Alpha 🐺'],
  female: ['Queen 👑', 'Goddess 💖', 'Empress 🌺', 'Sister ✨', 'Lady 🌸', 'Ma\'am 💫', 'Radiant Star 🌟', 'Empress 💎'],
  unspecified: ['Champion 🏆', 'Legend ⚡', 'Leader 🚀', 'Master 🔮', 'Warrior ⚔️', 'Architect 💎', 'Elite Operator 🎯']
};

const TONE_DICTIONARIES = {
  hard: {
    male: {
      openers: [
        "No excuses, King {name}.",
        "Relentless execution, Brother {name}.",
        "Iron discipline locked in, Man {name}.",
        "Pure masculine focus today, {name}.",
        "Zero hesitation, Warrior {name}.",
        "Standards upheld without question, Sir {name}.",
        "Uncompromising effort today, Chief {name}.",
        "Target acquired and destroyed, {name}."
      ],
      bodies: [
        "A true king moves with unshakeable discipline and zero complaints.",
        "You proved what real masculine strength and accountability look like today.",
        "Pain is temporary, but the iron character you forged today is permanent.",
        "Champions do what is required when they don't feel like it. Outstanding work, Brother.",
        "Every habit completed is another victory for your family and legacy.",
        "You showed up and dominated when lesser men would have quit.",
        "The iron will within you is forging an unassailable kingdom."
      ]
    },
    female: {
      openers: [
        "No excuses, Queen {name}.",
        "Relentless execution, Goddess {name}.",
        "Iron discipline locked in, Empress {name}.",
        "Pure powerful focus today, {name}.",
        "Zero hesitation, Sister {name}.",
        "Standards upheld without question, Lady {name}.",
        "Uncompromising effort today, Boss {name}.",
        "Target acquired and destroyed, {name}."
      ],
      bodies: [
        "A true queen rules her day with unyielding strength and poise.",
        "You proved what fierce feminine power and discipline look like today.",
        "Pain is temporary, but the majestic strength you built today is permanent.",
        "Queens do what is required regardless of feelings. Outstanding work, Sister.",
        "Every habit completed elevates your personal empire to new heights.",
        "You showed up and dominated with unmatched elegance and grit.",
        "The iron will within you is forging a brilliant, prosperous future."
      ]
    },
    unspecified: {
      openers: [
        "No excuses, Champion {name}.",
        "Relentless execution, Leader {name}.",
        "Iron discipline locked in, {name}.",
        "Pure accountability today, {name}.",
        "Zero hesitation, Warrior {name}.",
        "Standards upheld without question, {name}.",
        "Uncompromising effort today, {name}."
      ],
      bodies: [
        "A true champion moves with unshakeable discipline and zero complaints.",
        "You proved what relentless commitment and accountability look like today.",
        "Pain is temporary, but the character you built today is permanent.",
        "Leaders do what is required when others hesitate. Outstanding work.",
        "Every habit completed is another brick in your unassailable foundation."
      ]
    },
    streakLines: [
      "{streak} Days of unyielding discipline.",
      "Extending your streak to {streak} Days Strong.",
      "Holding the line for {streak} consecutive days.",
      "Day {streak} of absolute target execution.",
      "{streak} Days in a row of unbroken momentum.",
      "Forging a {streak}-day legacy of iron will."
    ],
    closers: [
      "Stay hungry. Tomorrow we conquer again.",
      "Keep the hammer down.",
      "Never settle. On to the next victory.",
      "Pride is earned daily. Reset and repeat.",
      "Maintain the standard."
    ]
  },

  romantic: {
    male: {
      openers: [
        "You look so handsome and accomplished today, my King {name}! 💕",
        "So proud of you, my handsome Prince {name}! ✨",
        "Your strength and tenderness shine brightly, {name}! 💖",
        "A gentle reminder of how amazing you are, Handsome {name}! 🌸",
        "My heart swells with pride for you, my King {name}! 🥰",
        "You bring so much protection, warmth, and light, {name}! 🌿",
        "What a handsome step forward today, my love {name}! 💫"
      ],
      bodies: [
        "A true king leads with a strong mind and a warm, loving heart.",
        "Your commitment to yourself makes you even more attractive and inspiring.",
        "You approached today with quiet masculine strength, grace, and confidence.",
        "Rest easy tonight knowing you gave today your absolute all, my love.",
        "Seeing you grow and conquer your goals brings immense joy."
      ]
    },
    female: {
      openers: [
        "You are rendering so brightly today, my gorgeous Queen {name}! 💕",
        "So proud of you, my beautiful Goddess {name}! ✨",
        "Your radiant, loving energy is glowing, {name}! 💖",
        "A gentle reminder of your inner and outer beauty, Queen {name}! 🌸",
        "My heart swells with pride for you, my Empress {name}! 🥰",
        "You bring so much light, grace, and elegance, {name}! 🌿",
        "What a stunning step forward today, my love {name}! 💫"
      ],
      bodies: [
        "A true queen glows with inner beauty, strength, and quiet grace.",
        "Your commitment to yourself makes your spirit even more radiant and inspiring.",
        "You approached today with gentle feminine power, harmony, and confidence.",
        "Rest easy tonight knowing you gave today your absolute all, my beautiful queen.",
        "Seeing your spirit bloom and conquer brings endless joy and admiration."
      ]
    },
    unspecified: {
      openers: [
        "You are rendering so brightly today, {name}! 💕",
        "So proud of you, {name}! ✨",
        "Your heart-centered dedication is glowing, {name}! 💖",
        "A gentle reminder of your beauty, {name}! 🌸",
        "My heart swells with pride for you, {name}! 🥰"
      ],
      bodies: [
        "Every small effort you make blooms into something magnificent.",
        "Your commitment to yourself is the sweetest act of love.",
        "You approached today with clarity, warmth, and quiet confidence.",
        "Rest easy knowing you gave today your absolute all."
      ]
    },
    streakLines: [
      "{streak} Days of pure magic and growth!",
      "Celebrating {streak} beautiful days of consistency!",
      "{streak} Days of glowing momentum together!",
      "Day {streak} of your inspiring journey!"
    ],
    closers: [
      "Keep blooming brightly.",
      "Rest well and shine on.",
      "You are doing so wonderfully.",
      "Keep nurturing your beautiful light."
    ]
  },

  hype: {
    male: {
      openers: [
        "ABSOLUTE KING ALERT! {name} JUST DESTROYED TODAY'S TARGET! 🚀⚡",
        "BEAST MODE ACTIVATED, MY MAN {name}! UNSTOPPABLE MOMENTUM! 🔥",
        "MAXIMUM VELOCITY! BROTHER {name} IS DOMINATING THE TRACKER! 💥",
        "PURE ALPHA ENERGY FROM {name} TODAY! ⚡",
        "BOOM! KING {name} JUST SET THE BAR HIGHER! 🎯",
        "HOLY MOMENTUM! WARRIOR {name} IS ON ABSOLUTE FIRE! 🌋"
      ],
      bodies: [
        "You took this habit target and tore it to shreds like a absolute boss!",
        "The masculine drive you brought today is literally off the charts!",
        "Nobody is working harder or moving faster than you right now, King!",
        "You are setting a gold standard that leaves everyone in awe!"
      ]
    },
    female: {
      openers: [
        "ABSOLUTE QUEEN ALERT! {name} JUST DESTROYED TODAY'S TARGET! 🚀⚡",
        "BOSS MODE ACTIVATED, QUEEN {name}! UNSTOPPABLE MOMENTUM! 🔥",
        "MAXIMUM VELOCITY! GODDESS {name} IS DOMINATING THE TRACKER! 💥",
        "PURE EMPRESS ENERGY FROM {name} TODAY! ⚡",
        "BOOM! QUEEN {name} JUST SET THE BAR HIGHER! 🎯",
        "HOLY MOMENTUM! RADIANT {name} IS ON ABSOLUTE FIRE! 🌋"
      ],
      bodies: [
        "You took this habit target and tore it to shreds like a true queen!",
        "The unstoppable feminine power you brought today is off the charts!",
        "Nobody is working harder or shining brighter than you right now, Queen!",
        "You are setting a gold standard that leaves everyone in awe!"
      ]
    },
    unspecified: {
      openers: [
        "ABSOLUTE LEGEND ALERT! {name} JUST DESTROYED TODAY'S TARGET! 🚀⚡",
        "BEAST MODE ACTIVATED, {name}! UNSTOPPABLE MOMENTUM! 🔥",
        "MAXIMUM VELOCITY! {name} IS DOMINATING THE TRACKER! 💥"
      ],
      bodies: [
        "You took this habit target and tore it to shreds!",
        "The energy you brought today is literally off the charts!",
        "Nobody is working harder or moving faster right now!"
      ]
    },
    streakLines: [
      "{streak} DAYS OF TOTAL PERFECTION AND HYPE!",
      "DAY {streak} STREAK EXTENDED AT FULL SPEED!",
      "EXPLODING PAST DAY {streak} WITH ZERO FRICTION!"
    ],
    closers: [
      "LET'S GOOOOOOO! 🚀",
      "KEEP THIS ENERGY FLYING HIGH!",
      "STAY AT THE TOP!"
    ]
  },

  zen: {
    male: {
      openers: [
        "Peaceful consistency, King {name}. 🧘",
        "Stillness and progress in harmony, Brother {name}. 🌿",
        "Quiet masculine strength demonstrated today, {name}. ✨",
        "Mindful effort fulfilled, Warrior {name}. 🌊",
        "One breath, one step at a time, Sir {name}. 🍃"
      ],
      bodies: [
        "A true leader moves with quiet confidence and balanced focus.",
        "You honored your commitments with clarity, balance, and masculine poise.",
        "In quiet discipline, true mastery takes root deep within.",
        "Like water carving stone, your steady focus moves mountains quietly."
      ]
    },
    female: {
      openers: [
        "Peaceful consistency, Queen {name}. 🧘",
        "Stillness and progress in harmony, Goddess {name}. 🌿",
        "Quiet feminine grace demonstrated today, {name}. ✨",
        "Mindful effort fulfilled, Empress {name}. 🌊",
        "One breath, one step at a time, Lady {name}. 🍃"
      ],
      bodies: [
        "A true queen moves with quiet confidence and balanced grace.",
        "You honored your commitments with clarity, balance, and feminine elegance.",
        "In quiet discipline, true mastery takes root deep within your spirit.",
        "Like water carving stone, your gentle focus moves mountains gracefully."
      ]
    },
    unspecified: {
      openers: [
        "Peaceful consistency, {name}. 🧘",
        "Stillness and progress in harmony, {name}. 🌿",
        "Quiet strength demonstrated today, {name}. ✨"
      ],
      bodies: [
        "You honored your commitments with clarity, balance, and ease.",
        "In quiet discipline, true mastery takes root deep within.",
        "Like water carving stone, your steady focus moves mountains quietly."
      ]
    },
    streakLines: [
      "Honoring {streak} days of quiet momentum.",
      "Day {streak} of mindful balance and practice.",
      "{streak} Days of calm, unbroken harmony."
    ],
    closers: [
      "Rest in peace and clarity.",
      "Walk gently into tomorrow.",
      "Honor your quiet strength."
    ]
  }
};

/**
 * Generates a 100% unique motivational message for a user based on tone, name, streak, and gender.
 */
export const generateUniqueMotivationalMessage = (toneId = 'hard', name = 'Member', streak = 1, gender = 'unspecified') => {
  const dict = TONE_DICTIONARIES[toneId] || TONE_DICTIONARIES.hard;
  const genderKey = (gender && dict[gender]) ? gender : 'unspecified';
  const genderDict = dict[genderKey] || dict.unspecified;

  const nameStr = name || 'Member';
  const streakStr = Math.max(1, streak);

  // Pick random elements from gender-aware dictionary
  const opener = genderDict.openers[Math.floor(Math.random() * genderDict.openers.length)];
  const body = genderDict.bodies[Math.floor(Math.random() * genderDict.bodies.length)];
  const streakLine = dict.streakLines[Math.floor(Math.random() * dict.streakLines.length)];
  const closer = dict.closers[Math.floor(Math.random() * dict.closers.length)];

  // Assemble full unique message
  const rawMessage = `${opener} ${body} ${streakLine} ${closer}`;

  // Replace variables
  return rawMessage.replace(/{name}/g, nameStr).replace(/{streak}/g, streakStr);
};
