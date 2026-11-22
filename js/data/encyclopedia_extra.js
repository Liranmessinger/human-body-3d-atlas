/**
 * Anatoma 3D — Extended Comprehensive Anatomy Atlas (EN + HE)
 * Adds full Muscular System (8 major muscle groups), full Skeletal System (6 additional bone groups),
 * plus Trachea, Esophagus, Gallbladder, Major Blood Vessels, and Peripheral Nerves.
 */
(function (global) {
  'use strict';

  const EXTRA_ORGANS_EN = {
    // ===================== MUSCULAR SYSTEM (8) =====================
    pectorals: {
      id: 'pectorals',
      name: 'Pectoralis Major (Chest)',
      latin: 'Musculus pectoralis major',
      system: 'muscular',
      location: 'Upper front chest wall, spanning sternum to shoulder',
      weight: 'Large fan-shaped paired chest muscles',
      summary:
        'Thick, fan-shaped chest muscles that power pushing movements, hug the arms across the torso, and rotate the shoulders inward.',
      howItWorks:
        'Muscle fibers originate along the collarbone and sternum and converge onto the upper arm bone (humerus). When they contract, they pull the arm forward and across the chest.',
      functions: [
        'Drives pushing motions (push-ups, throwing, lifting)',
        'Draws the arms across the front of the body (adduction)',
        'Assists in deep inhalation by lifting the ribcage'
      ],
      connections: ['deltoids', 'ribcage', 'arm_bones'],
      funFact: 'The pectoralis major has two distinct heads (clavicular and sternal) that can activate independently for upward or straight-ahead pushing.',
      healthTip: 'Balance chest training with upper-back exercises so your shoulders stay aligned and open.'
    },
    deltoids: {
      id: 'deltoids',
      name: 'Deltoids (Shoulders)',
      latin: 'Musculus deltoideus',
      system: 'muscular',
      location: 'Rounded cap over each shoulder joint',
      weight: '3-headed triangular shoulder muscles',
      summary:
        'Triangular muscles wrapping the top of each shoulder that lift the arm in nearly every direction — forward, sideways, and backward.',
      howItWorks:
        'Composed of anterior (front), lateral (side), and posterior (rear) fibers wrapping the ball-and-socket shoulder joint, giving humans remarkable 360-degree arm mobility.',
      functions: [
        'Raises the arm out to the side (abduction)',
        'Swings the arm forward and backward',
        'Stabilizes the shoulder joint when carrying loads'
      ],
      connections: ['pectorals', 'biceps', 'clavicle'],
      funFact: 'The deltoid gets its name from the Greek letter Delta (Δ) because of its inverted triangle shape.',
      healthTip: 'Warm up your rotator cuff and deltoids with gentle arm circles before overhead lifting.'
    },
    biceps: {
      id: 'biceps',
      name: 'Biceps & Triceps (Arms)',
      latin: 'M. biceps brachii & M. triceps brachii',
      system: 'muscular',
      location: 'Front (biceps) and back (triceps) of the upper arm',
      weight: 'Antagonistic upper-arm muscle pair',
      summary:
        'The classic push-pull muscle team of the upper arm: biceps flex the elbow and twist the palm up, while triceps straighten the arm.',
      howItWorks:
        'Because muscles can only pull (never push), they work in opposing pairs. When the biceps contracts to bend your elbow, the triceps relaxes — and vice versa to straighten it.',
      functions: [
        'Biceps bends the elbow and rotates the forearm palm-up (supination)',
        'Triceps extends and straightens the elbow joint',
        'Together they stabilize the shoulder and control fine lifting'
      ],
      connections: ['deltoids', 'arm_bones', 'pectorals'],
      funFact: 'The triceps actually makes up about two-thirds of your upper arm’s muscle mass because it has three heads compared to the biceps’ two.',
      healthTip: 'Train both pulling (biceps) and pushing (triceps) evenly to protect your elbow joints.'
    },
    abdominals: {
      id: 'abdominals',
      name: 'Abdominals (Core)',
      latin: 'Musculus rectus abdominis',
      system: 'muscular',
      location: 'Front wall of the abdomen, from ribcage to pelvis',
      weight: 'Paired segmented core muscles',
      summary:
        'The central pillar of your core. These layered abdominal muscles flex the torso, protect internal organs, and keep your spine stable during every movement.',
      howItWorks:
        'Fibrous tendinous bands cross the rectus abdominis horizontally (creating the "six-pack" look), while deeper obliques and transverse abdominis wrap the waist like a natural weightlifting belt.',
      functions: [
        'Stabilizes the spine and pelvis during walking, running, and lifting',
        'Flexes and rotates the trunk',
        'Protects abdominal organs and assists forceful exhalation'
      ],
      connections: ['spine', 'pelvis', 'diaphragm'],
      funFact: 'Everyone has abdominal muscles underneath — their visibility depends mostly on genetics and subcutaneous body fat.',
      healthTip: 'Planks and controlled breathing build deep core stability that prevents lower-back pain.'
    },
    latissimus: {
      id: 'latissimus',
      name: 'Latissimus & Trapezius (Back)',
      latin: 'M. latissimus dorsi & M. trapezius',
      system: 'muscular',
      location: 'Wide upper and mid-back, from neck to lower spine',
      weight: 'Broadest muscles of the human back',
      summary:
        'Huge, wing-like back muscles that power pulling, climbing, swimming, and keeping your head and shoulders upright against gravity.',
      howItWorks:
        'The trapezius spans the neck and upper back to shrug and retract the shoulder blades, while the broad latissimus dorsi pulls the arms down and back toward the hips.',
      functions: [
        'Powers pulling motions (pull-ups, rowing, swimming)',
        'Supports upright posture and holds the shoulder blades back',
        'Stabilizes the spine during heavy lifting'
      ],
      connections: ['spine', 'clavicle', 'deltoids'],
      funFact: 'Latissimus dorsi literally translates from Latin as "broadest muscle of the back."',
      healthTip: 'Strengthening your upper back counteracts hours of sitting at a desk or looking down at screens.'
    },
    glutes: {
      id: 'glutes',
      name: 'Gluteus Maximus (Glutes)',
      latin: 'Musculus gluteus maximus',
      system: 'muscular',
      location: 'Posterior pelvis / buttocks',
      weight: 'Largest & most powerful muscle in the body',
      summary:
        'The powerhouse of human upright movement — propelling you up stairs, out of chairs, and forward when sprinting or jumping.',
      howItWorks:
        'Anchoring from the pelvis and sacrum to the femur, the glutes extend the hip joint powerfully and keep your pelvis level every time you stand on one leg during walking.',
      functions: [
        'Extends the hip for standing up, climbing, jumping, and sprinting',
        'Keeps the trunk upright (unique to bipedal humans)',
        'Stabilizes the pelvis and lower back'
      ],
      connections: ['pelvis', 'femur', 'quadriceps'],
      funFact: 'Humans have proportionally much larger glutes than other primates because walking and running upright requires huge hip-extension power.',
      healthTip: 'Stand up and walk regularly if you sit all day — prolonged sitting can weaken glute activation.'
    },
    quadriceps: {
      id: 'quadriceps',
      name: 'Quadriceps & Hamstrings (Thighs)',
      latin: 'M. quadriceps femoris & Hamstrings',
      system: 'muscular',
      location: 'Front (quadriceps) and back (hamstrings) of the thigh',
      weight: '4-headed front thigh + 3-muscle rear thigh',
      summary:
        'Massive thigh muscles that straighten and bend the knee, absorb landing shock, and generate the drive for walking, cycling, and jumping.',
      howItWorks:
        'Four quadriceps muscles merge into a tendon crossing the kneecap (patella) to straighten the leg, while three hamstring muscles on the back bend the knee and extend the hip.',
      functions: [
        'Straightens the knee and supports body weight when standing or squatting',
        'Bends the knee and decelerates the leg during running',
        'Absorbs impact forces to protect the knee joint'
      ],
      connections: ['femur', 'glutes', 'calves'],
      funFact: 'The quadriceps is actually a group of four distinct muscles working together as one unstoppable knee extensor.',
      healthTip: 'Strong, flexible thighs are the best natural shock absorbers for keeping your knees healthy.'
    },
    calves: {
      id: 'calves',
      name: 'Calves (Gastrocnemius)',
      latin: 'M. gastrocnemius & M. soleus',
      system: 'muscular',
      location: 'Back of the lower leg, above the Achilles tendon',
      weight: 'High-endurance lower-leg muscles',
      summary:
        'Spring-loaded muscles of the lower leg that push your foot off the ground with every step and help pump venous blood back up toward your heart.',
      howItWorks:
        'The gastrocnemius and deeper soleus taper into the thick Achilles tendon at the heel. Contracting them points the toes downward (plantarflexion), launching you forward.',
      functions: [
        'Propels the body forward during walking, running, and jumping',
        'Balances the body while standing upright',
        'Acts as a "second heart" squeezing leg veins to push blood upward'
      ],
      connections: ['leg_bones', 'quadriceps', 'aorta_vessels'],
      funFact: 'The Achilles tendon attaching your calf to your heel is the thickest and strongest tendon in the human body.',
      healthTip: 'Calf stretches and ankle mobility drills help prevent Achilles stiffness and foot fatigue.'
    },

    // ===================== SKELETAL SYSTEM (+6) =====================
    skull: {
      id: 'skull',
      name: 'Skull (Cranium & Jaw)',
      latin: 'Cranium',
      system: 'skeletal',
      location: 'Head, enclosing the brain and facial structures',
      weight: '22 fused & hinged bones',
      summary:
        'A protective bony helmet made of 8 interlocking cranial bones shielding the brain and 14 facial bones shaping the eyes, nose, and jaw.',
      howItWorks:
        'Cranial bones fuse along jagged seams called sutures for incredible impact resistance, while the lower jaw (mandible) is the only freely movable bone in the skull for chewing and speaking.',
      functions: [
        'Encases and shields the fragile brain from impact',
        'Forms protective sockets for the eyes, inner ears, and nasal cavity',
        'Anchors facial expression muscles and jaw muscles for chewing'
      ],
      connections: ['brain', 'spine'],
      funFact: 'Babies are born with soft spots (fontanelles) in their skull so their rapidly growing brain has room to expand.',
      healthTip: 'Always wear a helmet during cycling or contact sports — bone is strong, but the brain inside is delicate.'
    },
    clavicle: {
      id: 'clavicle',
      name: 'Clavicle & Scapula (Shoulder Girdle)',
      latin: 'Clavicula & Scapula',
      system: 'skeletal',
      location: 'Collarbone (front) and shoulder blade (back)',
      weight: 'Paired S-shaped struts & triangular blades',
      summary:
        'The bony suspension bridge connecting your arms to your torso, holding your shoulders wide so your arms can swing freely.',
      howItWorks:
        'The S-shaped clavicle (collarbone) acts like a rigid strut between the sternum and the flat triangular scapula (shoulder blade), transferring forces from the arms to the trunk.',
      functions: [
        'Suspends the arms away from the ribcage for wide range of motion',
        'Protects major nerves and blood vessels passing into the arm',
        'Provides broad attachment ridges for back, chest, and shoulder muscles'
      ],
      connections: ['ribcage', 'arm_bones', 'deltoids'],
      funFact: 'The clavicle is the most frequently broken bone in the human body because it absorbs impact when you fall on an outstretched hand.',
      healthTip: 'Keeping your shoulder blades gently pulled back and down relieves neck and shoulder tension.'
    },
    pelvis: {
      id: 'pelvis',
      name: 'Pelvis (Hip Bone)',
      latin: 'Pelvis',
      system: 'skeletal',
      location: 'Base of the torso, linking the spine to the legs',
      weight: 'Ring of fused ilium, ischium, pubis & sacrum',
      summary:
        'A sturdy bowl-shaped bony ring that transfers upper-body weight from the spine into the legs and cradles the bladder and lower digestive organs.',
      howItWorks:
        'Deep cup-shaped sockets (acetabula) on each side hold the rounded heads of the thigh bones, creating ultra-stable ball-and-socket hip joints.',
      functions: [
        'Transfers body weight from the spine to both legs',
        'Protects the urinary bladder, reproductive organs, and lower colon',
        'Anchors the massive glute, thigh, and core muscles'
      ],
      connections: ['spine', 'femur', 'bladder', 'glutes'],
      funFact: 'The female pelvis is naturally wider and has a broader arch than the male pelvis to allow childbirth.',
      healthTip: 'Strong hip and core muscles keep the pelvis aligned and reduce strain on the lower spine.'
    },
    arm_bones: {
      id: 'arm_bones',
      name: 'Arm Bones (Humerus, Radius & Ulna)',
      latin: 'Humerus, Radius et Ulna',
      system: 'skeletal',
      location: 'Upper arm (humerus) and forearm (radius & ulna)',
      weight: '3 long lever bones per arm',
      summary:
        'Precision mechanical levers that let you reach, lift, throw, and twist your wrist smoothly from palm-up to palm-down.',
      howItWorks:
        'The humerus spans shoulder to elbow. Below the elbow, two parallel bones — the radius (thumb side) and ulna (pinky side) — cross over each other whenever you rotate your forearm.',
      functions: [
        'Forms the ball-and-socket shoulder and hinge elbow joints',
        'Allows 180-degree forearm rotation via the radius crossing the ulna',
        'Provides rigid levers for the biceps, triceps, and hand muscles'
      ],
      connections: ['clavicle', 'biceps', 'deltoids'],
      funFact: 'Hitting your "funny bone" isn’t hitting a bone at all — it’s bumping the ulnar nerve right where it passes behind the humerus!',
      healthTip: 'Weight-bearing upper-body movements help maintain strong arm and wrist bone density.'
    },
    femur: {
      id: 'femur',
      name: 'Femur (Thigh Bone)',
      latin: 'Os femoris',
      system: 'skeletal',
      location: 'Upper leg, from hip socket to knee joint',
      weight: 'Longest & strongest bone (~27% of height)',
      summary:
        'The longest, heaviest, and strongest bone in the human body — engineered to withstand enormous forces during running and jumping.',
      howItWorks:
        'Its angled neck fits smoothly into the hip socket while its thick cylindrical shaft channels weight down to the knee; inside, red and yellow bone marrow produces millions of blood cells.',
      functions: [
        'Supports the entire weight of the upper body during standing and locomotion',
        'Serves as the primary lever for the quadriceps, hamstrings, and glutes',
        'Produces blood cells inside its internal bone marrow'
      ],
      connections: ['pelvis', 'leg_bones', 'quadriceps'],
      funFact: 'A healthy adult femur can resist compression forces of over 1,800 kilograms — roughly the weight of a small car.',
      healthTip: 'Walking, jogging, and resistance exercise stimulate femur bone cells to stay dense and strong.'
    },
    leg_bones: {
      id: 'leg_bones',
      name: 'Lower Leg (Tibia, Fibula & Kneecap)',
      latin: 'Tibia, Fibula et Patella',
      system: 'skeletal',
      location: 'Shin and outer lower leg, from knee to ankle',
      weight: 'Weight-bearing shinbone + stabilizing fibula',
      summary:
        'The twin bones of the lower leg plus the shielding kneecap (patella), working together to bear weight and stabilize every ankle movement.',
      howItWorks:
        'The thick tibia (shinbone) carries ~85% of lower-leg weight, while the slender fibula beside it acts as an outrigger stabilizing the ankle joint and anchoring calf muscles.',
      functions: [
        'Tibia bears body weight from the knee directly down to the ankle and foot',
        'Fibula stabilizes the ankle and anchors lower-leg muscles',
        'Patella protects the knee joint and boosts quadriceps leverage'
      ],
      connections: ['femur', 'calves', 'quadriceps'],
      funFact: 'Babies are born with cartilage kneecaps that gradually harden into solid bone between ages 2 and 6.',
      healthTip: 'Supportive footwear and gradual training increases help prevent shin splints along the tibia.'
    },

    // ===================== OTHER SYSTEMS (+5) =====================
    trachea: {
      id: 'trachea',
      name: 'Trachea & Bronchi (Windpipe)',
      latin: 'Trachea et Bronchi',
      system: 'respiratory',
      location: 'Center of the neck descending into the upper chest',
      weight: '~11 cm long reinforced airway tube',
      summary:
        'The reinforced air pipeline connecting your throat (larynx) to both lungs, lined with microscopic hairs that sweep dust out.',
      howItWorks:
        'C-shaped cartilage rings hold the airway open so it never collapses when you inhale deeply. At the chest, it forks into the left and right main bronchi entering each lung.',
      functions: [
        'Conducts inhaled air smoothly to and from the lungs',
        'Warms, humidifies, and filters dust using mucus and sweeping cilia',
        'Triggers protective coughing if irritants enter the airway'
      ],
      connections: ['lungs', 'esophagus'],
      funFact: 'The cartilage rings are C-shaped (open in the back) so the soft esophagus right behind it can expand when you swallow food!',
      healthTip: 'Staying hydrated keeps the protective mucus layer lining your airways working smoothly.'
    },
    esophagus: {
      id: 'esophagus',
      name: 'Esophagus (Food Pipe)',
      latin: 'Oesophagus',
      system: 'digestive',
      location: 'Runs behind the windpipe from throat through diaphragm to stomach',
      weight: '~25 cm long muscular tube',
      summary:
        'A sleek muscular conveyor belt that actively squeezes swallowed food and liquids down into the stomach in just a few seconds.',
      howItWorks:
        'Coordinated waves of smooth muscle contraction (peristalsis) push food downward — even if you were upside down! A muscular valve at the bottom prevents stomach acid from splashing back up.',
      functions: [
        'Transports chewed food and drink from throat to stomach',
        'Uses one-way peristaltic waves independent of gravity',
        'Seals off stomach acid via the lower esophageal sphincter'
      ],
      connections: ['stomach', 'trachea', 'diaphragm'],
      funFact: 'Because of peristalsis, astronauts in zero gravity can swallow food and water almost as easily as on Earth.',
      healthTip: 'Avoid lying flat immediately after a heavy meal to help the lower valve keep stomach acid down.'
    },
    gallbladder: {
      id: 'gallbladder',
      name: 'Gallbladder',
      latin: 'Vesica biliaris',
      system: 'digestive',
      location: 'Tucked neatly underneath the right lobe of the liver',
      weight: '~7–10 cm pear-shaped pouch',
      summary:
        'A small, emerald-green storage pouch that concentrates bile made by the liver and releases it on demand whenever you eat fatty foods.',
      howItWorks:
        'Between meals, the liver’s bile is stored and concentrated here. When fatty food enters the small intestine, a hormone (CCK) signals the gallbladder to squeeze bile through the bile duct.',
      functions: [
        'Stores and concentrates liver-produced bile up to 10-fold',
        'Releases bile rapidly into the small intestine to break down dietary fats',
        'Aids absorption of fat-soluble vitamins (A, D, E, K)'
      ],
      connections: ['liver', 'small_intestine', 'pancreas'],
      funFact: 'You can live without a gallbladder if it’s removed — the liver simply drips bile directly into the small intestine instead.',
      healthTip: 'Healthy unsaturated fats and fiber-rich meals help keep bile flowing smoothly.'
    },
    aorta_vessels: {
      id: 'aorta_vessels',
      name: 'Major Arteries & Veins',
      latin: 'Aorta & Venae Cavae',
      system: 'circulatory',
      location: 'Branching from the heart through head, torso, arms, and legs',
      weight: '~100,000 km total vessel network',
      summary:
        'The high-pressure arterial highways (red) carrying oxygen-rich blood outward from the heart, and low-pressure veins (blue) returning blood home.',
      howItWorks:
        'Thick, elastic arteries expand with every heartbeat to smooth blood flow. Tiny capillaries exchange oxygen with cells, and valved veins return blood to the heart aided by muscle contractions.',
      functions: [
        'Arteries deliver oxygenated blood and nutrients to every organ and muscle',
        'Veins return carbon dioxide-rich blood back to the heart and lungs',
        'Regulate body temperature by widening (cooling) or narrowing (conserving heat)'
      ],
      connections: ['heart', 'lungs', 'kidneys', 'calves'],
      funFact: 'Blood leaves the heart through the aorta at roughly 1.5 km/h and slows to a crawl in tiny capillaries so cells have time to grab oxygen.',
      healthTip: 'Regular movement keeps blood vessel walls flexible and supports healthy circulation.'
    },
    peripheral_nerves: {
      id: 'peripheral_nerves',
      name: 'Peripheral Nerves',
      latin: 'Systema nervosum periphericum',
      system: 'nervous',
      location: 'Branching from the spinal cord into arms, hands, legs, and feet',
      weight: '43 pairs of cranial & spinal nerve trunks',
      summary:
        'The body’s living fiber-optic cables carrying sensory touch/temperature reports back to the spine and delivering movement commands to every muscle.',
      howItWorks:
        'Wrapped in fatty myelin sheaths that act like wire insulation, nerve axons conduct electrical action potentials in milliseconds to coordinate sensation, balance, and precision motion.',
      functions: [
        'Transmits touch, pressure, pain, and temperature sensations to the brain',
        'Delivers motor signals from brain/spine to over 600 skeletal muscles',
        'Autonomic branches quietly regulate heart rate, digestion, and sweating'
      ],
      connections: ['spinal_cord', 'brain', 'biceps', 'quadriceps'],
      funFact: 'The sciatic nerve running down the back of each leg is the longest and widest single nerve in the body — about as thick as your thumb!',
      healthTip: 'B-vitamins, balanced blood sugar, and stretching keep peripheral nerves healthy and responsive.'
    },

    // ===================== FACIAL & SENSORY ORGANS (4) =====================
    eyes: {
      id: 'eyes',
      name: 'Eyes (Visual Organs)',
      latin: 'Oculi',
      system: 'nervous',
      location: 'Front of the skull inside protective bony eye sockets (orbits)',
      weight: '~7.5 g each (~24 mm diameter)',
      summary:
        'High-precision biological cameras that capture light, focus sharp images, and stream over a million visual signals per second straight to the brain.',
      howItWorks:
        'Light passes through the clear cornea and adjustable pupil, is focused by the flexible lens onto the retina at the back of the eye, where ~126 million rod and cone cells convert light into electrical impulses sent via the optic nerve.',
      functions: [
        'Detects light, color (~10 million shades), depth, and motion',
        'Adjusts pupil size automatically for bright or dim environments',
        'Streams visual data via the optic nerve to the brain’s visual cortex'
      ],
      connections: ['brain', 'skull'],
      funFact: 'Your eye muscles are the fastest-moving muscles in the entire human body — that’s where the phrase "in the blink of an eye" comes from!',
      healthTip: 'Follow the 20-20-20 rule when using screens: every 20 minutes, look 20 feet away for 20 seconds.'
    },
    ears: {
      id: 'ears',
      name: 'Ears (Hearing & Balance)',
      latin: 'Aures',
      system: 'nervous',
      location: 'Sides of the head, extending deep into the temporal skull bone',
      weight: 'Outer auricle + 3 tiny middle-ear bones + inner cochlea',
      summary:
        'Dual-purpose sensory organs that turn invisible sound vibrations into speech and music — while also acting as your body’s built-in gyroscope for balance.',
      howItWorks:
        'Sound waves vibrate the eardrum and three tiny bones (hammer, anvil, stirrup), sending ripples through fluid inside the snail-shaped cochlea. Nearby fluid-filled semicircular canals sense head tilt and rotation.',
      functions: [
        'Captures and amplifies sound waves into neural audio signals',
        'Maintains balance, posture, and spatial orientation via the inner ear',
        'Equalizes air pressure through the Eustachian tube'
      ],
      connections: ['brain', 'skull'],
      funFact: 'The smallest bone in the entire human body is the stirrup (stapes) inside your middle ear — it is only about 3 millimeters long!',
      healthTip: 'Keep headphone volume moderate to protect the delicate microscopic hair cells inside your cochlea.'
    },
    nose: {
      id: 'nose',
      name: 'Nose & Nasal Cavity',
      latin: 'Nasus et Cavitas nasi',
      system: 'respiratory',
      location: 'Center of the face, opening into the upper airway',
      weight: 'Cartilage bridge + humidifying nasal passages',
      summary:
        'Your body’s built-in air conditioner, dust filter, and chemical smell detector — preparing every breath before it reaches the lungs.',
      howItWorks:
        'Inhaled air swirls over curved nasal turbinates lined with warm blood vessels and sticky mucus that trap dust and warm the air. High in the nasal roof, olfactory receptors detect over a trillion distinct scents.',
      functions: [
        'Filters dust, pollen, and microbes from inhaled air',
        'Warms and humidifies air to protect delicate lung alveoli',
        'Detects smells (olfaction) — which powers ~80% of what we perceive as flavor'
      ],
      connections: ['trachea', 'lungs', 'brain'],
      funFact: 'The human nose can distinguish at least 1 trillion different scent combinations, and smell is directly wired to the brain’s memory center.',
      healthTip: 'Breathing gently through your nose filters and warms air much better than mouth breathing.'
    },
    mouth: {
      id: 'mouth',
      name: 'Mouth, Tongue & Teeth',
      latin: 'Cavitas oris, Lingua et Dentes',
      system: 'digestive',
      location: 'Lower front of the face, entrance to the digestive tract',
      weight: '32 adult teeth + 8 interwoven tongue muscles',
      summary:
        'The starting line of digestion and the instrument of human speech — combining mechanical chewing, chemical saliva enzymes, and taste.',
      howItWorks:
        'Teeth slice and grind food into small pieces while salivary glands release amylase to start digesting starches. The flexible muscular tongue senses taste buds, shapes food for swallowing, and articulates speech.',
      functions: [
        'Mechanically chews food with 32 specialized teeth (incisors, canines, molars)',
        'Mixes food with saliva enzymes to begin chemical digestion immediately',
        'Senses 5 basic tastes (sweet, salty, sour, bitter, umami) and produces speech'
      ],
      connections: ['esophagus', 'stomach', 'skull'],
      funFact: 'Tooth enamel is the hardest substance in the entire human body — even harder than bone!',
      healthTip: 'Brush twice daily and chew food thoroughly to kickstart digestion and keep gums healthy.'
    }
  };

  const EXTRA_ORGANS_HE = {
    pectorals: {
      name: 'שרירי החזה (פקטורליס)',
      location: 'קדמת בית החזה העליון, מעצם החזה אל הכתף',
      weight: 'זוג שרירי חזה רחבים בצורת מניפה',
      summary: 'שרירי חזה עבים וחזקים המניעים פעולות דחיפה, מקרבים את הזרועות אל הגוף ומסובבים את הכתפיים פנימה.',
      howItWorks: 'סיבי השריר יוצאים מעצם הבריח ועצם החזה ומתחברים לעצם הזרוע. בהתכווצותם הם מושכים את הזרוע קדימה ולרוחב החזה.',
      functions: [
        'מניעים תנועות דחיפה (שכיבות סמיכה, זריקה, הרמה)',
        'מקרבים את הזרועות אל מול הגוף',
        'מסייעים בשאיפה עמוקה על ידי הרמת כלוב הצלעות'
      ],
      funFact: 'לשריר החזה הגדול יש שני ראשים נפרדים (עליון ותחתון) הפועלים בזוויות דחיפה שונות.',
      healthTip: 'אזן אימוני חזה עם תרגילי גב עליון כדי לשמור על כתפיים פתוחות ויציבה ישרה.'
    },
    deltoids: {
      name: 'שרירי הכתפיים (דלתואיד)',
      location: 'עוטפים ככיפה את מפרק הכתף מכל צד',
      weight: 'שרירים משולשים בעלי 3 ראשים',
      summary: 'שרירים משולשים העוטפים את חלקה העליון של הכתף ומרימים את הזרוע כמעט לכל כיוון — קדימה, הצידה ואחורה.',
      howItWorks: 'מורכבים מסיבים קדמיים, צדיים ואחוריים העוטפים את מפרק הכתף הכדורי ומעניקים לאדם טווח תנועה מרשים.',
      functions: [
        'מרימים את הזרוע הצידה ומעלה',
        'מניעים את הזרוע קדימה ואחורה',
        'מייצבים את מפרק הכתף בעת נשיאת משקל'
      ],
      funFact: 'שמו של השריר מגיע מהאות היוונית דלתא (Δ) בזכות צורת המשולש ההפוך שלו.',
      healthTip: 'חמם את הכתפיים בסיבובי ידיים עדינים לפני הרמת משקל מעל הראש.'
    },
    biceps: {
      name: 'שרירי הזרוע (דו־ראשי ותלת־ראשי)',
      location: 'קדמת הזרוע (דו־ראשי) ואחורי הזרוע (תלת־ראשי)',
      weight: 'צמד שרירים מנוגדים בזרוע העליונה',
      summary: 'צוות המשיכה והדחיפה של הזרוע: הדו־ראשי מכופף את המרפק ומסובב את כף היד מעלה, והתלת־ראשי מיישר את הזרוע.',
      howItWorks: 'מכיוון ששרירים יכולים רק למשוך, הם עובדים בזוגות מנוגדים: כשהדו־ראשי מתכווץ לכופף את המרפק, התלת־ראשי נרפה ולהפך.',
      functions: [
        'הדו־ראשי מכופף את המרפק ומסובב את האמה כלפי מעלה',
        'התלת־ראשי מיישר את מפרק המרפק',
        'יחד הם מייצבים את הכתף ושולטים בהרמה מדויקת'
      ],
      funFact: 'התלת־ראשי מהווה למעשה כשני שלישים מנפח השריר של הזרוע העליונה.',
      healthTip: 'חזק באופן מאוזן גם משיכה (דו־ראשי) וגם יישור (תלת־ראשי) לשמירה על מפרק המרפק.'
    },
    abdominals: {
      name: 'שרירי הבטן (ליבה)',
      location: 'דופן הבטן הקדמית, מכלוב הצלעות ועד האגן',
      weight: 'שרירי ליבה שכבות ומחולקים',
      summary: 'עמוד התווך של הליבה: מכופפים את פלג הגוף העליון, מגנים על האיברים הפנימיים ומייצבים את עמוד השדרה בכל תנועה.',
      howItWorks: 'רצועות גיד רוחביות חוצות את השריר הישר הבטני (ויוצרות את מראה "הקוביות"), בעוד השרירים האלכסוניים והרחב־בטני עוטפים את המותניים כחגורת הגנה טבעית.',
      functions: [
        'מייצבים את עמוד השדרה והאגן בהליכה, ריצה והרמה',
        'מכופפים ומסובבים את הגו',
        'מגנים על איברי הבטן ומסייעים בנשיפה מאומצת'
      ],
      funFact: 'לכל אדם יש שרירי בטן מתחת לעור — נראותם תלויה בעיקר בגנטיקה ובשכבת השומן התת־עורי.',
      healthTip: 'תרגילי פלאנק ונשימה מבוקרת בונים יציבות ליבה עמוקה המונעת כאבי גב תחתון.'
    },
    latissimus: {
      name: 'שרירי הגב (גב רחב וטרפז)',
      location: 'הגב העליון והאמצעי, מהצוואר ועד הגב התחתון',
      weight: 'השרירים הרחבים ביותר בגב',
      summary: 'שרירי גב גדולים בצורת כנפיים המניעים פעולות משיכה, טיפוס, שחייה ושמירה על יציבה זקופה מול כוח הכבידה.',
      howItWorks: 'הטרפז פרוש על הצוואר והשכמות כדי להרים ולקרב את השכמות, ואילו הרחב־גבי מושך את הזרועות מטה ואחורה.',
      functions: [
        'מניעים תנועות משיכה (מתח, חתירה, שחייה)',
        'תומכים ביציבה זקופה ומחזיקים את הכתפיים לאחור',
        'מייצבים את עמוד השדרה בהרמת משקל'
      ],
      funFact: 'פירוש השם הלטיני Latissimus Dorsi הוא פשוט "השריר הרחב ביותר של הגב".',
      healthTip: 'חיזוק הגב העליון מאזן שעות ישיבה מול מחשב או מבט למטה בטלפון.'
    },
    glutes: {
      name: 'שרירי העכוז (גלוטאוס)',
      location: 'אחורי האגן',
      weight: 'השריר הגדול והחזק ביותר בגוף',
      summary: 'תחנת הכוח של התנועה הזקופה באדם — דוחף אותך במעלה מדרגות, בקימה מכיסא, בריצה ובקפיצה.',
      howItWorks: 'מתחבר מהאגן ועצם העצה אל עצם הירך, פושט את מפרק הירך בעוצמה ושומר על האגן מאוזן בכל צעד.',
      functions: [
        'פושט את הירך בקימה, טיפוס, קפיצה וספרינט',
        'שומר על פלג הגוף העליון זקוף (ייחודי להליכה על שתיים)',
        'מייצב את האגן והגב התחתון'
      ],
      funFact: 'לבני אדם יש שרירי עכוז גדולים בהרבה ביחס לגוף משאר הפרימטים בזכות ההליכה והריצה הזקופה.',
      healthTip: 'קום והתהלך מדי שעה אם אתה יושב רוב היום כדי לשמור על פעילות שרירי העכוז.'
    },
    quadriceps: {
      name: 'שרירי הירך (ארבע־ראשי ואחורי הירך)',
      location: 'קדמת הירך (ארבע־ראשי) ואחורי הירך (המסטרינג)',
      weight: '4 ראשים מלפנים + 3 שרירים מאחור',
      summary: 'שרירי ירך מסיביים המיישרים ומכופפים את הברך, בולמים זעזועים בנחיתה ומייצרים כוח להליכה, רכיבה וקפיצה.',
      howItWorks: 'ארבעת ראשי הארבע־ראשי מתאחדים לגיד העובר על פני הפיקה ומיישר את הרגל, בעוד שרירי אחורי הירך מכופפים את הברך.',
      functions: [
        'מיישרים את הברך ונושאים את משקל הגוף בעמידה וכריעה',
        'מכופפים את הברך ובולמים את התנופה בריצה',
        'סופגים זעזועים להגנה על מפרק הברך'
      ],
      funFact: 'הארבע־ראשי הוא למעשה קבוצה של ארבעה שרירים נפרדים הפועלים יחד כמיישר ברך אדיר.',
      healthTip: 'שרירי ירך חזקים וגמישים הם בולם הזעזועים הטבעי הטוב ביותר לשמירה על הברכיים.'
    },
    calves: {
      name: 'שרירי השוק (תאומים וסולאוס)',
      location: 'אחורי השוק, מעל גיד אכילס',
      weight: 'שרירי סיבולת גבוהה ברגל התחתונה',
      summary: 'שרירים קפיציים הדוחפים את כף הרגל מהקרקע בכל צעד ומסייעים להזרים דם ורידי חזרה מעלה אל הלב.',
      howItWorks: 'שריר התאומים והסולאוס שמתחתיו מתמזגים לגיד אכילס העבה בעקב. התכווצותם דוחפת את כף הרגל מטה ומזניקה אותך קדימה.',
      functions: [
        'דוחפים את הגוף קדימה בהליכה, ריצה וקפיצה',
        'מאזנים את שיווי המשקל בעמידה',
        'פועלים כ"לב שני" הלוחץ על ורידי הרגל להחזרת דם מעלה'
      ],
      funFact: 'גיד אכילס המחבר את שריר השוק לעקב הוא הגיד העבה והחזק ביותר בגוף האדם.',
      healthTip: 'מתיחות שוקיים ותנועת קרסול מונעות נוקשות בגיד אכילס ועייפות ברגליים.'
    },
    skull: {
      name: 'הגולגולת והלסת',
      location: 'הראש, עוטפת את המוח ומבני הפנים',
      weight: '22 עצמות מאוחות ומפרק לסת',
      summary: 'קסדת עצם מגנה מ־8 עצמות גולגולת השומרות על המוח ו־14 עצמות פנים המעצבות את ארובות העיניים, האף והלסת.',
      howItWorks: 'עצמות הגולגולת משתלבות בתפרים משוננים חזקים לעמידות גבוהה, בעוד הלסת התחתונה היא העצם הנעה היחידה ללעיסה ודיבור.',
      functions: [
        'עוטפת ומגנה על המוח העדין מפני חבטות',
        'יוצרת ארובות מגן לעיניים, לאוזן הפנימית ולאף',
        'מעגנת שרירי הבעה ולעיסה'
      ],
      funFact: 'תינוקות נולדים עם מרפסים רכים בגולגולת כדי לאפשר למוח הגדל במהירות להתרחב.',
      healthTip: 'חבוש תמיד קסדה ברכיבה או בספורט מגע — העצם חזקה אך המוח שבתוכה רגיש.'
    },
    clavicle: {
      name: 'עצם הבריח והשכמה',
      location: 'קדמת הכתף (בריח) וגב עליון (שכמה)',
      weight: 'זוג מוטות בצורת S ולוחות משולשים',
      summary: 'גשר התלייה הגרמי המחבר את הזרועות אל הגו ומרחיק את הכתפיים החוצה כדי שהידיים ינועו בחופשיות.',
      howItWorks: 'עצם הבריח בצורת S פועלת כתומך קשיח בין עצם החזה לשכמה המשולשת מאחור, ומעבירה כוחות מהזרוע אל הגוף.',
      functions: [
        'תומכת בכתפיים ומאפשרת טווח תנועה רחב לזרועות',
        'מגנה על עצבים וכלי דם גדולים העוברים לזרוע',
        'משמשת עוגן לשרירי גב, חזה וכתפיים'
      ],
      funFact: 'עצם הבריח היא העצם שנשברת בשכיחות הגבוהה ביותר בגוף בנפילה על יד מושטת.',
      healthTip: 'שמירה על שכמות רגועות ומעט לאחור מקלה על עומס בצוואר ובכתפיים.'
    },
    pelvis: {
      name: 'עצם האגן',
      location: 'בסיס הגו, מחבר בין עמוד השדרה לרגליים',
      weight: 'טבעת עצמות מאוחה (כסל, שת, חיק ועצה)',
      summary: 'טבעת עצם חזקה בצורת קערה המעבירה את משקל פלג הגוף העליון מהגב אל הרגליים ומגנה על שלפוחית השתן.',
      howItWorks: 'שקעים עמוקים משני צדי האגן אוחזים בראשי עצמות הירך ויוצרים מפרקי ירך כדוריים חזקים ויציבים במיוחד.',
      functions: [
        'מעביר את משקל הגוף מעמוד השדרה אל שתי הרגליים',
        'מגן על שלפוחית השתן, איברי הרבייה והמעי התחתון',
        'מעגן את שרירי העכוז, הירך והליבה'
      ],
      funFact: 'אגן האישה רחב ופתוח יותר באופן טבעי מאגן הגבר כדי לאפשר לידה.',
      healthTip: 'שרירי ליבה וירך חזקים שומרים על איזון האגן ומפחיתים עומס מהגב התחתון.'
    },
    arm_bones: {
      name: 'עצמות הזרוע והאמה',
      location: 'זרוע עליונה (הומרוס) ואמה (חישור וגומד)',
      weight: '3 עצמות מנוף ארוכות בכל יד',
      summary: 'מנופים מכניים מדויקים המאפשרים להושיט יד, להרים, לזרוק ולסובב את כף היד בצורה חלקה.',
      howItWorks: 'עצם הזרוע נמתחת מהכתף למרפק. באמה שתי עצמות מקבילות — החישור (צד האגודל) והגומד — שמצטלבות זו על זו בעת סיבוב כף היד.',
      functions: [
        'יוצרות את מפרק הכתף הכדורי ומפרק המרפק',
        'מאפשרות סיבוב אמה של 180 מעלות',
        'משמשות מנוף קשיח לשרירי הזרוע והיד'
      ],
      funFact: 'כאשר מקבלים מכה ב"עצם החשמל" במרפק, למעשה פוגעים בעצב האולנרי העובר ממש מאחורי עצם הזרוע.',
      healthTip: 'תרגילי התנגדות לידיים מחזקים את צפיפות העצם באמה ובשורש כף היד.'
    },
    femur: {
      name: 'עצם הירך (פמור)',
      location: 'הרגל העליונה, ממפרק הירך ועד הברך',
      weight: 'העצם הארוכה והחזקה ביותר (~27% מהגובה)',
      summary: 'העצם הארוכה, הכבדה והחזקה ביותר בגוף האדם — בנויה לעמוד בעומסים אדירים בזמן ריצה וקפיצה.',
      howItWorks: 'ראשה המעוגל יושב במפרק הירך, והגזע העבה שלה מעביר את המשקל לברך; בתוכה מח עצם המייצר מיליוני תאי דם.',
      functions: [
        'נושאת את כל משקל פלג הגוף העליון בעמידה ותנועה',
        'משמשת מנוף מרכזי לשרירי הירך והעכוז',
        'מייצרת תאי דם בתוך מח העצם הפנימי'
      ],
      funFact: 'עצם ירך בוגרת ובריאה יכולה לעמוד בלחץ דחיסה של מעל 1,800 ק״ג — בערך משקל של מכונית קטנה.',
      healthTip: 'הליכה, ריצה ואימוני כוח מעודדים את תאי עצם הירך להישאר צפופים וחזקים.'
    },
    leg_bones: {
      name: 'עצמות השוק והפיקה',
      location: 'קדמת השוק (שוקה), הצד החיצוני (שוקית) והברך (פיקה)',
      weight: 'עצם שוק נושאת משקל + שוקית מייצבת',
      summary: 'זוג עצמות השוק יחד עם פיקת הברך המגנה — נושאות משקל ומייצבות כל תנועה של הקרסול.',
      howItWorks: 'עצם השוקה העבה נושאת כ־85% מהמשקל, בעוד השוקית הדקה לצדה מייצבת את מפרק הקרסול ומעגנת שרירי שוק.',
      functions: [
        'השוקה מעבירה משקל מהברך ישירות לקרסול ולכף הרגל',
        'השוקית מייצבת את הקרסול ומעגנת שרירים',
        'הפיקה מגנה על הברך ומגבירה את כוח שריר הירך'
      ],
      funFact: 'תינוקות נולדים עם פיקות ברך מסחוס רך שמתקשה לעצם מוצקה בין גיל שנתיים לשש.',
      healthTip: 'נעליים תומכות והעלאת עומס הדרגתית עוזרות למנוע שברי מאמץ וכאבי שוק.'
    },
    trachea: {
      name: 'קנה הנשימה והסמפונות',
      location: 'מרכז הצוואר ויורד אל בית החזה העליון',
      weight: 'צינור אוויר מחוזק באורך כ־11 ס״מ',
      summary: 'צינור האוויר המחוזק המחבר בין הגרון לריאות, מרופד בשעריות מיקרוסקופיות המטאטאות אבק החוצה.',
      howItWorks: 'טבעות סחוס בצורת C שומרות על הקנה פתוח שלא יקרוס בשאיפה עמוקה. בחזה הוא מתפצל לסמפונות הנכנסים לכל ריאה.',
      functions: [
        'מוליך אוויר בצורה חלקה אל הריאות ומהן',
        'מחמם, מלחלח ומסנן אבק באמצעות ריר ושעריות',
        'מפעיל שיעול מגן אם חודרים חלקיקים זרים'
      ],
      funFact: 'טבעות הסחוס פתוחות מאחור (צורת C) כדי שהוושט שמאחוריהן יוכל להתרחב כשאתה בולע אוכל!',
      healthTip: 'שתייה מספקת שומרת על שכבת הריר המגנה בדופן דרכי הנשימה.'
    },
    esophagus: {
      name: 'הוושט',
      location: 'עובר מאחורי קנה הנשימה מהגרון דרך הסרעפת אל הקיבה',
      weight: 'צינור שרירי באורך כ־25 ס״מ',
      summary: 'מסוע שרירי חלק הדוחף מזון ושתייה שנבלעו אל הקיבה בתוך שניות ספורות.',
      howItWorks: 'גלי התכווצות מתואמים (פריסטלטיקה) דוחפים את המזון מטה — גם אילו היית הפוך! שסתום שרירי בתחתית מונע עליית חומצה.',
      functions: [
        'מעביר מזון ושתייה מהגרון אל הקיבה',
        'מבצע תנועה חד־כיוונית שאינה תלויה בכוח הכבידה',
        'חוסם חזרת חומצת קיבה כלפי מעלה'
      ],
      funFact: 'בזכות הפריסטלטיקה, אסטרונאוטים בחוסר משקל בולעים אוכל ומים כמעט בקלות כמו על כדור הארץ.',
      healthTip: 'הימנע משכיבה מיד אחרי ארוחה כבדה כדי לעזור לשסתום התחתון לשמור על החומצה בקיבה.'
    },
    gallbladder: {
      name: 'כיס המרה',
      location: 'מונח ממש מתחת לאונה הימנית של הכבד',
      weight: 'כיס בצורת אגס באורך כ־7–10 ס״מ',
      summary: 'כיס אחסון קטן וירוק המרכז מיץ מרה שמייצר הכבד ומשחרר אותו לפי דרישה בעת אכילת מזון שומני.',
      howItWorks: 'בין ארוחות מיץ המרה נשמר ומרוכז כאן. כששומן מגיע למעי הדק, הורמון מאותת לכיס המרה להתכווץ ולהזרים מרה.',
      functions: [
        'אוגר ומרכז מיץ מרה מהכבד עד פי 10',
        'משחרר מיץ מרה למעי הדק לפירוק שומנים',
        'מסייע בספיגת ויטמינים מסיסי שומן (A, D, E, K)'
      ],
      funFact: 'אפשר לחיות ללא כיס מרה — במקרה של הסרה, הכבד פשוט מטפטף מרה ישירות למעי הדק.',
      healthTip: 'שומנים בריאים וארוחות עשירות בסיבים תומכים בזרימה תקינה של מיץ המרה.'
    },
    aorta_vessels: {
      name: 'העורקים והוורידים הראשיים',
      location: 'מתפצלים מהלב אל הראש, הגו, הזרועות והרגליים',
      weight: 'רשת כלי דם באורך כ־100,000 ק״מ',
      summary: 'כבישי העורקים בלחץ גבוה (אדום) המובילים דם עשיר בחמצן מהלב החוצה, והוורידים (כחול) המחזירים דם חזרה.',
      howItWorks: 'עורקים גמישים מתרחבים בכל פעימת לב. נימים זעירים מחליפים חמצן עם התאים, וורידים בעלי מסתמים מחזירים דם ללב בסיוע השרירים.',
      functions: [
        'עורקים מובילים חמצן ומזון לכל איבר ושריר',
        'ורידים מחזירים דם עמוס פחמן דו־חמצני אל הלב והריאות',
        'מווסתים חום גוף באמצעות התרחבות (קירור) או התכווצות'
      ],
      funFact: 'הדם יוצא מהלב באבי העורקים במהירות של כ־1.5 קמ״ש ומאט מאוד בנימים כדי שלתאים יהיה זמן לקלוט חמצן.',
      healthTip: 'תנועה יומיומית שומרת על גמישות דפנות כלי הדם ועל זרימת דם תקינה.'
    },
    peripheral_nerves: {
      name: 'מערכת העצבים ההיקפית',
      location: 'מתפצלת מחוט השדרה אל הזרועות, הידיים, הרגליים וכפות הרגליים',
      weight: '43 זוגות של גזעי עצב ראשיים',
      summary: 'כבלי הסיבים האופטיים החיים של הגוף המעבירים תחושות מגע וטמפרטורה מעלה, ושולחים פקודות תנועה לכל שריר.',
      howItWorks: 'סיבי העצב עטופים במעטפת מיאלין המבודדת אותם ומאפשרת לאותות חשמליים לעבור בתוך אלפיות השנייה.',
      functions: [
        'מעבירים תחושות מגע, לחץ, כאב וחום אל המוח',
        'מוליכים פקודות תנועה ליותר מ־600 שרירי שלד',
        'ענפים אוטונומיים מווסתים בשקט דופק, עיכול והזעה'
      ],
      funFact: 'עצב השת (הסיאטי) היורד לאורך אחורי הרגל הוא העצב הארוך והעבה ביותר בגוף — בערך בעובי אגודל!',
      healthTip: 'ויטמיני B, סוכר מאוזן ומתיחות שומרים על בריאות ותגובתיות העצבים ההיקפיים.'
    },
    eyes: {
      name: 'העיניים (איברי הראייה)',
      location: 'קדמת הגולגולת, בתוך ארובות העיניים המגנות',
      weight: 'כ־7.5 גרם כל אחת (קוטר כ־24 מ״מ)',
      summary: 'מצלמות ביולוגיות מדויקות להפליא הקולטות אור, ממקדות תמונה חדה ומשדרות מעל מיליון אותות ראייה בשנייה ישירות אל המוח.',
      howItWorks: 'האור עובר דרך הקרנית והאישון, מתמקד בעדשה אל הרשתית שבאחורי העין, שם כ־126 מיליון קולטני אור הופכים אותו לאותות חשמליים העוברים בעצב הראייה.',
      functions: [
        'קולטות אור, כ־10 מיליון גווני צבע, עומק ותנועה',
        'מתאימות את גודל האישון אוטומטית לאור חזק או לחושך',
        'משדרות נתוני ראייה דרך עצב הראייה לקליפת המוח'
      ],
      funFact: 'שרירי העין הם השרירים המהירים ביותר בכל גוף האדם — ומכאן הביטוי "כהרף עין"!',
      healthTip: 'אמץ את כלל 20-20-20 מול מסכים: כל 20 דקות הבט למרחק 6 מטרים למשך 20 שניות.'
    },
    ears: {
      name: 'האוזניים (שמיעה ושיווי משקל)',
      location: 'צדי הראש, נמשכות עמוק לתוך עצם הרקה שבגולגולת',
      weight: 'אפרכסת חיצונית + 3 עצמות שמע זעירות + שבלול פנימי',
      summary: 'איברי חוש דו־תכליתיים ההופכים תנודות קול בלתי נראות לדיבור ומוזיקה — וגם משמשים כג׳ירוסקופ פנימי לשיווי משקל.',
      howItWorks: 'גלי קול מרטיטים את עור התוף ושלוש עצמות שמע זעירות (פטיש, סדן, ארכובה) המניעות נוזל בשבלול האוזן. תעלות קשתיות סמוכות חשות הטיה וסיבוב של הראש.',
      functions: [
        'קולטות ומגבירות גלי קול לאותות עצביים של שמע',
        'שומרות על שיווי משקל, יציבה והתמצאות במרחב',
        'מאזנות לחצי אוויר דרך חצוצרת השמע'
      ],
      funFact: 'העצם הקטנה ביותר בכל גוף האדם היא עצם הארכובה שבאוזן התיכונה — אורכה כ־3 מילימטרים בלבד!',
      healthTip: 'שמור על עוצמת שמע מתונה באוזניות כדי להגן על תאי השערה העדינים שבאוזן הפנימית.'
    },
    nose: {
      name: 'האף וחלל האף',
      location: 'מרכז הפנים, פתח הכניסה העליון לדרכי הנשימה',
      weight: 'גשר סחוס + תעלות אף מלחלחות ומסננות',
      summary: 'מזגן האוויר, מסנן האבק וגלאי הריחות המובנה של הגוף — מכין כל נשימה לפני שהיא מגיעה לריאות.',
      howItWorks: 'אוויר נשאף מסתחרר על פני קונכיות האף המרופדות בכלי דם חמים וריר הלוכד אבק ומחמם את האוויר. בגג האף קולטני ריח המזהים מעל טריליון ריחות.',
      functions: [
        'מסנן אבק, אבקנים וחיידקים מהאוויר הנשאף',
        'מחמם ומלחלח את האוויר להגנה על נאדיות הריאה העדינות',
        'מזהה ריחות — שאחראים לכ־80% מחוויית הטעם של אוכל'
      ],
      funFact: 'האף האנושי מסוגל להבחין לפחות בטריליון שילובי ריחות שונים, וחוש הריח מחובר ישירות למרכז הזיכרון במוח.',
      healthTip: 'נשימה עדינה דרך האף מסננת ומחממת את האוויר טוב בהרבה מנשימה דרך הפה.'
    },
    mouth: {
      name: 'הפה, הלשון והשיניים',
      location: 'קדמת הפנים התחתונה, שער הכניסה למערכת העיכול',
      weight: '32 שיניים בוגרות + 8 שרירי לשון שזורים',
      summary: 'קו הזינוק של מערכת העיכול וכלי הנגינה של הדיבור האנושי — משלב לעיסה מכנית, אנזימי רוק וחוש טעם.',
      howItWorks: 'השיניים חותכות וטוחנות את המזון בעוד בלוטות הרוק מפרישות עמילאז המתחיל לפרק פחמימות מיד. הלשון השרירית חשה טעמים, דוחפת לבליעה ומפיקה דיבור.',
      functions: [
        'לעיסה מכנית בעזרת 32 שיניים מתמחות (חותכות, ניבים וטוחנות)',
        'ערבוב המזון באנזימי רוק לתחילת העיכול הכימי',
        'זיהוי 5 טעמי יסוד (מתוק, מלוח, חמוץ, מר, אומאמי) והפקת דיבור'
      ],
      funFact: 'זגוגית השן (אמייל) היא החומר הקשה ביותר בכל גוף האדם — קשה אפילו יותר מעצם!',
      healthTip: 'צחצח שיניים פעמיים ביום ולעס היטב את האוכל לתחילת עיכול קלה ובריאה.'
    }
  };

  // Merge new organs into ANATOMA_DATA
  const D = global.ANATOMA_DATA;
  Object.assign(D.ORGANS, EXTRA_ORGANS_EN);

  // Update each system's comprehensive keyOrgans list
  D.SYSTEMS.nervous.keyOrgans = ['brain', 'eyes', 'ears', 'spinal_cord', 'peripheral_nerves'];
  D.SYSTEMS.circulatory.keyOrgans = ['heart', 'aorta_vessels', 'spleen'];
  D.SYSTEMS.respiratory.keyOrgans = ['nose', 'trachea', 'lungs', 'diaphragm'];
  D.SYSTEMS.digestive.keyOrgans = ['mouth', 'esophagus', 'stomach', 'liver', 'gallbladder', 'pancreas', 'small_intestine', 'large_intestine'];
  D.SYSTEMS.urinary.keyOrgans = ['kidneys', 'bladder'];
  D.SYSTEMS.skeletal.keyOrgans = ['skull', 'clavicle', 'ribcage', 'spine', 'pelvis', 'arm_bones', 'femur', 'leg_bones'];
  D.SYSTEMS.muscular.keyOrgans = ['pectorals', 'deltoids', 'biceps', 'abdominals', 'latissimus', 'glutes', 'quadriceps', 'calves'];

  // Wrap AnatomaI18n.getOrgan so it also returns Hebrew for all new organs!
  const origGetOrgan = global.AnatomaI18n.getOrgan;
  global.AnatomaI18n.getOrgan = function (id) {
    if (global.AnatomaI18n.getLang() === 'he' && EXTRA_ORGANS_HE[id] && D.ORGANS[id]) {
      return { ...D.ORGANS[id], ...EXTRA_ORGANS_HE[id] };
    }
    return origGetOrgan(id);
  };
})(window);
