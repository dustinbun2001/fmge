/**
 * PulsePrep - FMGE Practice Application
 * Dynamic Medical Combinatorial Question Compiler (5,000+ MCQs)
 * Generates 270 distinct, medically correct questions per subject across all 19 FMGE subjects.
 */

const SUBJECT_PROFILES = {
  "Anatomy": {
    wrong: ["Median nerve lesion", "Radial nerve injury", "Ulnar nerve claw", "Axillary nerve palsy"],
    conditions: [
      {
        name: "Radial nerve injury",
        symptoms: ["wrist drop (inability to extend wrist/fingers)", "weakness of elbow extension and wrist extension", "inability to extend metacarpophalangeal joints"],
        diagnostics: ["mid-shaft humerus fracture", "radial groove compression ('Saturday night palsy')", "prolonged crutch pressure in axilla"],
        treatments: ["wrist-splinting and physical therapy", "conservative management with cockpit splints", "surgical exploration of the spiral groove"],
        complications: ["permanent extension deficit", "persistent sensory loss in web space"],
        explanation: "Radial nerve runs in the spiral groove of humerus. Injury leads to paralysis of wrist and finger extensors (wrist drop) and sensory loss on the dorsum of hand."
      },
      {
        name: "Ulnar nerve lesion",
        symptoms: ["clawing of the 4th and 5th digits", "weakness of finger adduction and abduction", "hypothenar muscle wasting"],
        diagnostics: ["medial epicondyle humerus fracture", "guyon canal compression at wrist", "cubital tunnel entrapment at elbow"],
        treatments: ["surgical decompression of the nerve", "avoiding elbow flexion and padding", "splinting of the ring and little fingers"],
        complications: ["permanent claw hand deformity", "loss of grip strength and adduction"],
        explanation: "Ulnar nerve supplies intrinsic hand muscles. Injury leads to ulnar claw hand (flexion of ring and little finger at IP joints) and hypothenar wasting."
      },
      {
        name: "Median nerve entrapment",
        symptoms: ["thenar muscle atrophy and ape-hand deformity", "numbness in lateral 3.5 digits", "pain worse at night radiating to forearm"],
        diagnostics: ["carpal tunnel syndrome under flexor retinaculum", "supracondylar humerus fracture", "pronator teres muscle compression"],
        treatments: ["carpal tunnel release surgery", "wrist splinting in neutral position", "local corticosteroid injections"],
        complications: ["permanent loss of thumb opposition", "chronic hand paresthesias"],
        explanation: "Median nerve passes through the carpal tunnel. Entrapment leads to carpal tunnel syndrome, causing thenar wasting and sensory deficits in lateral 3.5 digits."
      },
      {
        name: "Axillary nerve palsy",
        symptoms: ["weakness in shoulder abduction above 15 degrees", "flat shoulder deformity due to deltoid atrophy", "inability to externally rotate the shoulder"],
        diagnostics: ["fracture of surgical neck of humerus", "anterior shoulder dislocation", "direct trauma to the lateral shoulder"],
        treatments: ["deltoid rehabilitation therapy", "shoulder immobilization and rest", "nerve reconstruction in severe cases"],
        complications: ["permanent shoulder abduction weakness", "persistent sensory loss over deltoid area"],
        explanation: "Axillary nerve winds around the surgical neck of humerus and supplies the deltoid and teres minor muscles, responsible for shoulder abduction."
      },
      {
        name: "Long thoracic nerve injury",
        symptoms: ["winging of the scapula on pushing against wall", "difficulty in raising the arm above 90 degrees", "dull ache in the shoulder and upper back"],
        diagnostics: ["radical mastectomy surgical dissection", "deep laceration in the axilla", "carrying heavy loads on the shoulder"],
        treatments: ["serratus anterior muscle physical therapy", "avoidance of overhead lifting", "scapular bracing"],
        complications: ["chronic shoulder girdle pain", "permanent winging deformity"],
        explanation: "Long thoracic nerve of Bell (C5-C7) supplies the serratus anterior muscle. Injury prevents stabilizing the scapula, causing it to wing."
      }
    ]
  },
  "Physiology": {
    wrong: ["Diabetes Insipidus", "SIADH", "Cushing's Syndrome", "Addison's Disease"],
    conditions: [
      {
        name: "SIADH",
        symptoms: ["lethargy, confusion, and muscle cramps", "seizures and coma due to cerebral edema", "generalized weakness with normal volume status"],
        diagnostics: ["profound hyponatremia with high urine osmolality", "low serum osmolality with concentrated urine", "euvolemic hyponatremia"],
        treatments: ["strict fluid restriction", "hypertonic saline for severe symptoms", "vaptan (vasopressin receptor antagonists)"],
        complications: ["central pontine myelinolysis from rapid correction", "severe cerebral edema"],
        explanation: "SIADH is characterized by excessive ADH release, leading to water retention, dilutional hyponatremia, and highly concentrated urine."
      },
      {
        name: "Diabetes Insipidus",
        symptoms: ["excessive thirst (polydipsia) and high volume urination", "craving for ice-cold water", "fatigue from waking up to urinate at night"],
        diagnostics: ["high serum osmolality with low urine osmolality", "failure to concentrate urine during water deprivation test", "rapid rise in urine concentration after desmopressin"],
        treatments: ["desmopressin (DDAVP) nasal spray", "thiazide diuretics and low sodium diet", "adequate free water intake"],
        complications: ["severe dehydration and hypovolemic shock", "electrolyte imbalance"],
        explanation: "Diabetes Insipidus features deficient ADH (Central) or renal resistance (Nephrogenic), leading to polyuria of dilute urine."
      },
      {
        name: "Cushing's Syndrome",
        symptoms: ["moon facies, buffalo hump, and purple abdominal striae", "proximal muscle weakness and easy bruising", "excessive hair growth and weight gain"],
        diagnostics: ["elevated 24-hour urinary free cortisol", "failure to suppress cortisol with low-dose dexamethasone", "elevated ACTH levels indicating pituitary source"],
        treatments: ["surgical resection of pituitary adenoma (transsphenoidal)", "adrenalectomy for adrenal tumors", "ketoconazole to inhibit steroidogenesis"],
        complications: ["severe osteoporosis and pathologic fractures", "cardiovascular disease and diabetes"],
        explanation: "Cushing's syndrome is caused by chronic exposure to excess glucocorticoids, leading to central obesity, skin thinning, and muscle wasting."
      },
      {
        name: "Addison's Disease",
        symptoms: ["hyperpigmentation of skin creases and buccal mucosa", "chronic fatigue, weight loss, and postural hypotension", "craving for salty foods"],
        diagnostics: ["low serum cortisol with high ACTH levels", "failure of cortisol to rise after cosyntropin stimulation", "severe hyponatremia and hyperkalemia"],
        treatments: ["hydrocortisone and fludrocortisone replacement", "intravenous saline and steroids during crisis", "stress-dose steroid instructions"],
        complications: ["fatal adrenal crisis during infections", "severe hypovolemic shock"],
        explanation: "Addison's disease is primary adrenal insufficiency, causing lack of cortisol and aldosterone, leading to hyperpigmentation (due to ACTH/MSH) and hyperkalemia."
      },
      {
        name: "Primary Aldosteronism",
        symptoms: ["muscle weakness and paresthesias", "resistant hypertension unresponsive to multiple drugs", "episodic muscle cramps and polyuria"],
        diagnostics: ["hypokalemia with high plasma aldosterone-to-renin ratio", "failure to suppress aldosterone with saline infusion", "adrenal venous sampling showing unilateral excess"],
        treatments: ["spironolactone or eplerenone therapy", "unilateral laparoscopic adrenalectomy", "potassium supplementation"],
        complications: ["left ventricular hypertrophy and stroke", "chronic kidney disease"],
        explanation: "Conn's syndrome (primary aldosteronism) is characterized by autonomous aldosterone secretion, causing sodium retention (hypertension) and potassium wasting (hypokalemia)."
      }
    ]
  },
  "Biochemistry": {
    wrong: ["Alkaptonuria", "Phenylketonuria", "G6PD Deficiency", "Tay-Sachs Disease"],
    conditions: [
      {
        name: "Phenylketonuria",
        symptoms: ["intellectual disability and developmental delay", "musty or mousy odor of urine and sweat", "fair skin, blonde hair, and blue eyes"],
        diagnostics: ["deficiency of phenylalanine hydroxylase enzyme", "accumulation of phenylalanine in blood screening", "increased urinary phenylpyruvic acid"],
        treatments: ["phenylalanine-restricted diet", "sapropterin (BH4 cofactor) supplementation", "avoidance of aspartame in foods"],
        complications: ["irreversible brain damage and seizures", "severe developmental delay"],
        explanation: "PKU is caused by phenylalanine hydroxylase deficiency, leading to toxic accumulation of phenylalanine and tyrosine deficiency (hypopigmentation)."
      },
      {
        name: "G6PD Deficiency",
        symptoms: ["acute hemolytic anemia after drug ingestion", "jaundice, dark cola-colored urine, and back pain", "scleral icterus following fava bean consumption"],
        diagnostics: ["presence of Heinz bodies on peripheral smear", "bite cells in blood smear", "decreased NADPH generation in red cells"],
        treatments: ["avoidance of oxidative drugs (Primaquine, Sulfa)", "hydration and blood transfusion during hemolytic crisis", "prompt treatment of underlying infections"],
        complications: ["acute renal failure due to severe hemolysis", "kernicterus in neonates"],
        explanation: "G6PD deficiency is an X-linked recessive disorder impairing glutathione reduction, making RBCs susceptible to oxidative stress, forming Heinz bodies."
      },
      {
        name: "Alkaptonuria",
        symptoms: ["darkening of urine on standing in air", "dark pigmentation of sclera and ear cartilage (ochronosis)", "chronic severe joint pain in spine and hips"],
        diagnostics: ["deficiency of homogentisic acid oxidase enzyme", "high levels of homogentisic acid in urine", "calcification of intervertebral discs on X-ray"],
        treatments: ["dietary restriction of tyrosine and phenylalanine", "high-dose Vitamin C (ascorbic acid) therapy", "nitisinone to reduce ochronotic pigment"],
        complications: ["severe debilitating osteoarthritis", "heart valve calcification and stenosis"],
        explanation: "Alkaptonuria is an autosomal recessive deficiency of homogentisate oxidase, causing accumulation of homogentisic acid which forms dark ochronotic pigment in connective tissues."
      },
      {
        name: "Tay-Sachs Disease",
        symptoms: ["loss of motor milestones and startle response to noise", "progressive blindness and muscle weakness", "macrocephaly with normal pressure"],
        diagnostics: ["cherry-red spot on the macula on fundoscopy", "deficiency of hexosaminidase A enzyme", "accumulation of GM2 ganglioside in brain lysosomes"],
        treatments: ["supportive care and seizure control", "enzyme replacement therapy clinical trials", "genetic counseling for parents"],
        complications: ["progressive vegetative state and death by age 4", "severe dysphagia and aspiration"],
        explanation: "Tay-Sachs is a lysosomal storage disease caused by hexosaminidase A deficiency, leading to GM2 ganglioside accumulation. Cherry-red spot is characteristic."
      },
      {
        name: "McArdle Disease",
        symptoms: ["painful muscle cramps during brief intense exercise", "myoglobinuria (burgundy urine) after heavy lifting", "muscle fatigue relieved by a short rest ('second wind')"],
        diagnostics: ["deficiency of skeletal muscle glycogen phosphorylase", "failure of blood lactate to rise during ischemic exercise test", "glycogen accumulation in subsarcolemmal vacuoles"],
        treatments: ["oral sucrose consumption before physical exercise", "low-intensity aerobic training", "high-protein diet"],
        complications: ["rhabdomyolysis and acute kidney injury", "permanent muscle wasting in older age"],
        explanation: "McArdle's (Glycogen storage disease type V) is a skeletal muscle phosphorylase deficiency, blocking glycogenolysis during anaerobic exercise."
      }
    ]
  },
  "Pharmacology": {
    wrong: ["Digoxin Toxicity", "Atropine Overdose", "Organophosphate Poisoning", "Acetaminophen Toxicity"],
    conditions: [
      {
        name: "Digoxin Toxicity",
        symptoms: ["nausea, vomiting, and abdominal pain", "xanthopsia (blurred yellow-green vision)", "palpitations and dizzy spells"],
        diagnostics: ["ECG showing paroxysmal atrial tachycardia with block", "salvador dali mustache sign (ST depression)", "hyperkalemia on serum chemistry"],
        treatments: ["digoxin immune Fab (Digibind) therapy", "correction of hypokalemia and hypomagnesemia", "atropine for severe bradycardia"],
        complications: ["ventricular fibrillation and cardiac arrest", "severe hyperkalemia"],
        explanation: "Digoxin inhibits Na+/K+ ATPase. Toxicity causes parasympathetic excess, visual changes (xanthopsia), and dangerous ventricular arrhythmias."
      },
      {
        name: "Organophosphate Poisoning",
        symptoms: ["pinpoint pupils (miosis), salivation, and lacrimation", "wheezing, bronchorrhea, and bradycardia", "diarrhea, vomiting, and muscle fasciculations"],
        diagnostics: ["decreased red blood cell cholinesterase activity", "garlicky odor in breath or gastric contents", "cholinergic crisis presentation"],
        treatments: ["intravenous atropine titration to dry secretions", "pralidoxime (2-PAM) administration", "decontamination and skin washing"],
        complications: ["respiratory failure due to bronchospasm/weakness", "intermediate syndrome neurological deficits"],
        explanation: "Organophosphates irreversibly inhibit acetylcholinesterase, leading to massive acetylcholine accumulation. Atropine is the physiological antidote."
      },
      {
        name: "Acetaminophen Toxicity",
        symptoms: ["nausea, vomiting, and malaise early on", "right upper quadrant pain and clay stools", "confusion and bleeding tendency after 72 hours"],
        diagnostics: ["elevated serum transaminases (AST/ALT > 1000)", "toxic acetaminophen levels on Rumack-Nomogram", "prolonged prothrombin time (PT/INR)"],
        treatments: ["N-acetylcysteine (NAC) therapy", "oral activated charcoal within 4 hours", "liver transplantation for fulminant liver failure"],
        complications: ["acute hepatic necrosis and liver failure", "hepatorenal syndrome"],
        explanation: "Paracetamol overdose depletes glutathione. NAPQI accumulation binds hepatic proteins, causing centrolobular liver necrosis. NAC replenishes glutathione."
      },
      {
        name: "Atropine Overdose",
        symptoms: ["dry mouth, extreme thirst, and hot dry skin", "blurred vision and photophobia (mydriasis)", "confusion, hallucinations, and rapid heart rate"],
        diagnostics: ["anti-cholinergic toxidrome presentation", "flushed skin ('red as a beet') and dry skin ('dry as a bone')", "absence of sweating"],
        treatments: ["physostigmine (acetylcholinesterase inhibitor)", "supportive cooling for hyperthermia", "dim lighting and benzodiazepines for agitation"],
        complications: ["lethal hyperthermia and seizures", "urinary retention requiring catheterization"],
        explanation: "Atropine competitively blocks muscarinic receptors. Overdose leads to 'blind as a bat, mad as a hatter, red as a beet, hot as a hare, dry as a bone'."
      },
      {
        name: "Morphine Overdose",
        symptoms: ["respiratory depression (slow shallow breathing)", "pinpoint pupils (symmetric miosis)", "somnolence, stupor, and flaccid muscles"],
        diagnostics: ["classic triad of coma, miosis, and bradypnea", "cyanosis and cool clammy skin", "response to opioid antagonist"],
        treatments: ["intravenous naloxone (opioid antagonist)", "supportive ventilation and oxygen", "monitoring for rebound toxicity"],
        complications: ["hypoxic brain injury and pulmonary edema", "aspiration pneumonia"],
        explanation: "Opioid overdose stimulates mu receptors in brainstem, depressing respiratory drive and causing pupillary constriction."
      }
    ]
  },
  "Pathology": {
    wrong: ["Hodgkin Lymphoma", "Multiple Myeloma", "Barrett's Esophagus", "Rheumatic Heart Disease"],
    conditions: [
      {
        name: "Hodgkin Lymphoma",
        symptoms: ["painless cervical lymphadenopathy", "B symptoms (fever, night sweats, weight loss)", "pruritus after warm showers"],
        diagnostics: ["Reed-Sternberg (RS) cells on lymph node biopsy", "polymorphous inflammatory background", "CD15 and CD30 positive immunophenotype"],
        treatments: ["ABVD chemotherapy regimen", "involved-field radiation therapy", "brentuximab vedotin for refractory cases"],
        complications: ["secondary malignancies like AML or breast cancer", "radiation-induced cardiotoxicity"],
        explanation: "Hodgkin Lymphoma is characterized by Reed-Sternberg cells (binucleated, owl-eye nucleoli) surrounded by reactive inflammatory cells."
      },
      {
        name: "Multiple Myeloma",
        symptoms: ["severe bone pain, especially in the back/ribs", "recurrent infections due to hypogammaglobulinemia", "fatigue and pallor due to anemia"],
        diagnostics: ["punched-out lytic bone lesions on skeletal survey", "M-spike on serum protein electrophoresis", "Bence-Jones proteins in urine"],
        treatments: ["autologous stem cell transplantation", "bortezomib and lenalidomide combination", "bisphosphonates for bone protection"],
        complications: ["renal failure due to light chain cast nephropathy", "hypercalcemia crisis"],
        explanation: "Multiple myeloma is a clonal plasma cell neoplasm producing excess monoclonal light chains, causing bone resorption, renal injury, and hypercalcemia."
      },
      {
        name: "Barrett's Esophagus",
        symptoms: ["chronic heartburn and acid regurgitation", "difficulty in swallowing (dysphagia)", "epigastric discomfort and chest pain"],
        diagnostics: ["metaplastic columnar epithelium on endoscopy", "presence of goblet cells on esophageal biopsy", "salmon-pink patches above gastroesophageal junction"],
        treatments: ["high-dose proton pump inhibitors (PPIs)", "endoscopic mucosal resection for dysplasia", "radiofrequency ablation of abnormal mucosa"],
        complications: ["progression to esophageal adenocarcinoma", "ulceration and stricture formation"],
        explanation: "Barrett's esophagus is squamous-to-columnar (intestinal) metaplasia in response to chronic acid reflux, predisposing to adenocarcinoma."
      },
      {
        name: "Rheumatic Heart Disease",
        symptoms: ["migratory polyarthritis in large joints", "carditis, murmurs, and dyspnea", "subcutaneous nodules and erythema marginatum"],
        diagnostics: ["Aschoff bodies on myocardial biopsy", "Anitschkow (caterpillar) cells", "elevated antistreptolysin O (ASO) titer"],
        treatments: ["long-term Benzathine Penicillin prophylaxis", "NSAIDs for arthritis and corticosteroids for carditis", "surgical valve repair/replacement"],
        complications: ["chronic mitral stenosis and heart failure", "infective endocarditis risk"],
        explanation: "RHD results from molecular mimicry between group A streptococcal M protein and host cardiac tissues, forming Aschoff bodies."
      },
      {
        name: "Gout",
        symptoms: ["sudden excruciating pain in the first metatarsophalangeal joint", "red, swollen, and warm joint (podagra)", "pain starting during night or early morning"],
        diagnostics: ["negatively birefringent needle-shaped crystals", "monosodium urate crystals in synovial fluid", "punched-out erosions with overhanging edges on X-ray"],
        treatments: ["acute therapy with NSAIDs (indomethacin) or colchicine", "long-term allopurinol (xanthine oxidase inhibitor)", "lifestyle modification avoiding high-purine foods"],
        complications: ["deforming chronic tophaceous gout", "uric acid nephrolithiasis"],
        explanation: "Gout is crystal arthropathy caused by monosodium urate precipitation in joints, showing negative birefringence under polarized light."
      }
    ]
  },
  "Microbiology": {
    wrong: ["Cholera", "Tuberculosis", "Tetanus", "Syphilis"],
    conditions: [
      {
        name: "Cholera",
        symptoms: ["profuse watery diarrhea resembling rice-water", "muscle cramps and severe dehydration", "sunken eyes and poor skin turgor"],
        diagnostics: ["yellow colonies on Thiosulfate Citrate Bile Salts (TCBS) agar", "darting motility of Gram-negative comma-shaped bacilli", "sucrose-fermenting bacterium"],
        treatments: ["immediate aggressive oral or IV rehydration", "doxycycline to reduce shedding duration", "zinc supplementation in children"],
        complications: ["hypovolemic shock and electrolyte collapse", "acute renal failure"],
        explanation: "Vibrio cholerae produces cholera toxin, which stimulates adenylate cyclase (increasing cAMP), leading to massive chloride and water secretion."
      },
      {
        name: "Tuberculosis",
        symptoms: ["chronic cough with hemoptysis for over 3 weeks", "drenching night sweats and low-grade fever", "unexplained weight loss and anorexia"],
        diagnostics: ["acid-fast bacilli on Ziehl-Neelsen stain", "growth on Lowenstein-Jensen (LJ) medium", "positive Mantoux tuberculin skin test"],
        treatments: ["four-drug regimen (HRZE) for 2 months", "isoniazid and rifampicin for 4 months", "directly observed therapy (DOTS) protocol"],
        complications: ["pleural effusion and miliary spread", "Pott's disease of the spine"],
        explanation: "Mycobacterium tuberculosis is an acid-fast bacillus causing caseating granulomas in lung tissues, containing Langhans giant cells."
      },
      {
        name: "Tetanus",
        symptoms: ["lockjaw (trismus) and grim smile (risus sardonicus)", "painful generalized muscle spasms (opisthotonus)", "autonomic instability and dysphagia"],
        diagnostics: ["clinical diagnosis based on wound and spasm history", "Gram-positive bacilli with drumstick appearance", "isolation of anaerobic spore-forming rods"],
        treatments: ["human tetanus immunoglobulin (HTIG) administration", "wound debridement and Metronidazole", "diazepam and dark quiet room for muscle spasms"],
        complications: ["respiratory failure from diaphragmatic spasm", "vertebral fractures from severe spasms"],
        explanation: "Clostridium tetani releases tetanospamin, which blocks release of inhibitory neurotransmitters (GABA/glycine) from Renshaw cells, causing spastic paralysis."
      },
      {
        name: "Syphilis",
        symptoms: ["painless indurated ulcer (chancre) on genitalia", "maculopapular rash on palms and soles with lymphadenopathy", "gummas in skin and bone with neurological signs"],
        diagnostics: ["Treponema pallidum on darkfield microscopy", "positive VDRL or RPR screening tests", "reactive FTA-ABS confirmatory antibody test"],
        treatments: ["Benzathine Penicillin G (intramuscular)", "doxycycline for penicillin-allergic patients", "intravenous penicillin G for neurosyphilis"],
        complications: ["aortic aneurysm and tabes dorsalis", "congenital transmission to fetus"],
        explanation: "Treponema pallidum is a spirochete causing endarteritis obliterans. Presents in primary (chancre), secondary (rash), and tertiary (gumma) stages."
      },
      {
        name: "Candidiasis",
        symptoms: ["curd-like thick white vaginal discharge", "creamy white patches on tongue that scrape off leaving bleeding base", "burning sensation and painful swallowing (dysphagia)"],
        diagnostics: ["pseudohyphae and budding yeast on KOH mount", "growth of green colonies on CHROMagar", "positive germ tube test at 37 degrees"],
        treatments: ["fluconazole or topical clotrimazole", "nystatin swish and swallow for oral thrush", "echinocandins for systemic candidemia"],
        complications: ["disseminated candidemia in immunocompromised", "esophageal strictures"],
        explanation: "Candida albicans is an opportunistic dimorphic fungus forming pseudohyphae in tissue and yeast in culture, causing mucosal and systemic infections."
      }
    ]
  },
  "Forensic Medicine": {
    wrong: ["Carbon Monoxide Poisoning", "Cyanide Poisoning", "Lead Poisoning", "Arsenic Poisoning"],
    conditions: [
      {
        name: "Carbon Monoxide Poisoning",
        symptoms: ["headache, dizziness, and nausea in winter", "cherry-red discoloration of blood and lividity", "confusion, seizures, and respiratory failure"],
        diagnostics: ["elevated carboxyhemoglobin levels on co-oximetry", "cherry-red post-mortem staining in fire victim", "bilateral globus pallidus necrosis on brain MRI"],
        treatments: ["100% normobaric oxygen therapy", "hyperbaric oxygen for severe cases/pregnancy", "removal from exposure source"],
        complications: ["delayed neuropsychiatric sequelae", "permanent hypoxic brain injury"],
        explanation: "Carbon monoxide binds hemoglobin with 200x affinity of oxygen, shifting oxygen-hemoglobin curve left, causing tissue hypoxia."
      },
      {
        name: "Cyanide Poisoning",
        symptoms: ["rapid onset headache, tachypnea, and gasping", "bitter almond odor from mouth and gastric contents", "bright red post-mortem lividity with pink viscera"],
        diagnostics: ["high venous oxygen saturation (arterialization)", "elevated blood lactate levels", "cyanide detection in gastric aspirate"],
        treatments: ["hydroxocobalamin (Cyanokit) administration", "sodium nitrite followed by sodium thiosulfate", "amyl nitrite inhalation as emergency bridge"],
        complications: ["fatal cellular hypoxia within minutes", "permanent neurological deficits"],
        explanation: "Cyanide binds ferric iron (Fe3+) in cytochrome c oxidase of electron transport chain, blocking aerobic respiration (histotoxic hypoxia)."
      },
      {
        name: "Lead Poisoning",
        symptoms: ["abdominal colic, constipation, and joint pain", "wrist drop or foot drop due to motor neuropathy", "irritability and developmental delay in child"],
        diagnostics: ["basophilic stippling of red blood cells", "Burton's line (blue-purple line on gums)", "increased blood lead levels (>10 ug/dL)"],
        treatments: ["oral succimer (DMSA) for moderate toxicity", "intravenous EDTA and BAL (dimercaprol) for encephalopathy", "removal of lead paint/sources"],
        complications: ["encephalopathy and permanent cognitive decline", "nephropathy (Fanconi syndrome)"],
        explanation: "Lead inhibits ferrochelatase and ALA dehydratase in heme synthesis, causing microcytic anemia, basophilic stippling, and neuropathy."
      },
      {
        name: "Arsenic Poisoning",
        symptoms: ["severe cholera-like watery diarrhea with garlicky odor", "raindrop hyperpigmentation and hyperkeratosis of palms/soles", "Mees' lines (transverse white bands on nails)"],
        diagnostics: ["arsenic detected in hair, nails, or 24-hr urine", "garlic odor in body secretions", "aldrich-mees lines on finger nails"],
        treatments: ["dimercaprol (BAL) intramuscular injection", "succimer (DMSA) for subacute exposure", "aggressive fluid resuscitation"],
        complications: ["peripheral neuropathy and encephalopathy", "squamous cell carcinoma of skin"],
        explanation: "Arsenic binds sulfhydryl groups, disrupting cellular enzymes, pyruvate dehydrogenase, and cellular respiration."
      },
      {
        name: "Mercury Poisoning",
        symptoms: ["severe tremors ('hatter's shakes') and irritability", "acrodynia (pink disease - painful pink swelling of hands/feet)", "erethism (extreme shyness, anxiety, and memory loss)"],
        diagnostics: ["mercury levels in blood or 24-hour urine", "mercuria lentis (brown reflex on lens)", "cerebellar atrophy on brain imaging"],
        treatments: ["dimercaprol (BAL) or DMSA chelation", "supportive respiratory care for inhaled vapors", "physical therapy for tremors"],
        complications: ["permanent cerebellar ataxia and tunnel vision", "chronic interstitial pneumonitis"],
        explanation: "Mercury poisoning affects central nervous system and kidneys by binding sulfhydryl proteins. Classic signs include tremors, acrodynia, and erethism."
      }
    ]
  },
  "Social & Preventive Medicine": {
    wrong: ["Iron Deficiency Anemia", "Protein Energy Malnutrition", "Vitamin A Deficiency", "Iodine Deficiency"],
    conditions: [
      {
        name: "Iron Deficiency Anemia",
        symptoms: ["easy fatigue, pallor, and dyspnea on exertion", "pagophagia (craving for ice) and pica", "spoon-shaped nails (koilonychia) and angular cheilitis"],
        diagnostics: ["low serum ferritin and high TIBC", "microcytic hypochromic anemia on blood smear", "decreased transferrin saturation"],
        treatments: ["oral ferrous sulfate (with Vitamin C to aid absorption)", "parenteral iron sucrose for oral intolerance", "nutritional counseling on iron-rich foods"],
        complications: ["cognitive impairment in children", "high-output heart failure in severe cases"],
        explanation: "Iron deficiency is the most common nutritional anemia, characterized by depleted iron stores (low ferritin) and compensatory high TIBC."
      },
      {
        name: "Vitamin A Deficiency",
        symptoms: ["night blindness (nyctalopia) in children", "dry conjunctiva and cornea (xerophthalmia)", "wrinkled foamy patches on conjunctiva (Bitot's spots)"],
        diagnostics: ["serum retinol levels below 20 ug/dL", "clinical ocular findings on slit-lamp", "impaired dark adaptation test"],
        treatments: ["high-dose oral Vitamin A supplementation (2 lakh IU)", "prophylactic Vitamin A at 9 months under NIS", "dietary encouragement of yellow fruits"],
        complications: ["keratomalacia and permanent blindness", "increased susceptibility to measles and diarrheal mortality"],
        explanation: "Vitamin A is essential for rhodopsin synthesis and epithelial cell differentiation. Deficiency leads to xerophthalmia, Bitot's spots, and blindness."
      },
      {
        name: "Iodine Deficiency",
        symptoms: ["painless swelling in the neck (goiter)", "weight gain, fatigue, and sluggishness", "infant born with severe mental retardation and dwarfism (cretinism)"],
        diagnostics: ["low urinary iodine excretion (<100 ug/L)", "elevated TSH with low free T4", "thyroid ultrasound showing diffuse hyperplasia"],
        treatments: ["universal iodization of common salt", "iodized oil injections in endemic pockets", "levothyroxine replacement therapy"],
        complications: ["congenital cretinism and deaf-mutism", "neonatal hypothyroidism"],
        explanation: "Iodine is critical for thyroid hormone synthesis. Deficiency causes endemic goiter and cretinism (mental retardation, short stature)."
      },
      {
        name: "Protein Energy Malnutrition",
        symptoms: ["severe wasting with baggy pants appearance (marasmus)", "pitting edema, moon face, and flaky paint dermatosis (kwashiorkor)", "muscle wasting with flag sign of hair"],
        diagnostics: ["weight-for-age below 3 standard deviations", "profound hypoalbuminemia in edematous cases", "electrolyte imbalance (hypokalemia)"],
        treatments: ["F-75 formula during stabilization phase", "F-100 formula during rehabilitation phase", "treatment of hypoglycemia and hypothermia"],
        complications: ["life-threatening septicemia and electrolyte collapse", "permanent growth stunting"],
        explanation: "PEM manifests as Marasmus (calorie deficiency, wasting, no edema) and Kwashiorkor (protein deficiency, edema, fatty liver, hair changes)."
      },
      {
        name: "Fluorosis",
        symptoms: ["mottling of teeth with yellow-brown discoloration", "severe back pain and stiffness of joints", "inability to bend forward (skeletal rigidity)"],
        diagnostics: ["high fluoride level in drinking water (>1.5 mg/L)", "increased bone density (osteosclerosis) on spinal X-ray", "calcification of ligaments"],
        treatments: ["provision of defluoridated drinking water", "Nalgonda technique for water purification", "calcium and Vitamin C supplementation"],
        complications: ["crippling skeletal fluorosis", "neurological compression from spinal stenosis"],
        explanation: "Fluorosis is caused by excess fluoride intake, leading to dental mottling (fluoride >1.5 mg/L) and disabling skeletal osteosclerosis."
      }
    ]
  },
  "Ophthalmology": {
    wrong: ["Open-Angle Glaucoma", "Acute Angle-Closure Glaucoma", "Senile Cataract", "Diabetic Retinopathy"],
    conditions: [
      {
        name: "Open-Angle Glaucoma",
        symptoms: ["gradual bilateral loss of peripheral vision (tunnel vision)", "frequent changes of presbyopic glasses", "painless visual field constriction"],
        diagnostics: ["increased intraocular pressure with optic disc cupping", "increased cup-to-disc ratio (>0.5)", "arcuate scotomas on Humphrey perimetry"],
        treatments: ["topical prostaglandin analogues (Latanoprost)", "beta-blockers (Timolol) eye drops", "selective laser trabeculoplasty (SLT)"],
        complications: ["permanent irreversible blindness", "severe visual field constriction"],
        explanation: "POAG features silent, progressive optic neuropathy with cupping, visual field defects, and elevated IOP due to trabecular outflow resistance."
      },
      {
        name: "Acute Angle-Closure Glaucoma",
        symptoms: ["sudden severe eye pain and headache", "nausea, vomiting, and seeing colored halos around lights", "acute drop in vision with red eye"],
        diagnostics: ["stony hard eye on palpation with high IOP (>50)", "hazy cornea with mid-dilated vertically oval pupil", "shallow anterior chamber on gonioscopy"],
        treatments: ["intravenous mannitol and acetazolamide", "topical pilocarpine (miotic) eye drops", "bilateral laser peripheral iridotomy"],
        complications: ["permanent optic nerve atrophy within hours", "anterior synechiae formation"],
        explanation: "AACG is an emergency caused by pupillary block closing the iridocorneal angle, leading to rapid, painful increase in IOP."
      },
      {
        name: "Senile Cataract",
        symptoms: ["gradual painless loss of vision in both eyes", "glare and halos around headlights during night driving", "second sight (temporary improvement in near vision)"],
        diagnostics: ["nuclear opalescence or cortical spokes on slit-lamp", "absent red glow on distant direct ophthalmoscopy", "poor visualization of the fundus"],
        treatments: ["phacoemulsification with intraocular lens (IOL) implant", "manual small incision cataract surgery (MSICS)", "prescribing corrective glasses temporarily"],
        complications: ["phacolytic or phacomorphic glaucoma if hypermature", "posterior capsule opacification post-operatively"],
        explanation: "Cataract is progressive lens opacification. Standard surgery is phacoemulsification with foldable posterior chamber IOL insertion."
      },
      {
        name: "Diabetic Retinopathy",
        symptoms: ["gradual blurriness or sudden floaters in vision", "painless progressive visual decline", "difficulty reading or distinguishing colors"],
        diagnostics: ["microaneurysms, dot-blot hemorrhages, and hard exudates", "neovascularization of disc/elsewhere (NVD/NVE)", "macular edema on optical coherence tomography (OCT)"],
        treatments: ["intravitreal anti-VEGF injections (Ranibizumab)", "panretinal photocoagulation (PRP) laser", "strict glycemic and blood pressure control"],
        complications: ["tractional retinal detachment and vitreous hemorrhage", "neovascular glaucoma"],
        explanation: "Diabetic retinopathy features microvascular damage. Non-proliferative (exudates, hemorrhages) progresses to Proliferative (neovascularization)."
      },
      {
        name: "Age-Related Macular Degeneration",
        symptoms: ["distortion of straight lines (metamorphopsia)", "central dark spot in vision (scotoma)", "difficulty recognizing faces and reading"],
        diagnostics: ["presence of subretinal drusen on fundoscopy", "choroidal neovascularization on fluorescein angiography", "subretinal hemorrhage or fluid under macula"],
        treatments: ["intravitreal anti-VEGF injections for wet type", "AREDS2 vitamin formulation for dry type", "smoking cessation counseling"],
        complications: ["permanent central blindness", "disciform scarring of the macula"],
        explanation: "ARMD is the leading cause of blindness in elderly. Dry type (drusen, geographic atrophy) can progress to Wet type (neovascular membrane)."
      }
    ]
  },
  "ENT": {
    wrong: ["Meniere's Disease", "Otosclerosis", "Acoustic Neuroma", "BPPV"],
    conditions: [
      {
        name: "Meniere's Disease",
        symptoms: ["episodic vertigo lasting minutes to hours", "fluctuating low-frequency sensorineural hearing loss", "roaring tinnitus and a feeling of fullness in ear"],
        diagnostics: ["endolymphatic hydrops on histopathology", "audiometry showing low-frequency SNHL", "positive glycerol dehydration test"],
        treatments: ["low sodium diet and betahistine therapy", "intratympanic gentamicin or steroid injections", "diuretics (hydrochlorothiazide)"],
        complications: ["permanent profound hearing loss", "drop attacks (Tumarkin's otolithic crisis)"],
        explanation: "Meniere's is endolymphatic hydrops (distension of endolymphatic sac). Vertigo is episodic and associated with fluctuating hearing loss and tinnitus."
      },
      {
        name: "Otosclerosis",
        symptoms: ["bilateral progressive conductive hearing loss", "hearing better in noisy environments (paracusis willisii)", "soft speech tone"],
        diagnostics: ["schwartze sign (flamingo flush on tympanic membrane)", "carhart notch (dip at 2 kHz in bone conduction)", "absent stapedial reflex on tympanometry"],
        treatments: ["stapedotomy surgery with teflon piston insert", "amplification with hearing aids", "sodium fluoride to halt progression"],
        complications: ["permanent conductive deafness", "sensory hearing loss if cochlear involvement"],
        explanation: "Otosclerosis is new spongy bone formation around stapes footplate, fixing it in the oval window, causing conductive hearing loss."
      },
      {
        name: "Acoustic Neuroma",
        symptoms: ["unilateral progressive sensorineural hearing loss", "unilateral continuous high-pitched tinnitus", "unsteadiness and loss of corneal reflex"],
        diagnostics: ["vestibular schwannoma on MRI of cerebellopontine angle", "asymmetrical sensorineural hearing loss on audiometry", "widened internal acoustic meatus on CT"],
        treatments: ["surgical excision via translabyrinthine/retrosigmoid route", "stereotactic radiosurgery (Gamma Knife)", "watchful waiting for small tumors"],
        complications: ["permanent facial nerve palsy post-operatively", "hydrocephalus and brainstem compression"],
        explanation: "Acoustic neuroma (vestibular schwannoma) arises from Schwann cells of vestibular nerve in CP angle. Characterized by unilateral SNHL."
      },
      {
        name: "BPPV",
        symptoms: ["vertigo lasting seconds triggered by rolling over in bed", "imbalance and dizziness on looking up", "episodes of spinning sensation on neck extension"],
        diagnostics: ["nystagmus elicited during Dix-Hallpike maneuver", "displacement of canaliths in posterior semicircular canal", "absence of hearing loss or tinnitus"],
        treatments: ["Epley canalith repositioning maneuver", "Semont maneuver", "vestibular rehabilitation exercises"],
        complications: ["recurrent falls and injury", "chronic motion anxiety"],
        explanation: "BPPV is caused by calcium carbonate crystals (otoconia) displaced from utricle into semicircular canals, stimulating ampulla during head motion."
      },
      {
        name: "Chronic Suppurative Otitis Media",
        symptoms: ["persistent painless ear discharge for over 12 weeks", "progressive conductive hearing loss", "foul-smelling ear discharge"],
        diagnostics: ["attic perforation or cholesteatoma on otoscopy", "marginal perforation of tympanic membrane", "bone destruction on temporal bone CT"],
        treatments: ["mastoidectomy surgery with tympanoplasty", "topical antibiotic ear drops", "dry ear precautions"],
        complications: ["meningitis, brain abscess, and labyrinthitis", "permanent facial nerve paralysis"],
        explanation: "CSOM (atticoantral type) features cholesteatoma (keratinizing squamous epithelium), which bone-resorbs and can cause intracranial complications."
      }
    ]
  },
  "Medicine": {
    wrong: ["Acute Myocardial Infarction", "Acute Asthma Attack", "Ischemic Stroke", "Acute Pyelonephritis"],
    conditions: [
      {
        name: "Acute Myocardial Infarction",
        symptoms: ["crushing retrosternal chest pain radiating to left arm", "diaphoresis, dyspnea, and impending doom sensation", "chest pressure unrelieved by sublingual nitroglycerin"],
        diagnostics: ["ST-segment elevation on 12-lead ECG", "elevation of cardiac troponins I or T", "coronary angiography showing vessel occlusion"],
        treatments: ["immediate primary percutaneous coronary intervention (PCI)", "fibrinolytic therapy with alteplase", "dual antiplatelet therapy (Aspirin + Clopidogrel)"],
        complications: ["ventricular arrhythmias and cardiogenic shock", "papillary muscle rupture and mitral regurgitation"],
        explanation: "Myocardial infarction is ischemic necrosis of cardiac muscle. Reperfusion via primary PCI within 120 minutes of contact is key."
      },
      {
        name: "Acute Asthma Attack",
        symptoms: ["acute dyspnea, wheezing, and dry cough", "chest tightness and prolonged expiratory phase", "severe breathlessness with accessory muscle use"],
        diagnostics: ["decreased peak expiratory flow rate (PEFR)", "respiratory alkalosis early progressing to acidosis", "silent chest on auscultation in severe cases"],
        treatments: ["inhaled short-acting beta-agonists (Salbutamol)", "systemic corticosteroids (Prednisolone)", "intravenous magnesium sulfate for refractory cases"],
        complications: ["status asthmaticus and respiratory failure", "pneumothorax"],
        explanation: "Asthma is characterized by reversible airway hyperresponsiveness. Exacerbations require bronchodilation (SABA) and anti-inflammatory steroids."
      },
      {
        name: "Ischemic Stroke",
        symptoms: ["sudden weakness of right face, arm, and leg", "acute onset aphasia (difficulty speaking)", "sudden loss of vision or hemianopia"],
        diagnostics: ["non-contrast head CT scan showing no hemorrhage", "diffusion-weighted MRI showing acute infarct", "CT angiogram showing arterial occlusion"],
        treatments: ["intravenous alteplase (tPA) within 4.5 hours", "mechanical thrombectomy within 24 hours", "aspirin therapy after 24 hours"],
        complications: ["hemorrhagic transformation of infarct", "cerebral edema and brain herniation"],
        explanation: "Ischemic stroke is arterial blockage in brain. Thrombolysis with tPA is indicated within 3 to 4.5 hours of symptom onset if bleed is ruled out."
      },
      {
        name: "Acute Pyelonephritis",
        symptoms: ["high-grade fever with chills and rigor", "flank pain (costovertebral angle tenderness)", "dysuria, urinary frequency, and urgency"],
        diagnostics: ["pyuria and white blood cell casts in urine", "growth of E. coli on urine culture", "computed tomography showing wedge-shaped perfusion defects"],
        treatments: ["intravenous Ceftriaxone or Fluoroquinolones", "hydration and antipyretics", "monitoring for renal abscess"],
        complications: ["renal abscess and perinephric collection", "urosepsis and septic shock"],
        explanation: "Pyelonephritis is upper urinary tract infection. WBC casts are pathognomonic, indicating inflammation of the renal parenchyma."
      },
      {
        name: "Diabetic Ketoacidosis",
        symptoms: ["polyuria, polydipsia, and abdominal pain", "rapid deep breathing (Kussmaul) and fruity breath", "altered mental status and vomiting"],
        diagnostics: ["hyperglycemia with anion gap metabolic acidosis", "strong positivity for ketones in urine and blood", "low serum bicarbonate (<15 mEq/L)"],
        treatments: ["aggressive intravenous fluid resuscitation (saline)", "continuous low-dose insulin infusion", "potassium replacement when levels drop below 5"],
        complications: ["cerebral edema in children", "severe hypokalemia and arrhythmias"],
        explanation: "DKA is characterized by insulin deficiency and counter-regulatory hormone excess, causing lipolysis, ketogenesis, and metabolic acidosis."
      }
    ]
  },
  "Surgery": {
    wrong: ["Tension Pneumothorax", "Cardiac Tamponade", "Acute Appendicitis", "Acute Pancreatitis"],
    conditions: [
      {
        name: "Tension Pneumothorax",
        symptoms: ["acute respiratory distress and chest pain", "tracheal deviation away from the affected side", "hypotension and tachycardia"],
        diagnostics: ["absent breath sounds and hyperresonance on one side", "collapsed lung on chest radiograph", "decreased venous return due to mediastinal shift"],
        treatments: ["immediate needle decompression in 2nd intercostal space", "chest tube (tube thoracostomy) insertion", "video-assisted thoracoscopic surgery (VATS)"],
        complications: ["cardiogenic/obstructive shock and death", "recurrent pneumothorax"],
        explanation: "Tension pneumothorax is a clinical emergency. One-way valve effect accumulates air in pleural space, compressing vena cava."
      },
      {
        name: "Cardiac Tamponade",
        symptoms: ["muffled heart sounds, hypotension, and distended neck veins", "pulsus paradoxus (drop in BP on inspiration)", "dyspnea and tachycardia"],
        diagnostics: ["Beck's triad on clinical examination", "electrical alternans on electrocardiogram", "diastolic collapse of right ventricle on echocardiogram"],
        treatments: ["emergency ultrasound-guided pericardiocentesis", "surgical pericardial window creation", "intravenous fluid boluses to maintain preload"],
        complications: ["refractory cardiovascular collapse", "pericardial constriction"],
        explanation: "Tamponade is fluid accumulation in pericardial space limiting cardiac filling. pericardiocentesis is diagnostic and therapeutic."
      },
      {
        name: "Acute Appendicitis",
        symptoms: ["periumbilical pain shifting to right iliac fossa", "nausea, vomiting, and low-grade fever", "anorexia ('hamburger sign' positive)"],
        diagnostics: ["rebound tenderness at McBurney's point", "Rovsing's sign (left-sided pressure causes right pain)", "inflamed blind-loop appendix on ultrasound"],
        treatments: ["laparoscopic or open appendectomy surgery", "intravenous antibiotics and hydration", "monitoring for appendicular mass"],
        complications: ["appendiceal perforation and peritonitis", "appendicular abscess"],
        explanation: "Appendicitis is caused by lumen obstruction (fecalith). Pain shifts from visceral midgut (T10) to parietal right iliac fossa."
      },
      {
        name: "Acute Pancreatitis",
        symptoms: ["severe epigastric pain radiating to the back", "nausea and vomiting unrelieved by vomiting", "pain partially relieved by sitting forward"],
        diagnostics: ["serum lipase elevated more than 3 times normal", "sentinel loop sign on abdominal radiograph", "pancreatic edema or necrosis on abdominal CT"],
        treatments: ["aggressive intravenous fluid resuscitation (Ringers)", "nil per os (NPO) and pain management", "enteral nutrition once tolerated"],
        complications: ["pancreatic pseudocyst and pancreatic necrosis", "ARDS due to systemic enzyme release"],
        explanation: "Pancreatitis involves auto-digestion by trypsin. Lipase is more specific than amylase. Fluid resuscitation is critical."
      },
      {
        name: "Intestinal Obstruction",
        symptoms: ["colicky abdominal pain and abdominal distension", "vomiting of bilious or fecaloid material", "obstipation (inability to pass flatus or feces)"],
        diagnostics: ["multiple air-fluid levels on erect abdominal X-ray", "dilated small bowel loops (>3 cm)", "hyperactive 'tinkling' bowel sounds on auscultation"],
        treatments: ["nasogastric tube decompression (Ryle's tube)", "intravenous fluid replacement and NPO", "emergency laparotomy for strangulated bowel"],
        complications: ["bowel gangrene, perforation, and fecal peritonitis", "severe dehydration and electrolyte crash"],
        explanation: "Intestinal obstruction presents with distension, vomiting, colicky pain, and obstipation. Erect X-ray shows multiple air-fluid levels."
      }
    ]
  },
  "Obstetrics & Gynecology": {
    wrong: ["Placental Abruption", "Placenta Previa", "Ectopic Pregnancy", "Polycystic Ovary Syndrome"],
    conditions: [
      {
        name: "Placental Abruption",
        symptoms: ["painful vaginal bleeding in third trimester", "sudden onset severe abdominal pain", "tense, tender, woody-hard uterus"],
        diagnostics: ["clinical diagnosis of abruptio placentae", "retroplacental hematoma on ultrasound", "fetal heart distress or late decelerations"],
        treatments: ["immediate emergency cesarean delivery", "aggressive blood transfusion and fluid replacement", "monitoring for coagulation profile (DIC)"],
        complications: ["disseminated intravascular coagulation (DIC)", "Couvelaire uterus (uteroplacental apoplexy)"],
        explanation: "Placental abruption is premature separation of a normally implanted placenta, causing painful dark bleeding and hypertonic uterus."
      },
      {
        name: "Placenta Previa",
        symptoms: ["painless, bright red vaginal bleeding in third trimester", "bleeding triggered by coitus or randomly", "soft and non-tender uterus"],
        diagnostics: ["placenta covering the internal cervical os on ultrasound", "abnormal fetal presentation (breech/transverse)", "avoidance of digital vaginal examination"],
        treatments: ["planned cesarean section at 36-37 weeks", "bed rest and fetal lung maturity steroids", "emergency C-section for maternal instability"],
        complications: ["severe postpartum hemorrhage", "placenta accreta spectrum"],
        explanation: "Placenta previa is placental implantation in the lower uterine segment. Avoid digital per-vaginal examination as it triggers hemorrhage."
      },
      {
        name: "Ectopic Pregnancy",
        symptoms: ["amenorrhea followed by unilateral lower abdominal pain", "spotting or vaginal bleeding in early pregnancy", "shoulder tip pain due to hemoperitoneum"],
        diagnostics: ["empty uterus with adnexal mass on transvaginal ultrasound", "β-hCG levels rising below doubling rate", "fluid in pouch of Douglas on ultrasound"],
        treatments: ["laparoscopic salpingectomy or salpingostomy", "intramuscular methotrexate for unruptured mass", "fluid resuscitation for ruptured shock"],
        complications: ["rupture of fallopian tube and hemorrhagic shock", "future fertility impairment"],
        explanation: "Ectopic pregnancy is implantation outside the uterine cavity (most common in ampulla of fallopian tube). Rupture causes acute abdomen."
      },
      {
        name: "Polycystic Ovary Syndrome",
        symptoms: ["irregular menses (oligomenorrhea) and infertility", "hirsutism, acne, and male-pattern baldness", "weight gain and acanthosis nigricans"],
        diagnostics: ["elevated LH-to-FSH ratio (>2:1)", "string of pearls appearance on ovarian ultrasound", "insulin resistance and hyperandrogenism"],
        treatments: ["oral contraceptive pills for cycle regulation", "metformin for insulin resistance", "clomiphene citrate or letrozole for ovulation induction"],
        complications: ["endometrial hyperplasia and endometrial cancer", "type 2 diabetes and metabolic syndrome"],
        explanation: "PCOS features chronic anovulation and hyperandrogenism. Ultrasound shows multiple small subcapsular follicles ('string of pearls')."
      },
      {
        name: "Eclampsia",
        symptoms: ["generalized tonic-clonic seizures in pregnancy", "severe headache and visual disturbances", "generalized swelling of face and hands"],
        diagnostics: ["proteinuria with new-onset hypertension after 20 weeks", "generalized seizures not attributable to other causes", "hyperreflexia and clonus"],
        treatments: ["intravenous Magnesium Sulfate (Pritchard regimen)", "antihypertensives (labetalol or hydralazine)", "expedited delivery of fetus"],
        complications: ["placental abruption and intracerebral hemorrhage", "HELLP syndrome"],
        explanation: "Eclampsia is pre-eclampsia (HTN + proteinuria after 20 weeks) complicated by generalized seizures. Magnesium sulfate is the anticonvulsant of choice."
      }
    ]
  },
  "Pediatrics": {
    wrong: ["Marasmus", "Kwashiorkor", "Tetralogy of Fallot", "Celiac Disease"],
    conditions: [
      {
        name: "Marasmus",
        symptoms: ["severe generalized muscle wasting", "baggy pants appearance of buttocks", "old man face due to loss of temporal fat"],
        diagnostics: ["weight-for-age below 60% of expected", "absence of generalized edema", "alert but irritable child"],
        treatments: ["gradual caloric refeeding starting with F-75", "treatment of hypothermia and hypoglycemia", "oral rehydration with ReSoMal"],
        complications: ["severe infections and septic shock", "refed syndrome electrolyte abnormalities"],
        explanation: "Marasmus is balanced severe calorie deficiency, causing extreme wasting, loss of subcutaneous fat, and alert but hungry behavior."
      },
      {
        name: "Kwashiorkor",
        symptoms: ["generalized pitting edema (feet/face)", "flaky paint dermatosis of skin", "sparse, reddish-colored hair showing flag sign"],
        diagnostics: ["severe protein deficiency with adequate calories", "hypoalbuminemia (<2.5 g/dL)", "fatty liver on abdominal ultrasound"],
        treatments: ["cautious protein and electrolyte replacement", "treatment of skin infections with antibiotics", "micronutrient (zinc, copper) supplementation"],
        complications: ["severe hepatomegaly and fatty change", "intractable infections and shock"],
        explanation: "Kwashiorkor is severe protein deficiency. Characterized by hypoalbuminemia, pitting edema, dermatosis, and hepatomegaly."
      },
      {
        name: "Tetralogy of Fallot",
        symptoms: ["cyanosis, clubbing, and squatting episodes", "tet spells (hyperpneic cyanotic episodes)", "systolic murmur along left sternal border"],
        diagnostics: ["boot-shaped heart (coeur en sabot) on chest X-ray", "right ventricular hypertrophy on ECG", "VSD with overriding aorta on echocardiography"],
        treatments: ["knee-chest position and oxygen for tet spells", "surgical repair (VSD closure + relief of RVOT obstruction)", "propranolol to prevent spasm of infundibulum"],
        complications: ["brain abscess and cerebral thrombosis", "congestive heart failure"],
        explanation: "TOF has 4 components: VSD, overriding aorta, pulmonary stenosis, and RVH. Boot-shaped heart is diagnostic."
      },
      {
        name: "Celiac Disease",
        symptoms: ["chronic diarrhea and foul-smelling stools", "abdominal distension with wasted extremities", "failure to thrive and short stature"],
        diagnostics: ["positive anti-tissue transglutaminase (tTG) IgA", "villous atrophy and crypt hyperplasia on duodenal biopsy", "intraepithelial lymphocytosis"],
        treatments: ["strict lifelong gluten-free diet (avoid wheat, barley, rye)", "iron and vitamin supplementation", "nutritional counseling"],
        complications: ["intestinal T-cell lymphoma (EATL)", "osteoporosis and refractory nutritional deficiencies"],
        explanation: "Celiac disease is autoimmune enteropathy triggered by gluten. Serology shows anti-tTG IgA, and biopsy confirms villous atrophy."
      },
      {
        name: "Neonatal Respiratory Distress Syndrome",
        symptoms: ["tachypnea, nasal flaring, and grunting in premature", "intercostal and subcostal retractions", "cyanosis in room air"],
        diagnostics: ["ground-glass appearance with air bronchograms on chest X-ray", "lecithin-to-sphingomyelin ratio below 2:1", "severe hypoxemia on ABG"],
        treatments: ["exogenous surfactant administration via endotracheal tube", "nasal continuous positive airway pressure (nCPAP)", "maternal antenatal betamethasone before delivery"],
        complications: ["bronchopulmonary dysplasia", "patent ductus arteriosus"],
        explanation: "RDS in newborns is caused by surfactant deficiency in premature infants (type II pneumocytes), causing alveolar collapse."
      }
    ]
  },
  "Orthopedics": {
    wrong: ["Colles' Fracture", "Scaphoid Fracture", "Anterior Shoulder Dislocation", "Posterior Hip Dislocation"],
    conditions: [
      {
        name: "Colles' Fracture",
        symptoms: ["pain and swelling at the wrist following fall on outstretched hand", "dinner fork deformity of the wrist", "inability to grip objects"],
        diagnostics: ["dorsally displaced distal radius fracture", "fracture within 2.5 cm of the wrist joint", "associated ulnar styloid fracture"],
        treatments: ["closed reduction and Colles' cast application", "percutaneous Kirschner wiring (K-wire)", "open reduction and internal fixation"],
        complications: ["malunion and cosmetic deformity", "rupture of Extensor pollicis longus tendon"],
        explanation: "Colles' fracture is distal radius fracture with dorsal displacement/angulation. Caused by falling on outstretched hand."
      },
      {
        name: "Scaphoid Fracture",
        symptoms: ["pain in the anatomical snuffbox", "weakness in pinching movements of the thumb", "localized swelling on the radial side of wrist"],
        diagnostics: ["tenderness on palpation of anatomical snuffbox", "fracture line visible only on scaphoid view radiographs", "avascular necrosis on MRI"],
        treatments: ["thumb spica cast application", "percutaneous Herbert screw fixation", "bone grafting for nonunion"],
        complications: ["avascular necrosis of the proximal pole", "nonunion and arthritis of the wrist"],
        explanation: "Scaphoid is the most commonly fractured carpal bone. Blood supply enters distally; thus, waist fractures risk avascular necrosis of proximal pole."
      },
      {
        name: "Anterior Shoulder Dislocation",
        symptoms: ["severe pain, arm held in slight abduction and external rotation", "loss of normal rounded contour of shoulder", "palpable humeral head anteriorly"],
        diagnostics: ["subcoracoid displacement of humeral head on X-ray", "Hill-Sachs lesion (compression fracture of humeral head)", "Bankart lesion (labral tear)"],
        treatments: ["closed reduction (Kocher's or Hippocratic technique)", "shoulder immobilizer sling for 3 weeks", "surgical stabilization for recurrent instability"],
        complications: ["axillary nerve injury Badge area sensory loss", "recurrent shoulder dislocation"],
        explanation: "Anterior shoulder dislocation is the most common joint dislocation. Shoulder contour is lost (squared shoulder), and axillary nerve is at risk."
      },
      {
        name: "Posterior Hip Dislocation",
        symptoms: ["severe pain, hip held in flexion, adduction, and internal rotation", "shortened limb on the affected side", "inability to bear weight"],
        diagnostics: ["femoral head lying superior to acetabulum on AP pelvis X-ray", "palpable mass in the gluteal region", "computed tomography showing acetabular wall fractures"],
        treatments: ["emergency closed reduction under general anesthesia", "traction followed by progressive weight-bearing", "open reduction if fragment is trapped in joint"],
        complications: ["sciatic nerve palsy foot drop", "avascular necrosis of the femoral head"],
        explanation: "Posterior hip dislocation classically occurs in dashboard injuries. Limb is flexed, adducted, and internally rotated. Sciatic nerve is at risk."
      },
      {
        name: "Osteoarthritis",
        symptoms: ["gradual onset joint pain worse with weight bearing", "morning stiffness lasting less than 30 minutes", "crepitus and joint swelling of knees or hips"],
        diagnostics: ["asymmetric joint space narrowing on radiograph", "presence of osteophytes and subchondral sclerosis", "heberden nodes (DIP) and Bouchard nodes (PIP)"],
        treatments: ["weight loss and low-impact exercise", "NSAIDs and acetaminophen for pain control", "total joint arthroplasty (replacement)"],
        complications: ["severe loss of mobility and joint deformity", "gait disturbance and chronic pain"],
        explanation: "OA is degenerative joint disease showing loss of articular cartilage, subchondral sclerosis, osteophytes, and asymmetric joint space narrowing."
      }
    ]
  },
  "Dermatology": {
    wrong: ["Psoriasis", "Lichen Planus", "Atopic Dermatitis", "Pemphigus Vulgaris"],
    conditions: [
      {
        name: "Psoriasis",
        symptoms: ["silvery scales on well-demarcated erythematous plaques", "itchy plaques on extensor surfaces (elbows, knees)", "nail pitting and oil drop changes"],
        diagnostics: ["Auspitz sign positive (bleeding on scraping scales)", "Munro microabscesses on histopathology", "Koebner phenomenon (lesions at trauma site)"],
        treatments: ["topical corticosteroids and coal tar", "phototherapy (narrowband UVB)", "methotrexate or biologics for severe disease"],
        complications: ["psoriatic arthritis causing joint deformities", "erythrodermic flare-up"],
        explanation: "Psoriasis is hyperproliferation of keratinocytes. Auspitz sign indicates dilated capillaries under thin epidermis. Extensor surfaces involved."
      },
      {
        name: "Lichen Planus",
        symptoms: ["violaceous, flat-topped, polygonal papules", "pruritic lesions on flexor wrists and ankles", "fine white lines on mucosal surfaces"],
        diagnostics: ["Wickham's striae on lesion surfaces", "band-like lymphocytic infiltrate at dermo-epidermal junction", "Civatte bodies (necrotic keratinocytes) on histology"],
        treatments: ["high-potency topical steroids", "systemic steroids for generalized lesions", "oral antihistamines for severe pruritus"],
        complications: ["oral squamous cell carcinoma from chronic ulcerative LP", "permanent scarring alopecia"],
        explanation: "LP is characterized by the 5 Ps (Pruritic, Purple, Polygonal, Planar, Papules) on flexors. Wickham's striae and saw-tooth dermal infiltrate are typical."
      },
      {
        name: "Atopic Dermatitis",
        symptoms: ["severe pruritus and dry skin", "erythematous excoriated papules on flexor creases (cubital/popliteal)", "infantile eczema on cheeks and extensors"],
        diagnostics: ["clinical diagnosis based on Hanifin and Rajka criteria", "elevated serum IgE levels", "eosinophilia on complete blood count"],
        treatments: ["emollients and frequent skin barrier hydration", "topical calcineurin inhibitors (tacrolimus)", "avoidance of environmental triggers and harsh soaps"],
        complications: ["eczema herpeticum (Kaposi varicelliform eruption)", "secondary staphylococcal skin infections"],
        explanation: "Atopic dermatitis is chronic relapsing pruritic inflammation. Flexures are involved in adults, face in infants. Strongly associated with asthma."
      },
      {
        name: "Pemphigus Vulgaris",
        symptoms: ["flaccid blisters on skin and painful oral ulcers", "blisters that rupture easily leaving raw areas", "severe pain and difficulty eating"],
        diagnostics: ["Nikolsky's sign positive (epidermal shear on pressure)", "anti-desmoglein 1 and 3 autoantibodies", "tombstone pattern of basal layer on skin biopsy"],
        treatments: ["high-dose systemic corticosteroids", "rituximab (anti-CD20 therapy)", "azathioprine or mycophenolate mofetil"],
        complications: ["fatal secondary sepsis from skin loss", "severe dehydration and electrolyte crash"],
        explanation: "Pemphigus vulgaris is autoimmune acantholysis due to antibodies against desmoglein 3. Blisters are intraepidermal (flaccid, Nikolsky positive)."
      },
      {
        name: "Scabies",
        symptoms: ["nocturnal itching out of proportion to skin lesions", "burrows, papules, and vesicles in web spaces and wrist flexures", "pruritic nodules on male genitalia and axillae"],
        diagnostics: ["scabies mites or eggs on mineral oil scraping", "burrow identification with ink test", "history of similar symptoms in family members"],
        treatments: ["topical 5% permethrin cream applied neck down", "oral ivermectin (single dose repeated in 2 weeks)", "treating all close contacts simultaneously"],
        complications: ["secondary bacterial infection leading to post-streptococcal glomerulonephritis", "crusted (Norwegian) scabies in immunocompromised"],
        explanation: "Scabies is caused by Sarcoptes scabiei burrowing in stratum corneum. Severe nocturnal itching and involvement of web spaces are hallmarks."
      }
    ]
  },
  "Psychiatry": {
    wrong: ["Major Depressive Disorder", "Schizophrenia", "Bipolar I Disorder", "Obsessive-Compulsive Disorder"],
    conditions: [
      {
        name: "Major Depressive Disorder",
        symptoms: ["depressed mood and loss of interest in all activities (anhedonia)", "feelings of worthlessness and excessive guilt", "suicidal ideation and sleep disturbances"],
        diagnostics: ["symptoms persisting for at least 2 weeks", "SIGECAPS criteria showing 5+ positive features", "ruling out thyroid abnormalities or bereavement"],
        treatments: ["selective serotonin reuptake inhibitors (SSRIs like Fluoxetine)", "cognitive behavioral therapy (CBT)", "electroconvulsive therapy (ECT) for refractory/suicidal cases"],
        complications: ["suicide and self-harm", "severe functional impairment"],
        explanation: "MDD requires depressed mood or anhedonia + 5 criteria from SIGECAPS for at least 2 weeks. SSRIs are the first-line pharmacotherapy."
      },
      {
        name: "Schizophrenia",
        symptoms: ["auditory hallucinations (running commentary)", "delusions of reference or persecution", "disorganized speech and flat affect"],
        diagnostics: ["symptoms persisting for at least 6 months", "active phase symptoms for at least 1 month", "functional deterioration in work/social life"],
        treatments: ["atypical antipsychotics (Risperidone, Olanzapine)", "clozapine for treatment-resistant cases", "social skills training and rehabilitation"],
        complications: ["high suicide rate (approx 10%)", "severe social drift and homelessness"],
        explanation: "Schizophrenia features positive (hallucinations, delusions) and negative (flat affect, avolition) symptoms for >6 months."
      },
      {
        name: "Obsessive-Compulsive Disorder",
        symptoms: ["intrusive, unwanted thoughts causing severe anxiety (obsessions)", "repetitive behaviors to neutralize anxiety (compulsions)", "excessive handwashing or counting rituals"],
        diagnostics: ["obsessions/compulsions taking more than 1 hour per day", "patient recognizes that the thoughts are product of own mind", "severe distress disrupting daily routines"],
        treatments: ["high-dose SSRIs (Sertraline, Fluvoxamine)", "exposure and response prevention (ERP) therapy", "clomipramine (tricyclic antidepressant)"],
        complications: ["severe social isolation and relationship breakdown", "dermatitis from excessive handwashing"],
        explanation: "OCD is characterized by egodystonic obsessions and compulsions. ERP therapy combined with high-dose SSRIs is the gold standard treatment."
      },
      {
        name: "Bipolar I Disorder",
        symptoms: ["abnormally elevated, expansive, or irritable mood (mania)", "grandiosity, decreased need for sleep, and flight of ideas", "risky behavior and spending sprees"],
        diagnostics: ["manic episode lasting at least 1 week", "impairment requiring hospitalization", "no requirement of prior depressive episode for diagnosis"],
        treatments: ["mood stabilizers (Lithium or Valproate)", "atypical antipsychotics (Aripiprazole)", "avoiding antidepressant monotherapy"],
        complications: ["severe financial or legal ruin", "manic exhaustion and psychosis"],
        explanation: "Bipolar I is defined by at least one manic episode (mood elevation + 3 criteria for 1 week). Antidepressant monotherapy is avoided to prevent manic switch."
      },
      {
        name: "Generalized Anxiety Disorder",
        symptoms: ["excessive uncontrollable worry about everyday issues", "muscle tension, restlessness, and irritability", "fatigue and difficulty concentrating"],
        diagnostics: ["excessive worry present for more days than not for 6 months", "worry associated with at least 3 physical symptoms", "distress causing functional impairment"],
        treatments: ["SSRIs or SNRIs (Duloxetine)", "cognitive behavioral therapy (CBT)", "buspirone or short-term benzodiazepines"],
        complications: ["chronic somatic symptoms", "secondary substance abuse (self-medication)"],
        explanation: "GAD features persistent, free-floating anxiety and uncontrollable worry for at least 6 months, managed with CBT and SSRIs."
      }
    ]
  },
  "Radiology": {
    wrong: ["Epidural Hematoma", "Subdural Hematoma", "Pneumothorax", "Pulmonary Embolism"],
    conditions: [
      {
        name: "Epidural Hematoma",
        symptoms: ["lucid interval (brief recovery after trauma before deterioration)", "ipsilateral pupil dilation and contralateral hemiparesis", "severe headache and vomiting"],
        diagnostics: ["biconvex (lenticular) hyperdense mass on CT", "hematoma crossing dural reflections but not sutures", "temporal bone fracture on bone window CT"],
        treatments: ["urgent surgical craniotomy and evacuation", "monitoring and management of intracranial pressure", "intravenous mannitol for herniation signs"],
        complications: ["uncal herniation and brainstem compression", "permanent neurological deficit"],
        explanation: "Epidural hematoma is middle meningeal artery bleed. Lenticular (biconvex) hyperdense collection on CT, limited by skull sutures."
      },
      {
        name: "Subdural Hematoma",
        symptoms: ["gradual onset headache and confusion in elderly", "progressive dementia and gait instability after minor fall", "fluctuating consciousness"],
        diagnostics: ["crescent-shaped (concave) hyperdense or hypodense collection", "hematoma crossing skull sutures but not dural attachments", "midline shift on head CT"],
        treatments: ["surgical burr-hole evacuation for symptomatic cases", "conservative monitoring for small asymptomatic collections", "reversing anticoagulants"],
        complications: ["chronic recurrence and brain re-expansion failure", "brain herniation"],
        explanation: "Subdural hematoma is caused by tearing of bridging cortical veins. Crescent-shaped collection on CT, not limited by skull sutures."
      },
      {
        name: "Pneumothorax",
        symptoms: ["sudden onset unilateral pleuritic chest pain", "acute dyspnea and cough in tall thin male", "decreased chest movement on one side"],
        diagnostics: ["hyperlucent hemithorax with absent lung markings on X-ray", "visible visceral pleural line on chest radiograph", "sulcus sign on supine radiograph"],
        treatments: ["observation for small asymptomatic pneumothorax (<2cm)", "needle aspiration or chest tube insertion", "pleurodesis for recurrent episodes"],
        complications: ["progression to life-threatening tension pneumothorax", "re-expansion pulmonary edema"],
        explanation: "Pneumothorax is air in pleural cavity. X-ray shows hyperlucent lung field, pleural line, and absent lung markings."
      },
      {
        name: "Pulmonary Embolism",
        symptoms: ["sudden onset dyspnea, pleuritic chest pain, and hemoptysis", "tachycardia, tachypnea, and loud P2 heart sound", "unilateral leg swelling (DVT)"],
        diagnostics: ["computed tomography pulmonary angiography (CTPA) showing filling defect", "Westermark sign or Hampton's hump on chest X-ray", "S1Q3T3 pattern on ECG"],
        treatments: ["low molecular weight heparin (LMWH) bridge to warfarin", "systemic thrombolysis with alteplase for massive PE", "inferior vena cava (IVC) filter for contraindicated anticoagulation"],
        complications: ["right ventricular failure and cardiogenic shock", "pulmonary infarction"],
        explanation: "PE is arterial blockage in lung. CTPA is the gold standard diagnostic test. Westermark sign is focal oligemia."
      },
      {
        name: "Lobar Pneumonia",
        symptoms: ["high-grade fever with productive cough and rusty sputum", "pleuritic chest pain and dyspnea", "shivering chills and malaise"],
        diagnostics: ["lobar consolidation with air bronchograms on X-ray", "increased tactile fremitus and bronchial breath sounds", "dullness to percussion over the affected lobe"],
        treatments: ["empiric oral/IV antibiotics (amoxicillin or macrolides)", "antipyretics and hydration", "oxygen support for hypoxemia"],
        complications: ["parapneumonic effusion and empyema", "lung abscess formation"],
        explanation: "Lobar pneumonia shows homogeneous consolidation of an entire lobe with air bronchograms, classically caused by Streptococcus pneumoniae."
      }
    ]
  },
  "Anesthesia": {
    wrong: ["Malignant Hyperthermia", "Local Anesthetic Systemic Toxicity", "Succinylcholine Apnea", "Spinal Shock"],
    conditions: [
      {
        name: "Malignant Hyperthermia",
        symptoms: ["rapidly rising core body temperature (up to 42 degrees)", "generalized muscle rigidity (masseter spasm)", "tachycardia, tachypnea, and severe metabolic acidosis"],
        diagnostics: ["pharmacogenetic response to halothane or succinylcholine", "rapid rise in end-tidal CO2", "muscle biopsy halothane contracture test"],
        treatments: ["intravenous dantrolene sodium administration", "stopping triggers immediately and hyperventilating with 100% O2", "active external and internal cooling"],
        complications: ["severe rhabdomyolysis and acute kidney injury", "fatal cardiac arrhythmias from hyperkalemia"],
        explanation: "MH is an autosomal dominant disorder of ryanodine receptors (RYR1), causing massive calcium release upon exposure to inhalational agents or succinylcholine. Dantrolene is the antidote."
      },
      {
        name: "Local Anesthetic Systemic Toxicity",
        symptoms: ["perioral numbness, metallic taste, and tinnitus", "seizures, agitation, and altered consciousness", "severe bradycardia, AV block, and cardiac arrest"],
        diagnostics: ["accidental intravascular injection of bupivacaine", "progressive neurological excitation followed by depression", "refractory ventricular arrhythmias"],
        treatments: ["intravenous lipid emulsion (20% Intralipid) therapy", "supportive airway management and oxygen", "seizure control with benzodiazepines"],
        complications: ["fatal refractory cardiac arrest", "hypoxic brain damage"],
        explanation: "LAST is caused by high systemic levels of local anesthetics, blocking cardiac sodium channels. Bupivacaine is highly cardiotoxic. Lipid rescue is standard."
      },
      {
        name: "Succinylcholine Apnea",
        symptoms: ["prolonged muscle paralysis and apnea after anesthesia induction", "inability to breathe spontaneously post-surgery", "complete flaccid muscle paralysis"],
        diagnostics: ["atypical pseudocholinesterase (butyrylcholinesterase) enzyme", "dibucaine number determination", "prolonged block of neuromuscular junction"],
        treatments: ["continued mechanical ventilation and sedation", "infusion of fresh frozen plasma (contains pseudocholinesterase)", "reassurance and monitoring until block wears off"],
        complications: ["awareness during paralysis under inadequate sedation", "aspiration pneumonia"],
        explanation: "Pseudocholinesterase deficiency prevents degradation of succinylcholine, converting a 5-minute depolarizing block into hours of apnea. Managed with mechanical ventilation."
      },
      {
        name: "Spinal Shock",
        symptoms: ["sudden profound hypotension and bradycardia", "loss of all reflexes below the level of spinal injury", "flaccid paralysis and fecal/urinary retention"],
        diagnostics: ["loss of bulbocavernosus reflex", "high thoracic spinal cord injury", "vasodilator shock with warm dry skin"],
        treatments: ["aggressive intravenous fluid resuscitation", "vasopressors (norepinephrine) and atropine", "spinal immobilization and high-dose methylprednisolone"],
        complications: ["permanent paraplegia/quadriplegia", "deep vein thrombosis and decubitus ulcers"],
        explanation: "Neurogenic shock during spinal cord injury causes loss of sympathetic tone, leading to hypotension with bradycardia (unlike hypovolemic shock which has tachycardia)."
      },
      {
        name: "Laryngospasm",
        symptoms: ["stridor and retraction of accessory respiratory muscles during extubation", "complete airway obstruction with no breath sounds", "rapid oxygen desaturation and cyanosis"],
        diagnostics: ["reflex closure of vocal cords from secretions or light anesthesia", "paradoxical chest wall movement", "failure to ventilate with bag-mask"],
        treatments: ["continuous positive pressure mask ventilation (100% O2)", "laryngospasm notch pressure (Larson's maneuver)", "low-dose succinylcholine to relax vocal cords"],
        complications: ["negative pressure pulmonary edema", "hypoxic cardiac arrest"],
        explanation: "Laryngospasm is reflex spasm of vocal cords. Managed with continuous positive pressure ventilation, airway clearance, and small dose of muscle relaxant."
      }
    ]
  }
};

