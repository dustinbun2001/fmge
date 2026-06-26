const FLASHCARDS = [
  {
    id: 1,
    category: "Drug of Choice",
    front: "What is the drug of choice for Syphilis in a pregnant patient?",
    back: "Benzathine Penicillin G. If the patient is penicillin-allergic, skin testing and desensitization followed by Penicillin G administration is mandatory, as other drugs (like Doxycycline) are contraindicated in pregnancy or do not cross the placenta reliably."
  },
  {
    id: 2,
    category: "Pathology Pathognomonic",
    front: "Which disease features characteristic 'Aschoff nodules' and 'Anitschkow cells' (caterpillar cells)?",
    back: "Acute Rheumatic Heart Disease. Anitschkow cells are activated histiocytes with slender, wavy nuclei resembling a caterpillar. Aschoff bodies are granulomatous areas of focal interstitial inflammation."
  },
  {
    id: 3,
    category: "Microbiology Stains",
    front: "What staining technique is used to identify Mycobacterium tuberculosis, and what colour does it stain?",
    back: "Ziehl-Neelsen (Acid-Fast) stain. Acid-fast bacilli stain bright red/pink against a blue or green background (using methylene blue or malachite green counterstain)."
  },
  {
    id: 4,
    category: "Anatomy Fractures",
    front: "Which nerve is classically damaged in a mid-shaft humerus fracture, and what clinical sign does it produce?",
    back: "Radial nerve. It runs in the spiral groove of the humerus. Damage produces wrist drop (loss of extension of wrist and fingers) and sensory loss on the dorsum of the hand (web space)."
  },
  {
    id: 5,
    category: "Forensic Medicine Poisons",
    front: "A patient presents with miosis (pinpoint pupils), salivation, lacrimation, urination, diarrhea, and muscle fasciculations. What is the poisoning and the immediate antidote?",
    back: "Organophosphate poisoning (Cholinergic crisis). The antidote is Atropine (physiological antagonist) and Pralidoxime (oxime/cholinesterase reactivator)."
  },
  {
    id: 6,
    category: "Pediatrics Milestones",
    front: "At what age does a child typically start sitting without support, and when do they start walking independently?",
    back: "Sitting without support: 6-8 months.\nWalking independently: 12-15 months."
  },
  {
    id: 7,
    category: "Biochemistry Minerals",
    front: "Which copper-transporting ATPase is mutated in Wilson's disease, and on which chromosome is it located?",
    back: "ATP7B gene, located on Chromosome 13. Wilson's disease is an autosomal recessive disorder leading to copper accumulation in the liver, brain (basal ganglia), and cornea (Kayser-Fleischer rings)."
  },
  {
    id: 8,
    category: "OBG Triad",
    front: "What comprises the classic triad of Eclampsia?",
    back: "1. Hypertension\n2. Proteinuria\n3. Tonic-Clonic Seizures (convulsions) occurring after 20 weeks of gestation in a pre-eclamptic patient."
  },
  {
    id: 9,
    category: "Pharmacology Antidotes",
    front: "What is the specific antidote for Acetaminophen (Paracetamol) toxicity, and within what timeframe is it most effective?",
    back: "N-Acetylcysteine (NAC). It acts by replenishing glutathione stores in the liver. It is most effective when administered within 8-10 hours of ingestion."
  },
  {
    id: 10,
    category: "Social & Preventive Medicine",
    front: "What is the cold chain temperature range required for storing most vaccines (like BCG, DPT, Measles) at the primary health center level?",
    back: "+2°C to +8°C. OPV (Oral Polio Vaccine) is stored at -20°C for long-term storage but can also be kept at +2°C to +8°C for short periods."
  },
  {
    id: 11,
    category: "Microbiology Culture Media",
    front: "What is the selective culture medium for Corynebacterium diphtheriae, and how does it appear?",
    back: "Loffler's Serum Slope (rapid growth) and Potassium Tellurite agar (forms grey-to-black colonies because of tellurite reduction)."
  },
  {
    id: 12,
    category: "Physiology Hormones",
    front: "What is the primary action of Aldosterone, and where does it act in the nephron?",
    back: "Aldosterone promotes Sodium (Na+) and water reabsorption and Potassium (K+) and Hydrogen (H+) secretion. It acts on the Principal cells of the late distal convoluted tubule and collecting duct."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FLASHCARDS };
}
