/**
 * Anatoma 3D — Complete 11-System Expansion (EN + HE)
 * Adds: Endocrine System, Lymphatic & Immune System, Reproductive System (Male & Female),
 * and Integumentary System (Skin) — completing all 11 major systems of the human body!
 */
(function (global) {
  'use strict';

  const NEW_SYSTEMS_EN = {
    endocrine: {
      id: 'endocrine',
      name: 'Endocrine System',
      shortName: 'Endocrine',
      color: '#14b8a6',
      hex: 0x14b8a6,
      icon: '🧪',
      tagline: 'Chemical hormone messengers regulating metabolism, growth, and mood.',
      overview:
        'A network of hormone-secreting glands that release chemical messengers directly into the bloodstream to coordinate metabolism, growth, stress response, sleep, and reproduction.',
      keyOrgans: ['pituitary', 'thyroid', 'adrenals', 'pancreas'],
      howItWorks:
        'Controlled by the hypothalamus and pituitary gland in the brain, endocrine glands continuously monitor blood chemistry and release precise doses of hormones via feedback loops.',
      funFact: 'Unlike fast millisecond nerve signals, hormones travel through the blood and can coordinate body changes lasting hours, days, or years.'
    },
    lymphatic: {
      id: 'lymphatic',
      name: 'Lymphatic & Immune System',
      shortName: 'Immune',
      color: '#22c55e',
      hex: 0x22c55e,
      icon: '🛡️',
      tagline: 'Defense force against infections and drainage network for body fluids.',
      overview:
        'Protects the body from bacteria, viruses, and abnormal cells while draining excess fluid (lymph) from tissues back into the bloodstream and absorbing dietary fats.',
      keyOrgans: ['thymus', 'lymph_nodes', 'spleen'],
      howItWorks:
        'Lymph fluid flows through vessels into hundreds of bean-shaped lymph nodes packed with white blood cells (lymphocytes) that detect and destroy invaders.',
      funFact: 'Your lymphatic system drains and returns roughly 2 to 4 liters of fluid back into your bloodstream every single day.'
    },
    reproductive: {
      id: 'reproductive',
      name: 'Reproductive System',
      shortName: 'Reproductive',
      color: '#ec4899',
      hex: 0xec4899,
      icon: '🧬',
      tagline: 'Specialized organs enabling human reproduction and sex hormone balance.',
      overview:
        'Produces specialized reproductive cells (eggs in females, sperm in males) and key sex hormones (estrogen, progesterone, testosterone) that guide development and fertility.',
      keyOrgans: ['prostate', 'testes'], // Dynamically updated by Male/Female switch
      maleOrgans: ['prostate', 'testes'],
      femaleOrgans: ['uterus', 'ovaries'],
      howItWorks:
        'Guided by brain hormones from the pituitary gland, reproductive organs mature gametes and maintain hormone cycles. Switch between Male (♂) and Female (♀) to explore both!',
      funFact: 'The human egg cell (ovum) is the largest cell in the human body, while the sperm cell is the smallest.'
    },
    integumentary: {
      id: 'integumentary',
      name: 'Integumentary System (Skin)',
      shortName: 'Skin & Coat',
      color: '#f472b6',
      hex: 0xf472b6,
      icon: '✨',
      tagline: 'Protective waterproof shield, temperature regulator, and touch sensor.',
      overview:
        'Consists of the skin, hair, nails, sweat glands, and oil glands. It forms the body’s first line of defense against microbes, UV radiation, injury, and dehydration.',
      keyOrgans: ['skin'],
      howItWorks:
        'Three layers — epidermis (waterproof outer barrier), dermis (blood vessels, nerves, sweat glands), and hypodermis (insulating fat) — continuously renew and protect your body.',
      funFact: 'Skin is the largest organ of the human body, covering ~1.8 square meters and renewing its outer layer every ~28 days.'
    }
  };

  const NEW_SYSTEMS_HE = {
    endocrine: {
      name: 'המערכת ההורמונלית (אנדוקרינית)',
      shortName: 'הורמונלית',
      tagline: 'שליחים כימיים (הורמונים) המווסתים חילוף חומרים, גדילה ומצב רוח.',
      overview:
        'רשת של בלוטות המפרישות הורמונים ישירות אל מחזור הדם כדי לתאם חילוף חומרים, גדילה, תגובה ללחץ, שינה ורבייה.',
      howItWorks:
        'בפיקוח ההיפותלמוס ובלוטת יותרת המוח, הבלוטות עוקבות אחר הרכב הדם ומשחררות מינונים מדויקים של הורמונים במנגנוני משוב.',
      funFact: 'בניגוד לאותות עצב מהירים, הורמונים נעים בדם ומסוגלים לווסת תהליכים הנמשכים שעות, ימים ואף שנים.'
    },
    lymphatic: {
      name: 'מערכת הלימפה והחיסון',
      shortName: 'חיסון ולימפה',
      tagline: 'צבא ההגנה מפני זיהומים ורשת הניקוז של נוזלי הגוף.',
      overview:
        'מגנה על הגוף מפני חיידקים, נגיפים ותאים חריגים, תוך ניקוז נוזלים עודפים (לימפה) מהרקמות חזרה אל מחזור הדם.',
      howItWorks:
        'נוזל הלימפה זורם דרך כלי לימפה אל מאות קשרי לימפה עמוסים בתאי דם לבנים (לימפוציטים) המזהים ומשמידים פולשים.',
      funFact: 'מערכת הלימפה מנקזת ומחזירה לדם כ־2 עד 4 ליטרים של נוזלים בכל יום.'
    },
    reproductive: {
      name: 'מערכת הרבייה',
      shortName: 'רבייה',
      tagline: 'איברים מתמחים לרבייה אנושית ולאיזון הורמוני המין.',
      overview:
        'מייצרת תאי רבייה (ביציות באישה, זרע בגבר) והורמוני מין (אסטרוגן, פרוגסטרון וטסטוסטרון) המכוונים התפתחות ופוריות.',
      howItWorks:
        'בהנחיית הורמונים מבלוטת יותרת המוח, איברי הרבייה מבשילים תאי מין ומנהלים מחזורים הורמונליים. ניתן לעבור בין גבר (♂) לאישה (♀) בסרגל העליון!',
      funFact: 'הביצית היא התא הגדול ביותר בגוף האדם, בעוד תא הזרע הוא התא הקטן ביותר.'
    },
    integumentary: {
      name: 'מערכת הכסות (העור)',
      shortName: 'העור',
      tagline: 'מגן עמיד למים, וסת חום הגוף וחיישן המגע הגדול ביותר.',
      overview:
        'כוללת את העור, השיער, הציפורניים, בלוטות הזיעה ובלוטות החלב. מהווה את קו ההגנה הראשון מול חיידקים, קרינת UV, פציעות והתייבשות.',
      howItWorks:
        'שלוש שכבות — אפידרמיס (שכבת מגן חיצונית), דרמיס (כלי דם, עצבים ובלוטות זיעה) והיפודרמיס (שכבת בידוד) — מתחדשות ללא הרף.',
      funFact: 'העור הוא האיבר הגדול ביותר בגוף האדם — שטחו כ־1.8 מ״ר ושכבתו החיצונית מתחדשת כל כ־28 יום.'
    }
  };

  const NEW_ORGANS_EN = {
    // Endocrine
    pituitary: {
      id: 'pituitary',
      name: 'Pituitary Gland',
      latin: 'Hypophysis',
      system: 'endocrine',
      location: 'Base of the brain, directly beneath the hypothalamus',
      weight: '~0.5 g (size of a pea)',
      summary:
        'Known as the "master gland" of the endocrine system — this tiny pea-sized command hub directs the thyroid, adrenals, growth, and reproductive glands.',
      howItWorks:
        'Receives chemical instructions from the brain’s hypothalamus and secretes key hormones (growth hormone, TSH, ACTH, oxytocin) into the blood to orchestrate other glands.',
      functions: [
        'Controls growth, bone development, and tissue repair',
        'Signals the thyroid and adrenal glands when to release hormones',
        'Regulates water balance (ADH) and reproductive cycles'
      ],
      connections: ['brain', 'thyroid', 'adrenals'],
      funFact: 'Despite being no bigger than a garden pea, the pituitary gland produces at least 8 vital hormones.',
      healthTip: 'Consistent sleep schedules support natural nighttime pulses of growth hormone.'
    },
    thyroid: {
      id: 'thyroid',
      name: 'Thyroid Gland',
      latin: 'Glandula thyroidea',
      system: 'endocrine',
      location: 'Front of the lower neck, wrapped around the windpipe',
      weight: '~20–25 g (butterfly-shaped)',
      summary:
        'A butterfly-shaped gland in the neck that sets your body’s metabolic speed — controlling how fast cells burn energy, generate heat, and stay alert.',
      howItWorks:
        'Uses dietary iodine to manufacture thyroid hormones (T3 and T4), which travel to nearly every cell in the body to regulate oxygen use, heart rate, and body temperature.',
      functions: [
        'Sets baseline metabolic rate and daily energy levels',
        'Helps regulate body temperature and heart rhythm',
        'Supports brain development and calcium balance (calcitonin)'
      ],
      connections: ['pituitary', 'trachea', 'heart'],
      funFact: 'Tiny traces of iodine from seafood or iodized salt are essential building blocks for thyroid hormones.',
      healthTip: 'A balanced diet with adequate iodine and selenium supports healthy thyroid hormone production.'
    },
    adrenals: {
      id: 'adrenals',
      name: 'Adrenal Glands',
      latin: 'Glandulae suprarenales',
      system: 'endocrine',
      location: 'Perched like triangular caps directly on top of both kidneys',
      weight: '~5 g each',
      summary:
        'Your body’s rapid-response stress and energy glands — producing adrenaline for instant action and cortisol for metabolism and blood pressure balance.',
      howItWorks:
        'The inner medulla fires adrenaline (epinephrine) during fight-or-flight moments, while the outer cortex releases cortisol and aldosterone to manage salt, water, and long-term stress.',
      functions: [
        'Releases adrenaline to boost heart rate and focus during emergencies',
        'Produces cortisol to regulate blood sugar and inflammation',
        'Balances blood pressure and salt levels via aldosterone'
      ],
      connections: ['kidneys', 'heart', 'pituitary'],
      funFact: 'Adrenaline can prepare your muscles and heart for peak emergency performance in less than two seconds!',
      healthTip: 'Deep breathing, exercise, and rest help keep chronic stress cortisol levels balanced.'
    },

    // Lymphatic & Immune
    thymus: {
      id: 'thymus',
      name: 'Thymus Gland',
      latin: 'Thymus',
      system: 'lymphatic',
      location: 'Upper chest behind the sternum, right above the heart',
      weight: '~25–35 g (largest in youth)',
      summary:
        'The specialized "training academy" of your immune system where immature white blood cells mature into pathogen-fighting T-cells.',
      howItWorks:
        'Stem cells from bone marrow travel to the thymus, where they learn to recognize foreign viruses and bacteria while being carefully screened so they do not attack your own healthy cells.',
      functions: [
        'Trains and matures T-lymphocytes (T-cells) for targeted immunity',
        'Teaches immune cells "self-tolerance" to prevent autoimmunity',
        'Secretes thymosin hormones supporting immune readiness'
      ],
      connections: ['heart', 'lymph_nodes', 'spleen'],
      funFact: 'The thymus is most active during childhood and adolescence, building a lifelong army of memory T-cells.',
      healthTip: 'Good nutrition, zinc, vitamin C, and sleep help your T-cells stay sharp.'
    },
    lymph_nodes: {
      id: 'lymph_nodes',
      name: 'Lymph Nodes & Vessels',
      latin: 'Nodi lymphatici',
      system: 'lymphatic',
      location: 'Clustered in the neck, armpits, chest, abdomen, and groin',
      weight: '~600–700 tiny bean-shaped filter stations',
      summary:
        'Hundreds of microscopic security checkpoints linked by drainage vessels that filter tissue fluid, trap germs, and launch rapid immune defenses.',
      howItWorks:
        'Clear lymph fluid collected from between body cells passes through lymph nodes where resident B-cells and T-cells inspect it, multiply when germs are found, and produce antibodies.',
      functions: [
        'Filters bacteria, viruses, and cellular debris out of lymph fluid',
        'Activates antibody-producing B-cells and T-cells during infection',
        'Drains excess fluid from limbs and organs back into veins'
      ],
      connections: ['thymus', 'spleen', 'aorta_vessels'],
      funFact: 'When your neck glands feel swollen during a cold, it means your lymph nodes are busy multiplying immune cells to defeat the virus!',
      healthTip: 'Walking and muscle movement act as the natural pump that keeps lymph fluid circulating.'
    },

    // Reproductive (Female)
    uterus: {
      id: 'uterus',
      name: 'Uterus & Fallopian Tubes',
      latin: 'Uterus et Tubae uterinae',
      system: 'reproductive',
      sex: 'female',
      location: 'Center of the female lower pelvis, behind the bladder',
      weight: '~60 g (pear-shaped muscular organ)',
      summary:
        'A remarkably strong, elastic muscular organ with twin fallopian tubes that can nourish and protect a developing baby during pregnancy.',
      howItWorks:
        'Fallopian tubes sweep released eggs toward the uterus. Each month, hormones build a nutrient-rich inner lining (endometrium) ready to support implantation.',
      functions: [
        'Provides a protected, nourishing environment for fetal development',
        'Fallopian tubes guide egg cells from the ovaries to the uterus',
        'Powerful smooth muscle wall contracts during childbirth'
      ],
      connections: ['ovaries', 'pelvis', 'bladder'],
      funFact: 'During pregnancy, the uterus can expand to over 500 times its resting volume and return close to normal size afterward!',
      healthTip: 'Regular checkups and balanced nutrition support lifelong reproductive health.'
    },
    ovaries: {
      id: 'ovaries',
      name: 'Ovaries',
      latin: 'Ovaria',
      system: 'reproductive',
      sex: 'female',
      location: 'Paired oval organs on either side of the uterus in the pelvis',
      weight: '~5–8 g each (almond-sized)',
      summary:
        'Twin almond-sized reproductive glands that store egg cells (ova) and produce the key female hormones estrogen and progesterone.',
      howItWorks:
        'Guided by monthly pituitary hormone signals, ovarian follicles mature and release an egg (ovulation) while secreting hormones that also strengthen bones and cardiovascular health.',
      functions: [
        'Stores and matures egg cells for monthly ovulation',
        'Produces estrogen and progesterone',
        'Supports bone density, skin health, and metabolic balance'
      ],
      connections: ['uterus', 'pituitary', 'pelvis'],
      funFact: 'Estrogen produced by the ovaries also plays an important protective role in keeping bones dense and strong.',
      healthTip: 'Balanced healthy fats, iron, and stress management help keep hormonal cycles steady.'
    },

    // Reproductive (Male)
    prostate: {
      id: 'prostate',
      name: 'Prostate & Vas Deferens',
      latin: 'Prostata et Ductus deferens',
      system: 'reproductive',
      sex: 'male',
      location: 'Male lower pelvis, just below the urinary bladder',
      weight: '~20 g (walnut-sized gland)',
      summary:
        'A walnut-sized gland and twin transport ducts that produce protective, nutrient-rich fluid supporting and transporting sperm cells.',
      howItWorks:
        'The vas deferens carries sperm upward from the testes behind the bladder to meet the prostate and seminal vesicles, which add nourishing fluid that protects sperm.',
      functions: [
        'Secretes protective alkaline fluid nourishing sperm cells',
        'Vas deferens transports mature sperm cleanly into the reproductive tract',
        'Muscular fibers help guide fluid flow smoothly'
      ],
      connections: ['testes', 'bladder', 'pelvis'],
      funFact: 'The prostate surrounds the upper urethra like a small ring right beneath the bladder.',
      healthTip: 'Hydration, leafy greens, tomatoes (lycopene), and regular exercise support prostate health.'
    },
    testes: {
      id: 'testes',
      name: 'Testes',
      latin: 'Testes',
      system: 'reproductive',
      sex: 'male',
      location: 'Paired oval organs in the male lower pelvic region',
      weight: '~15–20 g each',
      summary:
        'Twin reproductive glands responsible for producing sperm cells and testosterone — the primary male sex hormone.',
      howItWorks:
        'Tightly coiled seminiferous tubules inside each testis continuously produce millions of sperm cells, while specialized Leydig cells secrete testosterone into the bloodstream.',
      functions: [
        'Produces sperm cells continuously throughout adulthood',
        'Secretes testosterone supporting muscle mass, bone density, and red blood cells',
        'Operates ~2°C cooler than core body temperature for optimal cell health'
      ],
      connections: ['prostate', 'pituitary', 'pelvis'],
      funFact: 'If uncoiled, the microscopic sperm-producing tubules inside both testes would stretch over 500 meters!',
      healthTip: 'Regular exercise, quality sleep, and avoiding overheating support healthy hormone levels.'
    },

    // Integumentary
    skin: {
      id: 'skin',
      name: 'Skin, Hair & Nails',
      latin: 'Cutis (Integumentum)',
      system: 'integumentary',
      location: 'Covers the entire exterior surface of the human body',
      weight: '~3.5–5 kg (~15% of body weight — largest organ!)',
      summary:
        'Your body’s living, waterproof smart-suit — shielding internal organs from germs and sunlight, sensing touch, making vitamin D, and cooling you via sweat.',
      howItWorks:
        'Millions of nerve endings detect pressure, warmth, and pain; blood vessels widen and ~2–4 million sweat glands release moisture to cool you when hot; and sunlight triggers vitamin D synthesis.',
      functions: [
        'Blocks bacteria, viruses, UV rays, and water loss',
        'Regulates body temperature via sweat glands and blood flow',
        'Synthesizes vitamin D when exposed to gentle sunlight',
        'Provides rich sense of touch, temperature, and texture'
      ],
      connections: ['peripheral_nerves', 'aorta_vessels', 'lymph_nodes'],
      funFact: 'Every square centimeter of your skin contains roughly 100 sweat glands, 1 meter of tiny blood vessels, and hundreds of touch sensors.',
      healthTip: 'Use sunscreen outdoors, stay hydrated, and moisturize to protect your skin barrier.'
    }
  };

  const NEW_ORGANS_HE = {
    pituitary: {
      name: 'בלוטת יותרת המוח (היפופיזה)',
      location: 'בסיס המוח, ממש מתחת להיפותלמוס',
      weight: 'כ־0.5 גרם (בגודל אפון)',
      summary: 'מכונה "בלוטת העל" של המערכת ההורמונלית — מרכז פיקוד זעיר המפעיל את בלוטת התריס, יותרת הכליה, הגדילה ומערכת הרבייה.',
      howItWorks: 'מקבלת פקודות כימיות מההיפותלמוס במוח ומפרישה הורמונים מרכזיים (הורמון גדילה, TSH, אוקסיטוצין) לדם כדי לתאם את שאר הבלוטות.',
      functions: [
        'שולטת בגדילה, התפתחות עצמות ותיקון רקמות',
        'מאותתת לבלוטת התריס ויותרת הכליה מתי לשחרר הורמונים',
        'מווסתת מאזן מים ומחזורי רבייה'
      ],
      funFact: 'למרות שגודלה כאפון בלבד, יותרת המוח מייצרת לפחות 8 הורמונים חיוניים לגוף.',
      healthTip: 'שינה סדירה תומכת בהפרשה הטבעית של הורמון הגדילה במהלך הלילה.'
    },
    thyroid: {
      name: 'בלוטת התריס (תירואיד)',
      location: 'קדמת הצוואר התחתון, עוטפת את קנה הנשימה',
      weight: 'כ־20–25 גרם (בצורת פרפר)',
      summary: 'בלוטה בצורת פרפר בצוואר הקובעת את קצב חילוף החומרים של הגוף — כמה מהר התאים שורפים אנרגיה ומייצרים חום.',
      howItWorks: 'משתמשת ביוד מהמזון לייצור הורמוני התריס (T3 ו־T4) המגיעים כמעט לכל תא ומווסתים צריכת חמצן, דופק וחום גוף.',
      functions: [
        'קובעת את קצב חילוף החומרים ורמת האנרגיה היומית',
        'מסייעת בוויסות טמפרטורת הגוף וקצב הלב',
        'תומכת בהתפתחות המוח ובאיזון הסידן'
      ],
      funFact: 'כמות זעירה של יוד מדגים, אצות או מלח מועשר ביוד חיונית לייצור הורמוני בלוטת התריס.',
      healthTip: 'תזונה מאוזנת עם יוד וסלניום תומכת בתפקוד תקין של בלוטת התריס.'
    },
    adrenals: {
      name: 'בלוטות יותרת הכליה (אדרנל)',
      location: 'מונחות ככובעים משולשים ממש מעל שתי הכליות',
      weight: 'כ־5 גרם כל אחת',
      summary: 'בלוטות התגובה המהירה ללחץ ולאנרגיה — מייצרות אדרנלין לפעולה מיידית וקורטיזול לאיזון חילוף החומרים ולחץ הדם.',
      howItWorks: 'הליבה הפנימית משחררת אדרנלין במצבי "הילחם או ברח", והקליפה החיצונית מפרישה קורטיזול ואלדוסטרון לניהול מלחים, מים ומתח.',
      functions: [
        'משחררות אדרנלין להאצת הדופק והריכוז בחירום',
        'מייצרות קורטיזול לוויסות סוכר בדם ודלקות',
        'מאזנות לחץ דם ומלחים באמצעות אלדוסטרון'
      ],
      funFact: 'אדרנלין מסוגל להכין את השרירים והלב שלך לביצועי שיא בחירום בתוך פחות משתי שניות!',
      healthTip: 'נשימה עמוקה, פעילות גופנית ומנוחה עוזרות לאזן רמות קורטיזול ממתח מתמשך.'
    },
    thymus: {
      name: 'בלוטת התימוס',
      location: 'בית החזה העליון מאחורי עצם החזה, ממש מעל הלב',
      weight: 'כ־25–35 גרם (פעילה במיוחד בילדות)',
      summary: '"אקדמיית האימונים" של מערכת החיסון שבה תאי דם לבנים צעירים מתבגרים לתאי T הלוחמים בנגיפים ובחיידקים.',
      howItWorks: 'תאים ממח העצם מגיעים לתימוס, לומדים לזהות פולשים זרים ועוברים סינון קפדני שלא יתקפו תאים בריאים של הגוף עצמו.',
      functions: [
        'מאמנת ומבשילה לימפוציטים מסוג T לחיסון ממוקד',
        'מלמדת את תאי החיסון סבילות עצמית למניעת תקיפה עצמית',
        'מפרישה הורמוני תימוזין לתמיכה בכוננות החיסונית'
      ],
      funFact: 'התימוס פעיל במיוחד בילדות ובנעורים ובונה צבא של תאי זיכרון חיסוניים לכל החיים.',
      healthTip: 'תזונה טובה, אבץ, ויטמין C ושינה מסייעים לתאי ה־T להישאר חדים.'
    },
    lymph_nodes: {
      name: 'קשרי הלימפה וכלי הלימפה',
      location: 'מקובצים בצוואר, בתי השחי, החזה, הבטן והמפשעה',
      weight: 'כ־600–700 תחנות סינון זעירות בצורת שעועית',
      summary: 'מאות עמדות בידוק מיקרוסקופיות המחוברות בכלי ניקוז — מסננות נוזלי רקמות, לוכדות חיידקים ומזניקות תגובה חיסונית.',
      howItWorks: 'נוזל לימפה צלול מהרקמות עובר דרך קשרי הלימפה שבהם תאי B ו־T בודקים אותו, מתרבים בעת זיהום ומייצרים נוגדנים.',
      functions: [
        'מסננים חיידקים, נגיפים ושברי תאים מנוזל הלימפה',
        'מפעילים תאי B מייצרי נוגדנים ותאי T בעת זיהום',
        'מנקזים נוזלים עודפים מהגפיים והאיברים חזרה לדם'
      ],
      funFact: 'כשהבלוטות בצוואר מתנפחות בזמן הצטננות, זה סימן שקשרי הלימפה מייצרים במרץ תאי חיסון נגד הנגיף!',
      healthTip: 'הליכה ותנועת שרירים פועלות כמשאבה טבעית שמניעה את נוזל הלימפה בגוף.'
    },
    uterus: {
      name: 'הרחם והחצוצרות',
      location: 'מרכז האגן הנשי התחתון, מאחורי שלפוחית השתן',
      weight: 'כ־60 גרם (איבר שרירי בצורת אגס)',
      summary: 'איבר שרירי חזק וגמיש במיוחד עם זוג חצוצרות, המסוגל להזין ולהגן על עובר מתפתח במהלך ההיריון.',
      howItWorks: 'החצוצרות מובילות ביציות מהשחלות אל הרחם. מדי חודש הורמונים בונים רירית פנימית עשירה המוכנה לקליטת היריון.',
      functions: [
        'מספק סביבה מוגנת ומזינה להתפתחות עובר',
        'החצוצרות מובילות את הביצית מהשחלות לרחם',
        'דופן שריר חלק עוצמתית מתכווצת בזמן הלידה'
      ],
      funFact: 'במהלך היריון הרחם מסוגל להתרחב לפי יותר מ־500 מנפחו במנוחה ולחזור לאחר מכן כמעט לגודלו המקורי!',
      healthTip: 'בדיקות תקופתיות ותזונה מאוזנת תומכות בבריאות מערכת הרבייה לאורך החיים.'
    },
    ovaries: {
      name: 'השחלות',
      location: 'זוג איברים אובליים משני צדי הרחם באגן',
      weight: 'כ־5–8 גרם כל אחת (בגודל שקד)',
      summary: 'זוג בלוטות רבייה בגודל שקד האוגרות ביציות ומייצרות את הורמוני המין הנשיים אסטרוגן ופרוגסטרון.',
      howItWorks: 'בהנחיית הורמונים חודשיים מיותרת המוח, זקיקים בשחלה מבשילים ומשחררים ביצית (ביוץ) תוך הפרשת הורמונים התומכים גם בעצמות ובלב.',
      functions: [
        'אוגרות ומבשילות ביציות לביוץ החודשי',
        'מייצרות אסטרוגן ופרוגסטרון',
        'תומכות בצפיפות העצם, בבריאות העור ובאיזון מטבולי'
      ],
      funFact: 'האסטרוגן המיוצר בשחלות ממלא תפקיד חשוב גם בשמירה על עצמות צפופות וחזקות.',
      healthTip: 'שומנים בריאים, ברזל וניהול מתחים תומכים באיזון הורמונלי תקין.'
    },
    prostate: {
      name: 'הערמונית וצינור הזרע',
      location: 'האגן הגברי התחתון, ממש מתחת לשלפוחית השתן',
      weight: 'כ־20 גרם (בגודל אגוז מלך)',
      summary: 'בלוטה בגודל אגוז וזוג צינורות הובלה המייצרים נוזל מגן ומזין התומך ומוביל את תאי הזרע.',
      howItWorks: 'צינורות הזרע מובילים זרע מהאשכים מאחורי השלפוחית אל הערמונית ושלפוחיות הזרע, המוסיפות נוזל מגן ומזין.',
      functions: [
        'מפרישה נוזל בסיסי מגן המזין את תאי הזרע',
        'צינור הזרע מוביל תאי זרע בוגרים בצורה חלקה',
        'סיבי שריר מסייעים בהזרמה תקינה של הנוזל'
      ],
      funFact: 'בלוטת הערמונית עוטפת את השופכה העליונה כטבעת קטנה ממש מתחת לשלפוחית השתן.',
      healthTip: 'שתייה מספקת, ירקות ירוקים, עגבניות (ליקופן) ופעילות גופנית תומכים בבריאות הערמונית.'
    },
    testes: {
      name: 'האשכים',
      location: 'זוג איברים אובליים באזור האגן התחתון אצל הגבר',
      weight: 'כ־15–20 גרם כל אחד',
      summary: 'זוג בלוטות רבייה האחראיות על ייצור תאי זרע והורמון הטסטוסטרון — הורמון המין הגברי המרכזי.',
      howItWorks: 'צינוריות מיקרוסקופיות מפותלות בתוך כל אשך מייצרות ברציפות מיליוני תאי זרע, ותאים ייעודיים מפרישים טסטוסטרון לדם.',
      functions: [
        'מייצרים תאי זרע ברציפות לאורך הבגרות',
        'מפרישים טסטוסטרון התומך במסת שריר, צפיפות עצם ותאי דם אדומים',
        'פועלים בכ־2 מעלות פחות מחום הגוף הפנימי לבריאות תאי הזרע'
      ],
      funFact: 'אם היינו פורשים את הצינוריות המיקרוסקופיות שבתוך שני האשכים, אורכן היה עולה על 500 מטרים!',
      healthTip: 'פעילות גופנית סדירה, שינה איכותית והימנעות מחימום יתר תומכות באיזון הורמונלי בריא.'
    },
    skin: {
      name: 'העור, השיער והציפורניים',
      location: 'עוטף את כל שטח הפנים החיצוני של גוף האדם',
      weight: 'כ־3.5–5 ק״ג (~15% ממשקל הגוף — האיבר הגדול ביותר!)',
      summary: 'חליפת ההגנה החיה והעמידה למים של הגוף — מגנה מפני חיידקים ושמש, חשה מגע, מייצרת ויטמין D ומקררת באמצעות זיעה.',
      howItWorks: 'מיליוני קולטני עצב חשים לחץ, חום וכאב; כלי דם מתרחבים ו־2–4 מיליון בלוטות זיעה מקררות אותך בחום; ואור השמש מפעיל ייצור ויטמין D.',
      functions: [
        'חוסם חיידקים, נגיפים, קרינת UV ואיבוד מים',
        'מווסת טמפרטורת גוף בעזרת זיעה וזרימת דם',
        'מייצר ויטמין D בחשיפה מתונה לשמש',
        'מספק חוש מגע, חום, קור ומרקם עשיר'
      ],
      funFact: 'בכל סנטימטר רבוע של עור יש כ־100 בלוטות זיעה, מטר של כלי דם זעירים ומאות חיישני מגע.',
      healthTip: 'השתמש בקרם הגנה בשמש, שתה מספיק מים ושמור על לחות העור.'
    }
  };

  // Merge new systems & organs into ANATOMA_DATA
  const D = global.ANATOMA_DATA;
  Object.assign(D.SYSTEMS, NEW_SYSTEMS_EN);
  Object.assign(D.ORGANS, NEW_ORGANS_EN);

  // Wrap AnatomaI18n.getSystem and getOrgan to serve Hebrew for all new systems & organs!
  const I18n = global.AnatomaI18n;
  const prevGetSystem = I18n.getSystem;
  const prevGetOrgan = I18n.getOrgan;

  I18n.getSystem = function (id) {
    if (I18n.getLang() === 'he' && NEW_SYSTEMS_HE[id] && D.SYSTEMS[id]) {
      return { ...D.SYSTEMS[id], ...NEW_SYSTEMS_HE[id] };
    }
    return prevGetSystem(id);
  };

  I18n.getOrgan = function (id) {
    if (I18n.getLang() === 'he' && NEW_ORGANS_HE[id] && D.ORGANS[id]) {
      return { ...D.ORGANS[id], ...NEW_ORGANS_HE[id] };
    }
    return prevGetOrgan(id);
  };
})(window);