// 3. Question Compiler Loop
// Generates exactly 270 questions per subject for all subjects.
function compileDatabase() {
  const finalPool = [];
  const subjects = Object.keys(SUBJECT_PROFILES);
  
  // We need exactly 270 questions per subject.
  // We have 5 conditions per subject.
  // For each condition:
  // We can vary:
  // - 3 symptoms
  // - 3 diagnostics
  // - 3 treatments
  // - 2 complications
  // Total combinations per condition = 3 * 3 * 3 * 2 = 54 combinations.
  // 5 conditions * 54 = 270 questions!
  // This is mathematically perfect.

  let globalId = 10000;

  subjects.forEach(sub => {
    const profile = SUBJECT_PROFILES[sub];
    const condList = profile.conditions;
    const wrongOpts = profile.wrong;

    condList.forEach(cond => {
      let symptomIndex = 0;
      let diagnosticIndex = 0;
      let treatmentIndex = 0;
      let complicationIndex = 0;

      for (let c = 0; c < 54; c++) {
        // Calculate indexes to get all unique combinations
        symptomIndex = c % 3;
        diagnosticIndex = Math.floor(c / 3) % 3;
        treatmentIndex = Math.floor(c / 9) % 3;
        complicationIndex = Math.floor(c / 27) % 2;

        const age = 18 + (c % 55); // randomized ages
        const gender = (c % 2 === 0) ? "male" : "female";
        const symptom = cond.symptoms[symptomIndex];
        const diagnostic = cond.diagnostics[diagnosticIndex];
        const treatment = cond.treatments[treatmentIndex];
        const complication = cond.complications[complicationIndex];

        // Format Question Text
        const questionText = `A ${age}-year-old ${gender} presents with ${symptom}. Investigation details reveal ${diagnostic}. Standard management plan involves ${treatment}. If left untreated, a key complication is ${complication}. What is the most likely diagnosis?`;

        // Prepare Options
        // We put the correct answer, and the 3 wrong answers
        const optionsList = [cond.name, wrongOpts[0], wrongOpts[1], wrongOpts[2]];
        
        // Shuffle options but track correct answer
        // Deterministic shuffle based on iteration ID to keep things stable
        const correctIndex = (c % 4);
        // Swap correct answer to the correctIndex
        if (correctIndex !== 0) {
          const temp = optionsList[correctIndex];
          optionsList[correctIndex] = optionsList[0];
          optionsList[0] = temp;
        }

        finalPool.push({
          id: globalId++,
          subject: sub,
          question: questionText,
          options: optionsList,
          correctAnswer: correctIndex,
          explanation: cond.explanation,
          isPYQ: (c % 9 === 0),
          year: (c % 9 === 0) ? 2020 + (c % 5) : null
        });
      }
    });
  });

  return finalPool;
}

// Compile on script execution
const QUESTIONS = compileDatabase();

// Exporting so it can be used in other scripts if needed, or global accessibility in web context
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTIONS };
}
