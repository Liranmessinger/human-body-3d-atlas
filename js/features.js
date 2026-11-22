/**
 * Anatoma 3D — Guided Body Tours, Pathology & Health Lab, and Mastery Ranks (EN + HE)
 */
(function (global) {
  'use strict';

  const EXTRA_UI = {
    en: {
      mriSlice: 'MRI Cross-Section',
      toolSound: 'Sound',
      readAloud: 'Read Aloud',
      stopReading: 'Stop Audio',
      guidedTours: 'Guided 3D Tours',
      tourPrev: '← Prev',
      tourNext: 'Next →',
      tourPlay: '▶ Auto',
      tourPause: '⏸ Pause',
      tourVoice: '🔊 Narrate',
      tourVoiceOn: '🔊 Voice ON',
      tourExit: '✕',
      tourStepOf: 'Step {cur} / {tot}',
      pathologyLab: 'Pathology & Health Lab',
      masteryTitle: '🏆 Anatomy Mastery & Medals',
      masterySubtitle: 'Your progress is saved automatically in your browser.',
      rankLabel: 'Current Rank',
      totalXpLabel: 'Total XP',
      bestStreakLabel: 'Best Streak',
      discoveredLabel: 'Discovered',
      systemMedals: '11 Body System Medals',
      resetProgress: 'Reset Progress',
      resetConfirm: 'Reset all saved XP and discovered organs?',
      rank1: 'Curious Explorer',
      rank2: 'Anatomy Student',
      rank3: 'Clinical Resident',
      rank4: 'Chief Surgeon',
      rank5: 'Master of Human Anatomy',
      dockSystems: 'Systems',
      dockDissect: 'Dissect',
      dockTours: 'Tours',
      dockLab: 'Health Lab',
      dockPhysio: 'Physiology'
    },
    he: {
      mriSlice: 'חתך רוחב MRI',
      toolSound: 'שמע',
      readAloud: 'הקרא הסבר',
      stopReading: 'עצור הקראה',
      guidedTours: 'סיורים מודרכים בתלת־ממד',
      tourPrev: 'הקודם →',
      tourNext: '← הבא',
      tourPlay: '▶ אוטומטי',
      tourPause: '⏸ השהה',
      tourVoice: '🔊 קריינות',
      tourVoiceOn: '🔊 קריינות פעילה',
      tourExit: '✕',
      tourStepOf: 'שלב {cur} / {tot}',
      pathologyLab: 'מעבדת בריאות ומחלות',
      masteryTitle: '🏆 מדליות שליטה והתקדמות',
      masterySubtitle: 'ההתקדמות שלך נשמרת אוטומטית בדפדפן.',
      rankLabel: 'דרגה נוכחית',
      totalXpLabel: 'סה״כ נקודות',
      bestStreakLabel: 'רצף שיא',
      discoveredLabel: 'איברים שנחקרו',
      systemMedals: 'מדליות ל־11 מערכות הגוף',
      resetProgress: 'אפס התקדמות',
      resetConfirm: 'לאפס את כל הנקודות והאיברים שנחקרו?',
      rank1: 'חוקר סקרן',
      rank2: 'סטודנט לאנטומיה',
      rank3: 'מתמחה ברפואה',
      rank4: 'רופא בכיר',
      rank5: 'מאסטר גוף האדם',
      dockSystems: 'מערכות',
      dockDissect: 'ניתוח 3D',
      dockTours: 'סיורים',
      dockLab: 'מעבדה',
      dockPhysio: 'פיזיולוגיה'
    }
  };

  // Extend AnatomaI18n.t cleanly
  const I18n = global.AnatomaI18n;
  const prevT = I18n.t;
  I18n.t = function (key, vars) {
    const lang = I18n.getLang();
    const dict = EXTRA_UI[lang] || EXTRA_UI.en;
    if (dict[key] !== undefined) {
      let str = dict[key];
      if (vars) {
        Object.keys(vars).forEach((k) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k]));
        });
      }
      return str;
    }
    return prevT(key, vars);
  };

  const TOURS = {
    blood: {
      id: 'blood',
      icon: '❤️',
      title: { en: 'Journey of Blood', he: 'מסלול מחזור הדם' },
      steps: [
        {
          organId: 'heart',
          note: {
            en: 'Our journey begins in the right heart: it pumps oxygen-poor blood toward the lungs to recharge.',
            he: 'המסע מתחיל בצד הימני של הלב, שמזרים דם עני בחמצן אל הריאות כדי להיטען מחדש.'
          }
        },
        {
          organId: 'lungs',
          note: {
            en: 'In the lungs, red blood cells drop off carbon dioxide and load up with fresh oxygen, turning bright crimson!',
            he: 'בריאות תאי הדם האדומים פורקים פחמן דו־חמצני ונטענים בחמצן טרי — והדם הופך לאדום עז!'
          }
        },
        {
          organId: 'aorta_vessels',
          note: {
            en: 'Returning to the left heart, oxygenated blood blasts into the aorta and branches through 100,000 km of vessels.',
            he: 'הדם חוזר לצד השמאלי של הלב ונורה דרך אבי העורקים אל רשת ענקית של כ־100,000 ק״מ כלי דם.'
          }
        },
        {
          organId: 'brain',
          note: {
            en: 'Carotid arteries rush fresh blood up to the brain, which gets first priority for oxygen and glucose.',
            he: 'עורקי התרדמה מובילים דם טרי מעלה למוח, שמקבל עדיפות ראשונה לחמצן וגלוקוז.'
          }
        },
        {
          organId: 'kidneys',
          note: {
            en: 'About 20% of every heartbeat flows into the kidneys, which filter out wastes and balance salts.',
            he: 'כ־20% מכל פעימת לב זורמים אל הכליות, שמסננות פסולת ומאזנות מלחים ומים.'
          }
        },
        {
          organId: 'spleen',
          note: {
            en: 'Finally, the spleen inspects red blood cells, recycling worn-out ones before veins carry blood back to the heart!',
            he: 'לבסוף הטחול בודק את תאי הדם האדומים וממחזר ישנים לפני שהוורידים מחזירים את הדם אל הלב!'
          }
        }
      ]
    },
    breath: {
      id: 'breath',
      icon: '🫁',
      title: { en: 'Journey of a Breath', he: 'מסלול הנשימה והחמצן' },
      steps: [
        {
          organId: 'nose',
          note: {
            en: 'Air enters the nose, where curved passages warm, humidify, and filter dust out.',
            he: 'האוויר נכנס דרך האף, שם הוא מתחמם, מתלחלח ומסתנן מאבק.'
          }
        },
        {
          organId: 'trachea',
          note: {
            en: 'Clean air travels down the cartilage-ringed trachea and splits into both bronchi.',
            he: 'האוויר הנקי יורד בקנה הנשימה המחוזק בסחוס ומתפצל לשני הסמפונות.'
          }
        },
        {
          organId: 'lungs',
          note: {
            en: 'Inside millions of alveoli, oxygen diffuses into red blood cells while CO₂ exits.',
            he: 'בתוך מיליוני הנאדיות החמצן עובר לתאי הדם האדומים והפחמן הדו־חמצני יוצא.'
          }
        },
        {
          organId: 'heart',
          note: {
            en: 'Oxygen-rich blood arrives at the left heart and is pumped powerfully to the entire body.',
            he: 'הדם העשיר בחמצן מגיע לצד השמאלי של הלב ומוזרם בעוצמה לכל הגוף.'
          }
        },
        {
          organId: 'brain',
          note: {
            en: 'The brain alone consumes ~20% of all oxygen you breathe to power thought and life!',
            he: 'המוח לבדו צורך כ־20% מכלל החמצן שאתה נושם כדי להפעיל מחשבה וחיים!'
          }
        }
      ]
    },
    digestion: {
      id: 'digestion',
      icon: '🍽️',
      title: { en: 'Journey of Food', he: 'מסלול האוכל והעיכול' },
      steps: [
        {
          organId: 'mouth',
          note: {
            en: 'Digestion starts immediately: 32 teeth grind food while saliva enzymes break down starches.',
            he: 'העיכול מתחיל מיד: השיניים טוחנות את המזון ואנזימי הרוק מתחילים לפרק פחמימות.'
          }
        },
        {
          organId: 'esophagus',
          note: {
            en: 'Muscular peristaltic waves squeeze swallowed food down the esophagus to the stomach.',
            he: 'גלי התכווצות שריריים דוחפים את המזון במורד הוושט אל הקיבה.'
          }
        },
        {
          organId: 'stomach',
          note: {
            en: 'Strong acid and churning muscles turn the meal into liquid chyme and start digesting protein.',
            he: 'חומצה חזקה ושרירים מערבלים הופכים את הארוחה לעיסה נוזלית ומפרקים חלבונים.'
          }
        },
        {
          organId: 'liver',
          note: {
            en: 'The liver produces bile (stored in the gallbladder) to break fat droplets down.',
            he: 'הכבד מייצר מיץ מרה (הנאגר בכיס המרה) כדי לפרק טיפות שומן.'
          }
        },
        {
          organId: 'pancreas',
          note: {
            en: 'The pancreas adds digestive enzymes and releases insulin to balance rising blood sugar.',
            he: 'הלבלב מוסיף אנזימי עיכול ומשחרר אינסולין לאיזון הסוכר העולה בדם.'
          }
        },
        {
          organId: 'small_intestine',
          note: {
            en: 'Across 6 meters of coiled small intestine, ~90% of nutrients absorb into the bloodstream.',
            he: 'לאורך 6 מטרים של מעי דק נספגים כ־90% מחומרי המזון אל מחזור הדם.'
          }
        },
        {
          organId: 'large_intestine',
          note: {
            en: 'Finally, the colon reclaims water while trillions of gut microbes synthesize vitamins.',
            he: 'לבסוף המעי הגס סופג חזרה מים וחיידקי המעיים מייצרים ויטמינים חיוניים.'
          }
        }
      ]
    },
    reflex: {
      id: 'reflex',
      icon: '⚡',
      title: { en: 'Command & Movement', he: 'מסלול פקודה ותנועה' },
      steps: [
        {
          organId: 'eyes',
          note: {
            en: 'Your eyes spot a ball flying toward you and stream visual signals along the optic nerve.',
            he: 'העיניים מזהות כדור מתקרב ומשדרות אותות ראייה מהירים בעצב הראייה.'
          }
        },
        {
          organId: 'brain',
          note: {
            en: 'In milliseconds, the motor cortex plans the exact movement needed to catch it.',
            he: 'בתוך אלפיות השנייה קליפת המוח המוטורית מתכננת את התנועה המדויקת.'
          }
        },
        {
          organId: 'spinal_cord',
          note: {
            en: 'Electrical motor commands race down the spinal cord superhighway.',
            he: 'פקודות תנועה חשמליות טסות במורד אוטוסטרדת חוט השדרה.'
          }
        },
        {
          organId: 'peripheral_nerves',
          note: {
            en: 'Peripheral nerves branch out into your arm to deliver the signal directly to muscle fibers.',
            he: 'העצבים ההיקפיים מתפצלים אל הזרוע ומעבירים את הפקודה ישירות לסיבי השריר.'
          }
        },
        {
          organId: 'biceps',
          note: {
            en: 'Muscle fibers contract smoothly, lifting your arm and flexing the elbow to make the catch!',
            he: 'סיבי השריר מתכווצים בחלקות, מכופפים את המרפק ומבצעים את התפיסה!'
          }
        }
      ]
    },
    immune: {
      id: 'immune',
      icon: '🛡️',
      title: { en: 'Immune Defense Mission', he: 'מסע ההגנה החיסונית' },
      steps: [
        {
          organId: 'skin',
          note: {
            en: 'First line of defense: your waterproof skin barrier physically blocks billions of microbes every day.',
            he: 'קו ההגנה הראשון: העור העמיד למים חוסם פיזית מיליארדי חיידקים ונגיפים בכל יום.'
          }
        },
        {
          organId: 'nose',
          note: {
            en: 'Sticky nasal mucus and microscopic sweeping hairs trap airborne germs before they reach the lungs.',
            he: 'ריר האף והשעריות המיקרוסקופיות לוכדים מזהמים מהאוויר עוד לפני שהם מגיעים לריאות.'
          }
        },
        {
          organId: 'thymus',
          note: {
            en: 'Inside the thymus academy, specialized T-cells are trained to recognize and eliminate viral invaders.',
            he: 'בתוך בלוטת התימוס עוברים תאי ה־T אימון מיוחד לזהות ולהשמיד נגיפים ופולשים.'
          }
        },
        {
          organId: 'lymph_nodes',
          note: {
            en: 'Lymph nodes act as security checkpoints — multiplying antibody-producing B-cells whenever an infection appears.',
            he: 'קשרי הלימפה משמשים כעמדות בידוק ומייצרים במהירות תאי B ונוגדנים בעת זיהום.'
          }
        },
        {
          organId: 'spleen',
          note: {
            en: 'The spleen patrols the bloodstream itself, capturing bloodborne bacteria and storing immune reserves!',
            he: 'הטחול מסייר במחזור הדם עצמו, לוכד חיידקים בדם ושומר מאגרי תאי חיסון לשעת חירום!'
          }
        }
      ]
    },
    hormones: {
      id: 'hormones',
      icon: '🧪',
      title: { en: 'Hormone & Adrenaline Rush', he: 'מסלול ההורמונים והאדרנלין' },
      steps: [
        {
          organId: 'brain',
          note: {
            en: 'You hear a sudden loud noise — the brain’s hypothalamus instantly sounds the hormonal alarm.',
            he: 'נשמע רעש פתאומי — ההיפותלמוס שבמוח מפעיל מיד את אזעקת החירום ההורמונלית.'
          }
        },
        {
          organId: 'pituitary',
          note: {
            en: 'The pea-sized pituitary master gland sends chemical messenger hormones racing into the bloodstream.',
            he: 'בלוטת יותרת המוח הזעירה משגרת שליחים כימיים (הורמונים) היישר אל מחזור הדם.'
          }
        },
        {
          organId: 'thyroid',
          note: {
            en: 'Meanwhile, the butterfly-shaped thyroid sets your body’s baseline metabolic engine and energy burn.',
            he: 'במקביל, בלוטת התריס בצורת הפרפר מכוונת את קצב חילוף החומרים ושריפת האנרגיה של הגוף.'
          }
        },
        {
          organId: 'adrenals',
          note: {
            en: 'The adrenal glands above your kidneys unleash a surge of adrenaline in under 2 seconds!',
            he: 'בלוטות יותרת הכליה שמעל הכליות משחררות פרץ אדרנלין בתוך פחות משתי שניות!'
          }
        },
        {
          organId: 'heart',
          note: {
            en: 'Adrenaline tells the heart to beat faster and stronger, rushing fuel and oxygen to your muscles.',
            he: 'האדרנלין פוקד על הלב לפעום מהר וחזק יותר ולהזרים דלק וחמצן אל השרירים.'
          }
        },
        {
          organId: 'pancreas',
          note: {
            en: 'Once the rush passes, the pancreas releases insulin to bring elevated energy sugar back to calm balance.',
            he: 'לאחר שהמתח חולף, הלבלב מפריש אינסולין כדי להחזיר את רמת הסוכר בדם לאיזון רגוע.'
          }
        }
      ]
    },
    water: {
      id: 'water',
      icon: '💧',
      title: { en: 'Journey of a Glass of Water', he: 'מסלול כוס מים וסינון הדם' },
      steps: [
        {
          organId: 'mouth',
          note: {
            en: 'You take a refreshing sip of water — it glides past the tongue and throat into the digestive tract.',
            he: 'אתה לוגם כוס מים קרירים — המים עוברים דרך הפה והגרון אל מערכת העיכול.'
          }
        },
        {
          organId: 'stomach',
          note: {
            en: 'Unlike solid meals, water passes rapidly through the stomach in just 5 to 15 minutes.',
            he: 'בניגוד למזון מוצק, מים עוברים דרך הקיבה במהירות בתוך כ־5 עד 15 דקות בלבד.'
          }
        },
        {
          organId: 'small_intestine',
          note: {
            en: 'Most of the water is absorbed through the walls of the small intestine straight into your blood plasma.',
            he: 'רוב המים נספגים דרך דופן המעי הדק ישירות אל תוך פלזמת הדם שלך.'
          }
        },
        {
          organId: 'aorta_vessels',
          note: {
            en: 'Freshly hydrated blood circulates smoothly, keeping blood volume healthy and delivering moisture to every cell.',
            he: 'הדם הרווי במים זורם בקלות, שומר על נפח דם תקין ומרווה כל תא בגוף.'
          }
        },
        {
          organId: 'kidneys',
          note: {
            en: 'Your kidneys filter the blood through 2 million nephrons, keeping needed water and separating waste into urine.',
            he: 'הכליות מסננות את הדם דרך כ־2 מיליון נפרונים, שומרות מים נחוצים ומפרידות פסולת לשתן.'
          }
        },
        {
          organId: 'bladder',
          note: {
            en: 'Excess water and filtered wastes trickle down the ureters into the bladder until it is time to release.',
            he: 'עודפי המים והפסולת מטפטפים בשופכנים אל שלפוחית השתן עד למועד ההתרוקנות.'
          }
        }
      ]
    }
  };

  const PATHOLOGIES = {
    healthy: {
      id: 'healthy',
      icon: '✅',
      name: { en: 'Healthy Baseline', he: 'בריא ומאוזן' },
      description: {
        en: 'All organs and systems are functioning at healthy baseline homeostasis.',
        he: 'כל האיברים והמערכות פועלים באיזון בריא ותקין (הומאוסטזיס).'
      },
      affectedOrgans: [],
      tintHex: null,
      vitalMods: {}
    },
    cardiac_arrest: {
      id: 'cardiac_arrest',
      icon: '💔',
      name: { en: 'Cardiac Arrest', he: 'דום לב' },
      description: {
        en: 'Medical emergency: the heart’s electrical rhythm stops abruptly (0 BPM flatline), halting oxygenated blood flow to the brain and body. Immediate CPR chest compressions and an AED defibrillator are critical within minutes to restore heartbeat.',
        he: 'מצב חירום רפואי: הפעילות החשמלית של הלב נעצרת בפתאומיות (דופק 0 וקו שטוח בא.ק.ג), וזרימת הדם המחומצן למוח ולגוף נפסקת. עיסויי לב מיידיים (החייאה) ומכשיר דפיברילטור תוך דקות קריטיים להצלת חיים.'
      },
      affectedOrgans: ['heart', 'aorta_vessels', 'brain'],
      tintHex: 0xef4444,
      vitalMods: { bpm: 0, respRate: 0, spo2: 72, bpSys: 0, bpDia: 0, brainHz: 0.08 }
    },
    stroke: {
      id: 'stroke',
      icon: '🧠',
      name: { en: 'Stroke', he: 'שבץ מוחי' },
      description: {
        en: 'A blood clot blocks or a vessel ruptures inside the brain, cutting off oxygen to brain neurons within minutes. Blood pressure often spikes sharply. Remember FAST warning signs: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services.',
        he: 'קריש דם חוסם כלי דם במוח (או כלי דם נקרע), ומונע הגעת חמצן לתאי המוח בתוך דקות. לחץ הדם מזנק בחדות. סימני האזהרה הקריטיים: צניחת צד בפנים, חולשה ביד, קושי בדיבור — הזעקת עזרה רפואית מיידית מצילה תפקוד מוחי.'
      },
      affectedOrgans: ['brain', 'aorta_vessels'],
      tintHex: 0xdc2626,
      vitalMods: { bpm: 102, bpSys: 178, bpDia: 104, brainHz: 0.25 }
    },
    flu: {
      id: 'flu',
      icon: '🤒',
      name: { en: 'Influenza (Flu)', he: 'שפעת' },
      description: {
        en: 'Influenza viruses infect the nose, trachea, and upper lungs. The immune system triggers fever (raising heart rate and breathing) while lymph nodes swell as white blood cells multiply to clear the virus.',
        he: 'נגיף השפעת תוקף את האף, קנה הנשימה ודרכי הנשימה העליונות. מערכת החיסון מעלה את חום הגוף (מה שמאיץ דופק ונשימה), וקשרי הלימפה מתנפחים בזמן שתאי הדם הלבנים מתרבים כדי להשמיד את הנגיף.'
      },
      affectedOrgans: ['nose', 'trachea', 'lungs', 'lymph_nodes'],
      tintHex: 0xf97316,
      vitalMods: { bpm: 108, respRate: 22, spo2: 96 }
    },
    asthma: {
      id: 'asthma',
      icon: '💨',
      name: { en: 'Asthma Attack', he: 'התקף אסתמה' },
      description: {
        en: 'Airways (bronchi) tighten and swell with mucus, narrowing airflow into the lungs. Breathing becomes rapid and labored while blood oxygen dips (~91%) and the diaphragm works overtime.',
        he: 'דרכי האוויר (הסמפונות) מתכווצות ומתנפחות עם ריר, ומקשות על כניסת אוויר לריאות. הנשימה הופכת מהירה ומאומצת, רמת החמצן בדם יורדת (~91%) והסרעפת עובדת במאמץ מוגבר.'
      },
      affectedOrgans: ['trachea', 'lungs', 'diaphragm'],
      tintHex: 0x6366f1,
      vitalMods: { bpm: 116, respRate: 32, spo2: 91 }
    },
    acid_reflux: {
      id: 'acid_reflux',
      icon: '🔥',
      name: { en: 'Acid Reflux', he: 'צרבת / ריפלוקס' },
      description: {
        en: 'The muscular valve at the bottom of the esophagus relaxes at the wrong time, allowing strong stomach acid (pH ~1.5) to splash upward and irritate the sensitive esophageal lining.',
        he: 'השסתום השרירי שבתחתית הוושט נרפה בזמן לא מתאים, ומאפשר לחומצת הקיבה החזקה לעלות כלפי מעלה ולגרות את רירית הוושט הרגישה — מה שיוצר תחושת צריבה בחזה.'
      },
      affectedOrgans: ['esophagus', 'stomach'],
      tintHex: 0xea580c,
      vitalMods: { bpm: 78, digestion: 1.4 }
    },
    kidney_stones: {
      id: 'kidney_stones',
      icon: '🪨',
      name: { en: 'Kidney Stones', he: 'אבנים בכליות' },
      description: {
        en: 'Concentrated minerals and salts crystallize inside the kidneys into hard stones. Passing a stone down the narrow ureter toward the bladder triggers intense pain and elevated blood pressure.',
        he: 'מלחים ומינרלים מרוכזים מתגבשים בתוך הכליות לאבנים קשות. מעבר אבן דרך השופכן הצר לכיוון שלפוחית השתן גורם לכאב חד ולעלייה זמנית בדופק ובלחץ הדם.'
      },
      affectedOrgans: ['kidneys', 'bladder'],
      tintHex: 0xd97706,
      vitalMods: { bpm: 94, bpSys: 138, bpDia: 88 }
    },
    smoking: {
      id: 'smoking',
      icon: '🚬',
      name: { en: 'Smoking Impact', he: 'השפעת עישון' },
      description: {
        en: 'Tar & smoke darken lung tissue, stiffen delicate alveoli, reduce blood O₂ saturation (~93%), and force faster breathing.',
        he: 'עשן וזפת מכתימים את רקמת הריאות, פוגעים בגמישות הנאדיות, מורידים את רמת החמצן בדם (~93%) ומאמצים את הנשימה.'
      },
      affectedOrgans: ['lungs', 'trachea'],
      tintHex: 0x475569,
      vitalMods: { spo2: 93, respRate: 22, bpm: 88 }
    },
    dehydration: {
      id: 'dehydration',
      icon: '💧',
      name: { en: 'Dehydration', he: 'התייבשות' },
      description: {
        en: 'Low fluid volume makes the heart beat faster (~98 BPM) to keep blood pressure up while the kidneys work overtime conserving water.',
        he: 'מחסור בנוזלים גורם ללב לפעום מהר יותר (~98 פ/ד) לשמירת לחץ הדם, בזמן שהכליות עובדות קשה לחסוך מים.'
      },
      affectedOrgans: ['kidneys', 'bladder'],
      tintHex: 0xf59e0b,
      vitalMods: { bpm: 98, bpSys: 104, bpDia: 68 }
    },
    diabetes: {
      id: 'diabetes',
      icon: '🍬',
      name: { en: 'High Blood Sugar', he: 'סוכר גבוה (סוכרת)' },
      description: {
        en: 'When the pancreas cannot produce or signal enough insulin, glucose builds up in blood vessels — highlighting why pancreatic islets are vital.',
        he: 'כאשר הלבלב אינו מייצר או מפעיל מספיק אינסולין, גלוקוז מצטבר בכלי הדם — מה שמדגיש את חשיבות איי הלבלב.'
      },
      affectedOrgans: ['pancreas', 'aorta_vessels'],
      tintHex: 0xfacc15,
      vitalMods: { bpm: 84, bpSys: 132, bpDia: 82 }
    },
    virus: {
      id: 'virus',
      icon: '🦠',
      name: { en: 'Viral Defense', he: 'תגובה חיסונית לנגיף' },
      description: {
        en: 'Immune response active! Lymph nodes, thymus, and spleen ramp up T-cells and antibodies while heart rate elevates to rush white blood cells.',
        he: 'מערכת החיסון בפעולה! קשרי הלימפה, התימוס והטחול מגבירים ייצור תאי T ונוגדנים, והדופק עולה להזרמת תאי חיסון.'
      },
      affectedOrgans: ['lymph_nodes', 'thymus', 'spleen'],
      tintHex: 0x10b981,
      vitalMods: { bpm: 104, respRate: 20 }
    }
  };

  function getRankKey(percent) {
    if (percent >= 95) return 'rank5';
    if (percent >= 70) return 'rank4';
    if (percent >= 45) return 'rank3';
    if (percent >= 20) return 'rank2';
    return 'rank1';
  }

  global.AnatomaFeatures = {
    TOURS,
    PATHOLOGIES,
    getRankKey
  };
})(window);
