/**
 * Anatoma 3D — Complete Human Body Encyclopedia & Game Data
 * Covers 7 major body systems, 14 inspectable 3D organs, physiological states,
 * and interactive game challenges.
 */
(function (global) {
  'use strict';

  const SYSTEMS = {
    nervous: {
      id: 'nervous',
      name: 'Nervous System',
      shortName: 'Nervous',
      color: '#a855f7',
      hex: 0xa855f7,
      icon: '🧠',
      tagline: 'The body’s electrical command and communication network.',
      overview:
        'The nervous system coordinates every thought, sensation, movement, and automatic life-support function. It uses billions of specialized cells called neurons to send high-speed electrical and chemical signals at up to 120 meters per second.',
      keyOrgans: ['brain', 'spinal_cord'],
      howItWorks:
        'Sensory receptors collect information from inside and outside the body and send it via peripheral nerves and the spinal cord to the brain. The brain processes this data and sends motor commands back out to muscles and glands.',
      funFact: 'Your brain has roughly 86 billion neurons connected by over 100 trillion synapses.'
    },
    circulatory: {
      id: 'circulatory',
      name: 'Circulatory System',
      shortName: 'Circulatory',
      color: '#ef4444',
      hex: 0xef4444,
      icon: '❤️',
      tagline: 'The highway that delivers oxygen, nutrients, and hormones.',
      overview:
        'Also called the cardiovascular system, it consists of the heart, blood, and an enormous network of arteries, veins, and capillaries. It keeps every single cell supplied with oxygen and nutrients while carrying away carbon dioxide and waste.',
      keyOrgans: ['heart', 'spleen'],
      howItWorks:
        'The right side of the heart pumps oxygen-poor blood to the lungs to pick up oxygen. The left side pumps oxygen-rich blood through the aorta and arteries to the entire body, returning via veins.',
      funFact: 'If laid end to end, all the blood vessels in an adult human would stretch nearly 100,000 kilometers — more than twice around Earth.'
    },
    respiratory: {
      id: 'respiratory',
      name: 'Respiratory System',
      shortName: 'Respiratory',
      color: '#38bdf8',
      hex: 0x38bdf8,
      icon: '🫁',
      tagline: 'Gas exchange engine: bringing oxygen in, sending carbon dioxide out.',
      overview:
        'The respiratory system draws air into the body so oxygen can enter the bloodstream and carbon dioxide — a waste product of cellular energy production — can be exhaled.',
      keyOrgans: ['lungs', 'diaphragm'],
      howItWorks:
        'When the dome-shaped diaphragm contracts and flattens, it creates a vacuum that pulls air down the trachea and bronchi into millions of tiny air sacs called alveoli, where gas exchange happens.',
      funFact: 'You take about 20,000 breaths every day, moving roughly 11,000 liters of air in and out of your lungs.'
    },
    digestive: {
      id: 'digestive',
      name: 'Digestive System',
      shortName: 'Digestive',
      color: '#f59e0b',
      hex: 0xf59e0b,
      icon: '🍽️',
      tagline: 'Turns food into cellular fuel, building blocks, and energy.',
      overview:
        'A roughly 9-meter-long processing tract plus helper organs (liver, pancreas, gallbladder) that mechanically and chemically break down food into molecules small enough to absorb into the blood.',
      keyOrgans: ['stomach', 'liver', 'pancreas', 'small_intestine', 'large_intestine'],
      howItWorks:
        'Food travels down the esophagus to the stomach (acid breakdown), then into the small intestine (enzyme digestion + nutrient absorption with help from liver bile and pancreatic juice), and finally the large intestine (water absorption).',
      funFact: 'Because of millions of microscopic folds called villi, the inner surface area of your small intestine is about the size of a studio apartment.'
    },
    urinary: {
      id: 'urinary',
      name: 'Urinary System',
      shortName: 'Urinary',
      color: '#eab308',
      hex: 0xeab308,
      icon: '💧',
      tagline: 'Blood filtration, fluid balance, and waste removal.',
      overview:
        'The urinary (or renal) system filters waste products, excess salts, and extra water from the blood to maintain a stable internal chemistry (homeostasis) and healthy blood pressure.',
      keyOrgans: ['kidneys', 'bladder'],
      howItWorks:
        'Blood enters the kidneys where roughly 1 million tiny filtering units (nephrons) per kidney separate wastes into urine. Urine travels down two narrow tubes (ureters) to the bladder for storage until release.',
      funFact: 'Your kidneys filter your entire blood supply roughly 35 to 40 times every single day.'
    },
    skeletal: {
      id: 'skeletal',
      name: 'Skeletal System',
      shortName: 'Skeletal',
      color: '#e2e8f0',
      hex: 0xe2e8f0,
      icon: '🦴',
      tagline: 'Structural framework, organ armor, and blood cell factory.',
      overview:
        'Made of 206 living bones, cartilage, and ligaments, the skeleton supports your weight, gives muscles levers to pull on, protects vital organs, stores calcium, and manufactures blood cells inside bone marrow.',
      keyOrgans: ['ribcage', 'spine'],
      howItWorks:
        'Bones are living tissue constantly remodeled by cells. Joints allow flexible movement while rigid cages like the skull and ribcage shield delicate organs like the brain, heart, and lungs.',
      funFact: 'Bone is ounce-for-ounce stronger than steel under compression, yet lightweight because of its honeycomb inner structure.'
    },
    muscular: {
      id: 'muscular',
      name: 'Muscular & Body Shell',
      shortName: 'Body & Muscle',
      color: '#fb7185',
      hex: 0xfb7185,
      icon: '💪',
      tagline: 'Movement, posture, heat generation, and protective outer barrier.',
      overview:
        'Over 600 skeletal muscles pull on bones to create movement, smooth muscles move food and blood internally, and cardiac muscle powers the heart — all wrapped in skin, the body’s largest organ.',
      keyOrgans: ['diaphragm'],
      howItWorks:
        'When nerve signals arrive, microscopic protein filaments (actin and myosin) slide past each other, shortening muscle fibers and generating force and body heat.',
      funFact: 'Skeletal muscles make up around 35–40% of adult body weight and generate up to 85% of your body heat.'
    }
  };

  const ORGANS = {
    brain: {
      id: 'brain',
      name: 'Brain',
      latin: 'Encephalon',
      system: 'nervous',
      location: 'Inside the cranial cavity (skull)',
      weight: '~1.4 kg (3 lbs)',
      summary:
        'The master control center of the human body. It processes senses, creates memories and emotions, plans movements, and silently runs vital functions like breathing and heart rate.',
      howItWorks:
        'Divided into specialized regions: the folded Cerebrum handles thinking, language, and voluntary movement; the Cerebellum fine-tunes balance and coordination; and the Brainstem regulates automatic survival functions like heartbeat and breathing.',
      functions: [
        'Processes sight, sound, touch, taste, and smell',
        'Stores memories, enables reasoning, language, and creativity',
        'Sends voluntary motor commands to skeletal muscles',
        'Automatically regulates breathing, heart rate, and body temperature'
      ],
      connections: ['spinal_cord', 'heart', 'lungs'],
      funFact: 'Although it is only ~2% of your body weight, the brain consumes about 20% of your body’s oxygen and glucose.',
      healthTip: 'Quality sleep (7–9 hours) lets the brain clear metabolic waste and consolidate memories.'
    },
    spinal_cord: {
      id: 'spinal_cord',
      name: 'Spinal Cord',
      latin: 'Medulla spinalis',
      system: 'nervous',
      location: 'Inside the vertebral canal of the spine',
      weight: '~35 g (~45 cm long)',
      summary:
        'A thick bundle of nerve fibers running from the brainstem down the back, acting as the superhighway between the brain and the rest of the body.',
      howItWorks:
        '31 pairs of spinal nerves branch off between the vertebrae. It relays sensory signals up to the brain, motor signals down to muscles, and can even trigger instant reflex arcs (like pulling your hand from a hot stove) before the brain consciously feels pain.',
      functions: [
        'Transmits electrical messages between brain and body',
        'Executes rapid protective reflexes independently',
        'Coordinates rhythmic walking patterns'
      ],
      connections: ['brain', 'spine'],
      funFact: 'A knee-jerk reflex travels to the spinal cord and back to the leg muscle in about 50 milliseconds.',
      healthTip: 'Good posture and core strength help protect the vertebrae surrounding your spinal cord.'
    },
    heart: {
      id: 'heart',
      name: 'Heart',
      latin: 'Cor',
      system: 'circulatory',
      location: 'Center-left of the chest, between the lungs',
      weight: '~300 g (size of a clenched fist)',
      summary:
        'A tireless four-chambered muscular pump that propels blood continuously through two loops: one to the lungs for oxygen, and one to the entire body.',
      howItWorks:
        'Natural electrical pacemaker cells (the SA node) fire rhythmically, contracting the upper chambers (atria) and then the powerful lower chambers (ventricles). One-way valves prevent blood from flowing backward, creating the "lub-dub" heartbeat sound.',
      functions: [
        'Pumps oxygen-poor blood to the lungs (right side)',
        'Pumps oxygen-rich blood to all organs and tissues (left side)',
        'Maintains blood pressure needed to nourish every cell',
        'Adapts its beat rate instantly to rest, exercise, or stress'
      ],
      connections: ['lungs', 'brain', 'kidneys'],
      funFact: 'Your heart beats roughly 100,000 times a day, pumping about 7,200 liters of blood every 24 hours.',
      healthTip: 'Regular aerobic exercise strengthens the heart muscle so it pumps more blood with each beat.'
    },
    lungs: {
      id: 'lungs',
      name: 'Lungs',
      latin: 'Pulmones',
      system: 'respiratory',
      location: 'Thoracic cavity, flanking the heart inside the ribcage',
      weight: '~1.1 kg combined',
      summary:
        'A pair of spongy, elastic organs responsible for bringing oxygen from the air into your blood and removing carbon dioxide.',
      howItWorks:
        'Air enters through the trachea and splits into branching bronchi and bronchioles, ending in ~300–500 million microscopic alveoli wrapped in tiny capillaries. Oxygen diffuses into red blood cells while carbon dioxide diffuses out to be exhaled.',
      functions: [
        'Absorbs oxygen (O₂) into the bloodstream',
        'Expels waste carbon dioxide (CO₂)',
        'Helps regulate blood pH balance',
        'Provides airflow across vocal cords for speech'
      ],
      connections: ['diaphragm', 'heart', 'ribcage'],
      funFact: 'The left lung is slightly smaller than the right lung (2 lobes vs. 3) to leave room for the heart — a space called the cardiac notch.',
      healthTip: 'Deep diaphragmatic breathing and avoiding smoke keep the delicate alveoli elastic and clear.'
    },
    diaphragm: {
      id: 'diaphragm',
      name: 'Diaphragm',
      latin: 'Diaphragma',
      system: 'respiratory',
      location: 'Dome-shaped sheet below the lungs, separating chest & abdomen',
      weight: '~250 g',
      summary:
        'The primary muscle of breathing. It forms the floor of the chest cavity and acts like a biological piston.',
      howItWorks:
        'When you inhale, the diaphragm contracts and flattens downward, expanding chest volume so air rushes into the lungs. When it relaxes, it domes back upward, gently pushing air out.',
      functions: [
        'Drives roughly 75% of normal quiet breathing',
        'Separates the thoracic (chest) and abdominal cavities',
        'Assists in coughing, sneezing, and core stability'
      ],
      connections: ['lungs', 'ribcage', 'stomach'],
      funFact: 'Hiccups happen when the diaphragm has a sudden involuntary spasm, causing the vocal cords to snap shut.',
      healthTip: 'Belly breathing exercises train your diaphragm for calmer, more efficient oxygen intake.'
    },
    stomach: {
      id: 'stomach',
      name: 'Stomach',
      latin: 'Gaster',
      system: 'digestive',
      location: 'Upper-left abdomen, just below the diaphragm',
      weight: '~150 g (expands to hold 1.5–2 L)',
      summary:
        'A J-shaped muscular sac that churns swallowed food and mixes it with powerful hydrochloric acid and digestive enzymes.',
      howItWorks:
        'Three layers of smooth muscle squeeze and churn food into a thick liquid called chyme. Gastric juice kills harmful microbes and begins breaking down proteins with the enzyme pepsin, while a thick mucus lining protects the stomach wall from its own acid.',
      functions: [
        'Temporarily stores meals and releases them gradually',
        'Mechanically churns food into liquid chyme',
        'Chemically breaks down proteins using acid and pepsin',
        'Destroys most ingested bacteria with strong acid (pH ~1.5–2)'
      ],
      connections: ['liver', 'pancreas', 'small_intestine'],
      funFact: 'Your stomach replaces its protective inner mucus lining every few days so its own acid cannot digest it.',
      healthTip: 'Eating slowly and chewing thoroughly reduces the workload on your stomach.'
    },
    liver: {
      id: 'liver',
      name: 'Liver',
      latin: 'Hepar',
      system: 'digestive',
      location: 'Upper-right abdomen, beneath the diaphragm and ribcage',
      weight: '~1.5 kg (largest internal organ)',
      summary:
        'The body’s chemical processing plant and detoxification hub, performing over 500 distinct metabolic jobs.',
      howItWorks:
        'Nutrient-rich blood coming straight from the digestive tract passes through the liver first via the portal vein. Liver cells filter toxins, regulate blood sugar by storing glycogen, synthesize essential blood proteins, and produce bile to break down fats.',
      functions: [
        'Detoxifies medications, alcohol, and metabolic wastes',
        'Produces bile (stored in the gallbladder) to emulsify fats',
        'Stores glucose as glycogen and releases it when energy drops',
        'Makes blood-clotting proteins and metabolizes nutrients'
      ],
      connections: ['stomach', 'small_intestine', 'pancreas'],
      funFact: 'The liver is the only human internal organ that can regenerate full size from as little as 25% of its original tissue.',
      healthTip: 'Staying hydrated and limiting excess sugar and alcohol helps keep liver cells healthy.'
    },
    pancreas: {
      id: 'pancreas',
      name: 'Pancreas',
      latin: 'Pancreas',
      system: 'digestive',
      location: 'Deep behind the stomach, across the upper abdomen',
      weight: '~85 g (~15 cm long)',
      summary:
        'A dual-purpose gland that works for both the digestive system (making enzymes) and the endocrine system (regulating blood sugar).',
      howItWorks:
        'Its exocrine cells secrete bicarbonate (to neutralize stomach acid) and powerful enzymes into the small intestine. Meanwhile, tiny clusters called Islets of Langerhans release insulin and glucagon directly into the blood to keep glucose steady.',
      functions: [
        'Produces insulin (lowers blood sugar) and glucagon (raises blood sugar)',
        'Secretes enzymes that digest fats, proteins, and carbohydrates',
        'Neutralizes acidic stomach chyme entering the small intestine'
      ],
      connections: ['stomach', 'liver', 'small_intestine'],
      funFact: 'Over 95% of the pancreas makes digestive enzymes, while just ~2% (the islets) controls your entire body’s blood sugar.',
      healthTip: 'Balanced meals with fiber and complex carbohydrates prevent sharp blood-sugar spikes.'
    },
    small_intestine: {
      id: 'small_intestine',
      name: 'Small Intestine',
      latin: 'Intestinum tenue',
      system: 'digestive',
      location: 'Central lower abdomen, coiled inside the frame of the colon',
      weight: '~1.8 kg (~6 meters long)',
      summary:
        'The main site of nutrient absorption. Though narrower than the large intestine, it is much longer and does most of the chemical digestion.',
      howItWorks:
        'Rhythmic waves of muscle contraction (peristalsis) push food through three sections — duodenum, jejunum, and ileum. Millions of finger-like villi absorb amino acids, sugars, fatty acids, vitamins, and minerals into the bloodstream.',
      functions: [
        'Completes chemical breakdown of proteins, fats, and carbs',
        'Absorbs ~90% of all nutrients and most water from food',
        'Houses key immune tissues that guard against foodborne pathogens'
      ],
      connections: ['stomach', 'liver', 'pancreas', 'large_intestine'],
      funFact: 'Food spends roughly 3 to 5 hours traveling through the 6-meter-long small intestine.',
      healthTip: 'A diverse diet rich in whole foods supports both intestinal lining health and beneficial microbes.'
    },
    large_intestine: {
      id: 'large_intestine',
      name: 'Large Intestine (Colon)',
      latin: 'Intestinum crassum',
      system: 'digestive',
      location: 'Frames the abdomen (ascending, transverse, descending, sigmoid)',
      weight: '~1.5 kg (~1.5 meters long)',
      summary:
        'The final stage of digestion, responsible for reclaiming water and electrolytes and hosting trillions of helpful gut bacteria.',
      howItWorks:
        'Leftover undigested fiber and fluid enter from the small intestine. As material moves along the colon, water and minerals are absorbed back into the body while gut bacteria ferment fiber and synthesize vitamin K and B vitamins.',
      functions: [
        'Absorbs remaining water and electrolytes to prevent dehydration',
        'Hosts the gut microbiome (trillions of beneficial bacteria)',
        'Produces vitamin K and certain B vitamins via bacterial fermentation',
        'Compacts and stores solid waste for elimination'
      ],
      connections: ['small_intestine', 'kidneys'],
      funFact: 'Your colon hosts roughly 38 trillion bacteria — about as many bacterial cells as human cells in your entire body!',
      healthTip: 'Dietary fiber and plenty of water keep the colon moving smoothly and feed helpful gut flora.'
    },
    kidneys: {
      id: 'kidneys',
      name: 'Kidneys',
      latin: 'Renes',
      system: 'urinary',
      location: 'Lower back, one on each side of the spine behind the abdomen',
      weight: '~150 g each (size of a computer mouse)',
      summary:
        'A pair of bean-shaped master filters that clean your blood, balance water and minerals, and regulate blood pressure.',
      howItWorks:
        'Each kidney contains ~1 million microscopic nephrons. Blood pressure pushes plasma through tiny filters; useful nutrients and most water are reabsorbed, while urea, excess salt, and toxins become urine.',
      functions: [
        'Filters ~180 liters of blood plasma daily into ~1.5 L of urine',
        'Regulates blood pressure via the renin-angiotensin system',
        'Balances sodium, potassium, calcium, and blood pH',
        'Releases erythropoietin (EPO) to tell bone marrow to make red blood cells'
      ],
      connections: ['heart', 'bladder', 'spine'],
      funFact: 'The right kidney sits slightly lower than the left kidney because the large liver sits right above it.',
      healthTip: 'Drinking enough water helps your kidneys flush wastes cleanly and prevents kidney stones.'
    },
    bladder: {
      id: 'bladder',
      name: 'Urinary Bladder',
      latin: 'Vesica urinaria',
      system: 'urinary',
      location: 'Lower pelvis, behind the pubic bone',
      weight: '~50 g (holds 300–500 mL comfortably)',
      summary:
        'A flexible, balloon-like muscular pouch that safely stores urine produced by the kidneys until it is convenient to release.',
      howItWorks:
        'Urine trickles continuously from the kidneys down two ureters into the bladder. Stretch receptors in the bladder wall signal the brain when it reaches about half full, and sphincter muscles keep it sealed until you relax them.',
      functions: [
        'Stores urine temporarily under low pressure',
        'Signals the nervous system when emptying is needed',
        'Contracts smoothly to expel urine through the urethra'
      ],
      connections: ['kidneys', 'spinal_cord'],
      funFact: 'The bladder lining is made of specialized urothelium that stretches dramatically without leaking.',
      healthTip: 'Avoid holding urine for excessively long periods to keep bladder muscles healthy.'
    },
    spleen: {
      id: 'spleen',
      name: 'Spleen',
      latin: 'Splen',
      system: 'circulatory',
      location: 'Upper-left abdomen, tucked behind the stomach under the ribs',
      weight: '~150 g',
      summary:
        'A blood-filtering immune organ that recycles old red blood cells, stores reserve blood, and trains white blood cells to fight infections.',
      howItWorks:
        'Blood flows through spongy red and white pulp. Macrophages inspect red blood cells, dismantling worn-out ones (~120 days old) to recycle iron, while lymphocytes detect and attack bacteria in the bloodstream.',
      functions: [
        'Filters and recycles aging or damaged red blood cells',
        'Produces antibodies and activates immune white blood cells',
        'Stores a reserve of platelets and red blood cells for emergencies'
      ],
      connections: ['heart', 'liver', 'stomach'],
      funFact: 'You can live without a spleen if it is injured — the liver and lymph nodes take over many of its jobs.',
      healthTip: 'The lower left ribs naturally shield the spleen from impact.'
    },
    ribcage: {
      id: 'ribcage',
      name: 'Ribcage & Sternum',
      latin: 'Cavea thoracis',
      system: 'skeletal',
      location: 'Upper torso surrounding the chest cavity',
      weight: 'Part of the 206-bone skeleton',
      summary:
        'A curved, flexible cage of 12 pairs of ribs connected to the spine in back and the breastbone (sternum) in front, armoring the heart and lungs.',
      howItWorks:
        'Flexible costal cartilage lets the ribcage lift and expand outward like a bucket handle every time you inhale, while still providing strong impact protection for vital chest organs.',
      functions: [
        'Protects the heart, lungs, major vessels, and upper liver/spleen',
        'Expands and contracts with intercostal muscles to assist breathing',
        'Anchors shoulder, chest, and back muscles'
      ],
      connections: ['lungs', 'heart', 'spine', 'diaphragm'],
      funFact: 'Both men and women have the exact same number of ribs: 12 pairs (24 ribs total).',
      healthTip: 'Calcium, vitamin D, and weight-bearing exercise keep bones dense and resilient.'
    },
    spine: {
      id: 'spine',
      name: 'Vertebral Column (Spine)',
      latin: 'Columna vertebralis',
      system: 'skeletal',
      location: 'Central axis of the back, from skull base to pelvis',
      weight: '33 vertebrae (24 movable + sacrum & coccyx)',
      summary:
        'The S-curved central pillar of the skeleton that keeps you upright, absorbs shock, and encases the fragile spinal cord in bone.',
      howItWorks:
        'Stacked ring-shaped vertebrae are separated by gel-like intervertebral discs that act like cushions, letting you bend and twist while keeping the central nerve canal safe.',
      functions: [
        'Supports the head and upper body weight',
        'Forms a bony tunnel protecting the spinal cord',
        'Absorbs shock during walking, running, and jumping',
        'Provides attachment points for ribs and back muscles'
      ],
      connections: ['spinal_cord', 'ribcage', 'brain'],
      funFact: 'You are actually about 1 to 2 cm taller in the morning than at night because gravity compresses your spinal discs during the day.',
      healthTip: 'Lift heavy objects with your legs rather than rounding your lower back.'
    }
  };

  const SIM_PRESETS = {
    rest: {
      id: 'rest',
      name: 'Deep Rest',
      icon: '🌙',
      bpm: 58,
      respRate: 12,
      spo2: 99,
      bpSys: 112,
      bpDia: 70,
      brainHz: 0.45,
      digestion: 0.35,
      description: 'Parasympathetic ("rest & digest") state. Heart beats slowly and efficiently, breathing is calm and shallow.'
    },
    normal: {
      id: 'normal',
      name: 'Normal Awake',
      icon: '🧍',
      bpm: 72,
      respRate: 15,
      spo2: 98,
      bpSys: 118,
      bpDia: 76,
      brainHz: 0.75,
      digestion: 0.5,
      description: 'Balanced baseline homeostasis. All 7 body systems operate smoothly at steady resting demand.'
    },
    exercise: {
      id: 'exercise',
      name: 'Running / Exercise',
      icon: '🏃',
      bpm: 156,
      respRate: 34,
      spo2: 97,
      bpSys: 152,
      bpDia: 82,
      brainHz: 1.25,
      digestion: 0.2,
      description: 'Muscles demand extra oxygen! Heart rate more than doubles, lungs expand deeper and faster, and blood flow surges.'
    },
    stress: {
      id: 'stress',
      name: 'Fight or Flight',
      icon: '⚡',
      bpm: 132,
      respRate: 26,
      spo2: 98,
      bpSys: 144,
      bpDia: 88,
      brainHz: 1.85,
      digestion: 0.15,
      description: 'Sympathetic adrenaline surge: rapid neural firing in brain & spinal cord, elevated heart rate and blood pressure.'
    },
    digesting: {
      id: 'digesting',
      name: 'After a Meal',
      icon: '🥗',
      bpm: 82,
      respRate: 14,
      spo2: 98,
      bpSys: 120,
      bpDia: 74,
      brainHz: 0.6,
      digestion: 1.6,
      description: 'Digestive mode active: stomach churning, liver & pancreas enzymes working, and heightened intestinal peristalsis.'
    }
  };

  // Locate-the-Organ 3D challenges
  const LOCATE_CHALLENGES = [
    {
      organId: 'heart',
      clue: 'Find the four-chambered muscular pump that sends blood to both the lungs and the rest of the body.',
      hint: 'Look in the Circulatory System, slightly left of center in the chest.'
    },
    {
      organId: 'brain',
      clue: 'Locate the master control organ that uses ~20% of your body’s oxygen and contains ~86 billion neurons.',
      hint: 'It is at the top of the Nervous System inside the skull.'
    },
    {
      organId: 'lungs',
      clue: 'Click the spongy paired organs where oxygen enters the blood through millions of tiny alveoli.',
      hint: 'Look in the Respiratory System inside the ribcage.'
    },
    {
      organId: 'liver',
      clue: 'Locate the largest internal organ — it detoxifies blood, stores glycogen, and produces bile.',
      hint: 'Digestive System: upper-right abdomen, just beneath the ribs.'
    },
    {
      organId: 'stomach',
      clue: 'Find the J-shaped acidic sac that churns food into liquid chyme and begins digesting proteins.',
      hint: 'Digestive System: upper-left abdomen, opposite the liver.'
    },
    {
      organId: 'pancreas',
      clue: 'Locate the dual-purpose gland that produces insulin to control blood sugar and enzymes for digestion.',
      hint: 'Try using Exploded View! It sits tucked behind/below the stomach.'
    },
    {
      organId: 'kidneys',
      clue: 'Click the bean-shaped organs that filter ~180 liters of blood plasma daily to produce urine.',
      hint: 'Urinary System: rotate to the back or use Exploded View in the lower back.'
    },
    {
      organId: 'diaphragm',
      clue: 'Find the dome-shaped breathing muscle that flattens downward when you inhale.',
      hint: 'Respiratory System: directly beneath the lungs.'
    },
    {
      organId: 'small_intestine',
      clue: 'Locate the ~6-meter coiled tube where roughly 90% of nutrients are absorbed via tiny villi.',
      hint: 'Digestive System: coiled in the center of the lower abdomen.'
    },
    {
      organId: 'large_intestine',
      clue: 'Click the organ that frames the abdomen, reclaims water, and hosts trillions of helpful gut bacteria.',
      hint: 'Digestive System: the outer frame around the small intestine.'
    },
    {
      organId: 'bladder',
      clue: 'Locate the flexible pelvic pouch that stores urine until it is ready to be released.',
      hint: 'Urinary System: lowest part of the pelvis.'
    },
    {
      organId: 'spleen',
      clue: 'Find the blood-filtering immune organ tucked on the upper-left side that recycles old red blood cells.',
      hint: 'Circulatory/Immune: small purple-red organ on the far left beside the stomach.'
    },
    {
      organId: 'spinal_cord',
      clue: 'Locate the nerve superhighway that runs down the back and triggers instant protective reflexes.',
      hint: 'Nervous System: runs vertically inside the spine.'
    },
    {
      organId: 'ribcage',
      clue: 'Click the curved bony armor of 12 pairs of bones that protects the heart and lungs.',
      hint: 'Skeletal System: wraps around the upper torso.'
    }
  ];

  // Body Doctor clinical simulation scenarios
  const DOCTOR_SCENARIOS = [
    {
      id: 'doc_glucose',
      title: 'Blood Sugar Spike!',
      patientPreset: 'digesting',
      story: 'A patient just ate a huge pasta meal and their blood glucose levels are climbing rapidly. Click the 3D organ responsible for releasing INSULIN to bring blood sugar back to normal!',
      targetOrgan: 'pancreas',
      followUp: {
        question: 'Great find! How does the pancreas lower blood glucose?',
        options: [
          'Releases insulin, signaling cells to absorb glucose from the blood',
          'Filters sugar directly into urine',
          'Converts sugar into oxygen gas',
          'Pumps blood faster through the lungs'
        ],
        correctIndex: 0,
        explanation: 'Beta cells in the pancreatic Islets of Langerhans release insulin, which unlocks body cells so they absorb glucose for energy or storage.'
      }
    },
    {
      id: 'doc_sprint',
      title: 'Out of Breath After a Sprint',
      patientPreset: 'exercise',
      story: 'A runner finishes a 400m sprint. Their muscles have built up lots of CO₂ and need fresh oxygen fast. Click the main organ where oxygen actually enters the bloodstream!',
      targetOrgan: 'lungs',
      followUp: {
        question: 'Spot on! Inside the lungs, which microscopic structures perform gas exchange?',
        options: [
          'Nephrons',
          'Alveoli',
          'Villi',
          'Synapses'
        ],
        correctIndex: 1,
        explanation: 'Millions of thin-walled alveoli are wrapped in capillaries, allowing O₂ to diffuse into red blood cells and CO₂ to diffuse out.'
      }
    },
    {
      id: 'doc_detox',
      title: 'Toxin Alert in the Bloodstream',
      patientPreset: 'normal',
      story: 'Blood returning from the intestines carries absorbed nutrients along with mild toxins from food additives. Click the primary organ that detoxifies blood before it circulates further!',
      targetOrgan: 'liver',
      followUp: {
        question: 'Correct! Besides detoxification, what digestive fluid does the liver make to break down fats?',
        options: [
          'Hydrochloric acid',
          'Bile',
          'Saliva',
          'Adrenaline'
        ],
        correctIndex: 1,
        explanation: 'The liver produces bile (stored in the gallbladder), which emulsifies large fat droplets so enzymes can digest them.'
      }
    },
    {
      id: 'doc_dehydration',
      title: 'Fluid & Salt Imbalance',
      patientPreset: 'stress',
      story: 'A hiker forgot water on a hot trail. Blood salt concentration is rising and fluid must be conserved. Click the paired organs that filter blood and adjust water retention!',
      targetOrgan: 'kidneys',
      followUp: {
        question: 'Nice diagnosis! What are the ~1 million microscopic filtering units inside each kidney called?',
        options: [
          'Alveoli',
          'Neurons',
          'Nephrons',
          'Atria'
        ],
        correctIndex: 2,
        explanation: 'Nephrons filter blood plasma, reabsorbing needed water and nutrients while concentrating waste into urine.'
      }
    },
    {
      id: 'doc_reflex',
      title: 'Hot Stove Reflex!',
      patientPreset: 'stress',
      story: 'Someone accidentally touches a hot pan and jerks their hand away in 50 milliseconds — even before consciously feeling the burn. Click the nervous structure that executes this instant reflex!',
      targetOrgan: 'spinal_cord',
      followUp: {
        question: 'Exact match! Why did the spinal cord trigger the hand pull before the brain finished processing pain?',
        options: [
          'To save precious milliseconds and prevent deeper burn injury',
          'Because the brain cannot feel heat',
          'Because muscles do not connect to the brain',
          'Because blood carries pain signals instead of nerves'
        ],
        correctIndex: 0,
        explanation: 'A spinal reflex arc routes sensory signals directly to motor neurons in the spinal cord for split-second protection.'
      }
    },
    {
      id: 'doc_pump',
      title: 'Low Blood Pressure',
      patientPreset: 'rest',
      story: 'A patient stands up quickly and feels dizzy because blood briefly pooled in their legs. Click the muscular pump that immediately speeds up to restore blood pressure to the brain!',
      targetOrgan: 'heart',
      followUp: {
        question: 'Right on target! Which chamber of the heart pumps oxygen-rich blood out through the aorta to the whole body?',
        options: [
          'Right atrium',
          'Right ventricle',
          'Left atrium',
          'Left ventricle'
        ],
        correctIndex: 3,
        explanation: 'The left ventricle has the thickest muscular wall because it generates the high pressure needed to pump blood to the entire body.'
      }
    }
  ];

  // Encyclopedia Quiz questions
  const QUIZ_QUESTIONS = [
    {
      q: 'Which body system delivers oxygen and nutrients to cells while removing carbon dioxide?',
      options: ['Circulatory System', 'Urinary System', 'Skeletal System', 'Digestive System'],
      answer: 0,
      explain: 'The circulatory system (heart + blood vessels) transports gases, nutrients, hormones, and immune cells.'
    },
    {
      q: 'Why is the left lung slightly smaller than the right lung?',
      options: [
        'It only exhales air',
        'To make room for the heart (cardiac notch)',
        'Because the liver pushes it up',
        'It has no alveoli'
      ],
      answer: 1,
      explain: 'The left lung has 2 lobes instead of 3, creating the cardiac notch where the heart sits.'
    },
    {
      q: 'Where does ~90% of nutrient absorption from digested food take place?',
      options: ['Stomach', 'Esophagus', 'Small Intestine', 'Large Intestine'],
      answer: 2,
      explain: 'Millions of finger-like villi lining the small intestine absorb sugars, amino acids, fats, and vitamins.'
    },
    {
      q: 'Which internal organ is famous for being able to regenerate from as little as 25% of its tissue?',
      options: ['Heart', 'Brain', 'Liver', 'Spleen'],
      answer: 2,
      explain: 'The liver has a remarkable regenerative capacity, allowing living-donor liver transplants.'
    },
    {
      q: 'What is the main muscle that contracts and flattens downward to draw air into the lungs?',
      options: ['Biceps', 'Diaphragm', 'Heart', 'Stomach wall'],
      answer: 1,
      explain: 'The dome-shaped diaphragm drives about 75% of normal breathing by creating negative pressure in the chest.'
    },
    {
      q: 'Which organ recycles worn-out red blood cells and helps mount immune responses against bloodborne bacteria?',
      options: ['Spleen', 'Bladder', 'Pancreas', 'Ribcage'],
      answer: 0,
      explain: 'The spleen filters blood, recycles iron from old red blood cells, and activates white blood cells.'
    },
    {
      q: 'Roughly what percentage of the body’s total oxygen and glucose does the brain consume?',
      options: ['2%', '5%', '20%', '65%'],
      answer: 2,
      explain: 'Despite being only ~2% of body weight, the brain is an energy powerhouse using ~20% of oxygen and glucose.'
    },
    {
      q: 'What is the primary job of the Large Intestine (Colon)?',
      options: [
        'Pumping blood to the legs',
        'Reclaiming water & electrolytes and hosting gut bacteria',
        'Producing insulin',
        'Filtering urea from blood'
      ],
      answer: 1,
      explain: 'The colon absorbs remaining water and minerals, while trillions of gut microbes ferment fiber and produce vitamins.'
    },
    {
      q: 'How many bones are in the adult human skeletal system?',
      options: ['106', '206', '306', '412'],
      answer: 1,
      explain: 'Babies are born with ~270 softer bones that gradually fuse into 206 adult bones.'
    },
    {
      q: 'Which pair of organs filters about 180 liters of blood plasma every day?',
      options: ['Lungs', 'Kidneys', 'Adrenal glands', 'Tonsils'],
      answer: 1,
      explain: 'Your kidneys continuously filter plasma through ~2 million total nephrons, concentrating wastes into ~1.5 L of urine.'
    }
  ];

  global.ANATOMA_DATA = {
    SYSTEMS,
    ORGANS,
    SIM_PRESETS,
    LOCATE_CHALLENGES,
    DOCTOR_SCENARIOS,
    QUIZ_QUESTIONS
  };
})(window);
