import type { Question } from "../questions/types";
import type { SubjectTests } from "./types";
import { createEmptyTests } from "./types";
import g12BiologyT1Q2 from "@/assets/g12-biology-t1-q2.png";
import g12BiologyT1Q4 from "@/assets/g12-biology-t1-q4.png";
import g12BiologyT1Q5 from "@/assets/g12-biology-t1-q5.png";
import g12BiologyT1Q8 from "@/assets/g12-biology-t1-q8.png";
import g12BiologyT1Q11 from "@/assets/g12-biology-t1-q11.png";
import g12BiologyT1Q12 from "@/assets/g12-biology-t1-q12.png";
import g12BiologyT1Q13 from "@/assets/g12-biology-t1-q13.png";
import g12BiologyT1Q15 from "@/assets/g12-biology-t1-q15.png";
import g12BiologyT1Q17 from "@/assets/g12-biology-t1-q17.png";
import g12BiologyT1Q19 from "@/assets/g12-biology-t1-q19.png";
import g12BiologyT1Q22 from "@/assets/g12-biology-t1-q22.png";
import g12BiologyT1Q23 from "@/assets/g12-biology-t1-q23.png";
import g12BiologyT1Q24 from "@/assets/g12-biology-t1-q24.png";
import g12BiologyT1Q25 from "@/assets/g12-biology-t1-q25.png";
import g12BiologyT1Q27 from "@/assets/g12-biology-t1-q27.png";
import g12BiologyT1Q28 from "@/assets/g12-biology-t1-q28.png";
import g12BiologyT1Q29 from "@/assets/g12-biology-t1-q29.png";
import g12BiologyT2Q3 from "@/assets/g12-biology-t2-q3.png";
import g12BiologyT2Q9 from "@/assets/g12-biology-t2-q9.png";
import g12BiologyT2Q11 from "@/assets/g12-biology-t2-q11.png";
import g12BiologyT2Q15Stem from "@/assets/g12-biology-t2-q15-stem.png";
import g12BiologyT2Q16 from "@/assets/g12-biology-t2-q16.png";
import g12BiologyT2Q17 from "@/assets/g12-biology-t2-q17.png";
import g12BiologyT2Q18 from "@/assets/g12-biology-t2-q18.png";
import g12BiologyT2Q21 from "@/assets/g12-biology-t2-q21.png";
import g12BiologyT2Q22 from "@/assets/g12-biology-t2-q22.png";
import g12BiologyT2Q23 from "@/assets/g12-biology-t2-q23.png";
import g12BiologyT2Q26 from "@/assets/g12-biology-t2-q26.png";
import g12BiologyT2Q27 from "@/assets/g12-biology-t2-q27.png";
import g12BiologyT2Q28 from "@/assets/g12-biology-t2-q28.png";
import g12BiologyT2Q32 from "@/assets/g12-biology-t2-q32.png";
import g12BiologyT2Q34 from "@/assets/g12-biology-t2-q34.png";
import g12BiologyT2Q36 from "@/assets/g12-biology-t2-q36.png";
import g12BiologyT2Q38 from "@/assets/g12-biology-t2-q38.png";
import g12BiologyT2Q39 from "@/assets/g12-biology-t2-q39.png";
import g12BiologyT3Q3 from "@/assets/g12-biology-t3-q3.png";
import g12BiologyT3Q8 from "@/assets/g12-biology-t3-q8.png";
import g12BiologyT3Q9 from "@/assets/g12-biology-t3-q9.png";
import g12BiologyT3Q11 from "@/assets/g12-biology-t3-q11.png";
import g12BiologyT3Q13 from "@/assets/g12-biology-t3-q13.png";
import g12BiologyT3Q15 from "@/assets/g12-biology-t3-q15.png";
import g12BiologyT3Q17 from "@/assets/g12-biology-t3-q17.png";
import g12BiologyT3Q18 from "@/assets/g12-biology-t3-q18.png";
import g12BiologyT3Q19 from "@/assets/g12-biology-t3-q19.png";
import g12BiologyT3Q28 from "@/assets/g12-biology-t3-q28.png";
import g12BiologyT3Q29 from "@/assets/g12-biology-t3-q29.png";
import g12BiologyT3Q30 from "@/assets/g12-biology-t3-q30.png";
import g12BiologyT3Q32 from "@/assets/g12-biology-t3-q32.png";
import g12BiologyT3Q34 from "@/assets/g12-biology-t3-q34.png";
import g12BiologyT3Q35 from "@/assets/g12-biology-t3-q35.png";
import g12BiologyT3Q37 from "@/assets/g12-biology-t3-q37.png";
import g12BiologyT3Q5 from "@/assets/g12-biology-t3-q5.png";
import g12BiologyT3Q39 from "@/assets/g12-biology-t3-q39.png";
import g12BiologyT3Q2 from "@/assets/g12-biology-t3-q2.png";
import g12BiologyT3Q22 from "@/assets/g12-biology-t3-q22.png";
import g12BiologyT3Q38 from "@/assets/g12-biology-t3-q38.png";
import g12BiologyT3Q26 from "@/assets/g12-biology-t3-q26.png";
import g12BiologyT4Q2 from "@/assets/g12-biology-t4-q2.jpg";
import g12BiologyT4Q3 from "@/assets/g12-biology-t4-q3.jpg";
import g12BiologyT4Q8 from "@/assets/g12-biology-t4-q8.jpg";
import g12BiologyT4Q9 from "@/assets/g12-biology-t4-q9.jpg";
import g12BiologyT4Q11 from "@/assets/g12-biology-t4-q11.jpg";
import g12BiologyT4Q17 from "@/assets/g12-biology-t4-q17.jpg";
import g12BiologyT4Q20 from "@/assets/g12-biology-t4-q20.jpg";
import g12BiologyT4Q24 from "@/assets/g12-biology-t4-q24.jpg";
import g12BiologyT4Q30 from "@/assets/g12-biology-t4-q30.jpg";
import g12BiologyT4Q37 from "@/assets/g12-biology-t4-q37.jpg";
import g12BiologyT4Q38 from "@/assets/g12-biology-t4-q38.jpg";
import g12BiologyT5Q3 from "@/assets/g12-biology-t5-q3.png";
import g12BiologyT5Q5 from "@/assets/g12-biology-t5-q5.png";
import g12BiologyT5Q8 from "@/assets/g12-biology-t5-q8.png";
import g12BiologyT5Q10 from "@/assets/g12-biology-t5-q10.png";
import g12BiologyT5Q13 from "@/assets/g12-biology-t5-q13.png";
import g12BiologyT5Q16 from "@/assets/g12-biology-t5-q16.png";
import g12BiologyT5Q17 from "@/assets/g12-biology-t5-q17.png";
import g12BiologyT5Q18 from "@/assets/g12-biology-t5-q18.png";
import g12BiologyT5Q20 from "@/assets/g12-biology-t5-q20.png";
import g12BiologyT5Q22 from "@/assets/g12-biology-t5-q22.png";
import g12BiologyT5Q24 from "@/assets/g12-biology-t5-q24.png";
import g12BiologyT5Q25 from "@/assets/g12-biology-t5-q25.png";
import g12BiologyT5Q26 from "@/assets/g12-biology-t5-q26.png";
import g12BiologyT5Q28 from "@/assets/g12-biology-t5-q28.png";
import g12BiologyT5Q29 from "@/assets/g12-biology-t5-q29.png";
import g12BiologyT5Q31 from "@/assets/g12-biology-t5-q31.png";
import g12BiologyT5Q36 from "@/assets/g12-biology-t5-q36.png";
import g12BiologyT5Q37 from "@/assets/g12-biology-t5-q37.png";
import g12BiologyT6Q8 from "@/assets/g12-biology-t6-q8.jpg";
import g12BiologyT6Q15 from "@/assets/g12-biology-t6-q15.jpg";
import g12BiologyT6Q17 from "@/assets/g12-biology-t6-q17.jpg";
import g12BiologyT6Q20 from "@/assets/g12-biology-t6-q20.jpg";
import g12BiologyT6Q21 from "@/assets/g12-biology-t6-q21.jpg";
import g12BiologyT6Q23 from "@/assets/g12-biology-t6-q23.jpg";
import g12BiologyT6Q24 from "@/assets/g12-biology-t6-q24.jpg";
import g12BiologyT6Q25 from "@/assets/g12-biology-t6-q25.jpg";
import g12BiologyT6Q27 from "@/assets/g12-biology-t6-q27.jpg";
import g12BiologyT6Q28 from "@/assets/g12-biology-t6-q28.jpg";
import g12BiologyT6Q30 from "@/assets/g12-biology-t6-q30.jpg";
import g12BiologyT6Q36 from "@/assets/g12-biology-t6-q36.jpg";
import g12BiologyT7Q1 from "@/assets/g12-biology-t7-q1.jpg";
import g12BiologyT7Q2 from "@/assets/g12-biology-t7-q2.jpg";
import g12BiologyT7Q3 from "@/assets/g12-biology-t7-q3.jpg";
import g12BiologyT7Q8 from "@/assets/g12-biology-t7-q8.jpg";
import g12BiologyT7Q11 from "@/assets/g12-biology-t7-q11.jpg";
import g12BiologyT7Q17 from "@/assets/g12-biology-t7-q17.jpg";
import g12BiologyT7Q18 from "@/assets/g12-biology-t7-q18.jpg";
import g12BiologyT7Q20 from "@/assets/g12-biology-t7-q20.jpg";
import g12BiologyT7Q21 from "@/assets/g12-biology-t7-q21.jpg";
import g12BiologyT7Q24 from "@/assets/g12-biology-t7-q24.jpg";
import g12BiologyT7Q25 from "@/assets/g12-biology-t7-q25.jpg";
import g12BiologyT7Q27 from "@/assets/g12-biology-t7-q27.jpg";
import g12BiologyT7Q29 from "@/assets/g12-biology-t7-q29.jpg";
import g12BiologyT7Q30 from "@/assets/g12-biology-t7-q30.jpg";
import g12BiologyT7Q37 from "@/assets/g12-biology-t7-q37.jpg";

// Source: ECZ GCE 2023 Biology 5090/1 Paper 1 (Multiple Choice)
const test1: Question[] = [
  {
    id: 1,
    question:
      "Some lizards detach their tails when threatened by a predator. Which characteristic of living organisms is shown?",
    options: ["Excretion", "Growth", "Reproduction", "Sensitivity"],
    correctAnswer: 3,
    tip: "Detaching the tail is a response to a stimulus (the predator) — that is sensitivity.",
  },
  {
    id: 2,
    question:
      "The diagrams show a plant cell (with structures W, X, Z) and an animal cell (with structure Y). Which of the labelled structures is found in BOTH plant and animal cells?",
    options: ["W", "X", "Y", "Z"],
    correctAnswer: 2,
    tip: "Cell wall (W), chloroplast (X) and large permanent vacuole (Z) are found only in plant cells. The cytoplasm/nucleus structure (Y) is common to both plant and animal cells.",
    image: g12BiologyT1Q2,
  },
  {
    id: 3,
    question: "Which of the following is NOT a tissue?",
    options: ["Blood", "Epidermis", "Leaf", "Muscle"],
    correctAnswer: 2,
    tip: "A leaf is an organ — it is made up of several different tissues working together.",
  },
  {
    id: 4,
    question:
      "The graph shows how pH affects the rate of an enzyme-controlled reaction. Which letter shows the optimum pH?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The optimum pH is the pH at which the reaction rate is highest — the peak of the curve.",
    image: g12BiologyT1Q4,
  },
  {
    id: 5,
    question: "The table shows results of food tests on four samples. Which sample contains BOTH starch and protein?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Iodine turning blue-black indicates starch; Biuret turning purple indicates protein. Sample B shows both.",
    image: g12BiologyT1Q5,
  },
  {
    id: 6,
    question: "Which nutrient is needed to make the haemoglobin in red blood cells?",
    options: ["Calcium", "Iron", "Roughage", "Vitamin D"],
    correctAnswer: 1,
    tip: "Iron is a key component of the haem group in haemoglobin, which carries oxygen.",
  },
  {
    id: 7,
    question: "A plant has weak cell walls. Which of the following nutrients was the plant lacking?",
    options: ["Boron", "Calcium", "Nitrogen", "Potassium"],
    correctAnswer: 1,
    tip: "Calcium is required for the formation of strong, healthy cell walls (calcium pectate in the middle lamella).",
  },
  {
    id: 8,
    question:
      "The diagram shows a section through a leaf with arrows A, B, C and D. Which arrow represents the diffusion of oxygen out of the leaf during photosynthesis?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "During photosynthesis, oxygen is produced as a waste product and diffuses OUT of the leaf through the stomata (arrow A).",
    image: g12BiologyT1Q8,
  },
  {
    id: 9,
    question: "A tick feeding on the blood of a dog is an example of …",
    options: ["commensalism.", "mutualism.", "parasitism.", "predation."],
    correctAnswer: 2,
    tip: "The tick benefits while the dog is harmed — this is parasitism.",
  },
  {
    id: 10,
    question:
      "The dental formula of a dog is i X/3, c 1/1, pm 4/4, m 2/3. The total number of teeth in the mouth of the dog is 42. Find the value of X.",
    options: ["2", "3", "4", "6"],
    correctAnswer: 1,
    tip: "Total = 2 × (X + 3 + 1 + 1 + 4 + 4 + 2 + 3) = 42, so X + 18 = 21, giving X = 3.",
  },
  {
    id: 11,
    question:
      "The diagram shows the human alimentary canal with parts labelled A, B, C and D. Which labelled structure produces gastric juice?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Gastric juice is produced by glands in the wall of the stomach (B).",
    image: g12BiologyT1Q11,
  },
  {
    id: 12,
    question:
      "The diagram shows a fish gill with parts labelled Q, R, S and T. In which labelled part does gaseous exchange take place?",
    options: ["Q", "R", "S", "T"],
    correctAnswer: 3,
    tip: "Gaseous exchange occurs across the thin, well-supplied gill filaments (T), which have a large surface area and rich blood supply.",
    image: g12BiologyT1Q12,
  },
  {
    id: 13,
    question:
      "The diagram shows the life cycle of a mosquito with stages labelled A, B, C and D. Which stage in the life cycle of the mosquito transmits pathogens?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Only the adult female mosquito (A) bites and feeds on blood, transmitting pathogens such as the malarial parasite.",
    image: g12BiologyT1Q13,
  },
  {
    id: 14,
    question: "Stigma against people living with HIV and AIDS can be reduced by …",
    options: ["fear.", "lack of information.", "myths.", "sensitisation."],
    correctAnswer: 3,
    tip: "Sensitisation (educating the community with correct information) reduces fear, myths and stigma.",
  },
  {
    id: 15,
    question: "The diagram shows three plant storage organs labelled P, Q and R. Which row correctly identifies them?",
    options: [
      "P = Corm, Q = Rhizome, R = Tuber",
      "P = Corm, Q = Tuber, R = Rhizome",
      "P = Rhizome, Q = Corm, R = Tuber",
      "P = Rhizome, Q = Tuber, R = Corm",
    ],
    correctAnswer: 3,
    tip: "Rhizome = horizontal underground stem (P); Tuber = swollen tip of an underground stem, e.g. potato (Q); Corm = short, swollen vertical underground stem (R).",
    image: g12BiologyT1Q15,
  },
  {
    id: 16,
    question:
      "The human blood groups are A, B, AB and O-. Which blood group can be donated to any person (universal donor)?",
    options: ["A", "AB", "B", "O-"],
    correctAnswer: 3,
    tip: "Group O has no A or B antigens on its red cells, so it can be transfused to any recipient — it is the universal donor.",
  },
  {
    id: 17,
    question:
      "The diagram shows a section through the human heart with structures P, Q and R labelled. What is the function of the structure labelled Q?",
    options: [
      "Controls the amount of blood leaving the heart.",
      "Increases the pressure in the ventricle.",
      "Prevents backflow of blood into the atrium.",
      "Prevents blood flowing into the vena cava.",
    ],
    correctAnswer: 2,
    tip: "Q is the atrioventricular valve. It closes when the ventricle contracts, preventing blood from flowing back into the atrium.",
    image: g12BiologyT1Q17,
  },
  {
    id: 18,
    question: "Where is urea made and where is it removed?",
    options: [
      "Made in Kidney, Removed in Bladder",
      "Made in Kidney, Removed in Kidney",
      "Made in Liver, Removed in Kidney",
      "Made in Liver, Removed in Rectum",
    ],
    correctAnswer: 2,
    tip: "Urea is produced in the liver from the breakdown of excess amino acids (deamination) and removed by the kidneys in urine.",
  },
  {
    id: 19,
    question:
      "The diagram shows a section through the human skin with structures A, B, C and D labelled. Which labelled structure releases sweat on a hot sunny day?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "C is the coiled sweat gland in the dermis. It produces sweat which travels up the duct and is released onto the skin surface to cool the body.",
    image: g12BiologyT1Q19,
  },
  {
    id: 20,
    question: "Which one of the following is NOT an endocrine gland?",
    options: ["Pancreas", "Salivary", "Testes", "Thyroid"],
    correctAnswer: 1,
    tip: "Salivary glands are exocrine — they release saliva through ducts, not hormones into the blood.",
  },
  {
    id: 21,
    question:
      "When the nervous system responds to a stimulus, the stages are:\n1. The central nervous system processes the information.\n2. The receptors detect the stimulus.\n3. A nerve impulse is sent to the central nervous system.\n4. A response is produced.\n5. A nerve impulse is sent to the muscles.\nWhat is the correct order?",
    options: ["2, 3, 1, 5, 4", "2, 3, 5, 1, 4", "3, 2, 1, 5, 4", "3, 2, 5, 1, 4"],
    correctAnswer: 0,
    tip: "Stimulus → Receptor (2) → Sensory neurone to CNS (3) → CNS processes (1) → Motor neurone to effector (5) → Response (4).",
  },
  {
    id: 22,
    question:
      "The diagram shows a lens used to correct a defect in the human eye. Which defect is corrected by this lens?",
    options: ["Cataracts", "Long sight", "Presbyopia", "Short sight"],
    correctAnswer: 3,
    tip: "The lens shown is concave (diverging) — thinner in the middle than at the edges. Concave lenses correct short sight (myopia), where images form in front of the retina.",
    image: g12BiologyT1Q22,
  },
  {
    id: 23,
    question:
      "The diagram shows part of a mammalian skeleton with the femur and a bone labelled W. Which row correctly identifies bone W and the type of skeleton?",
    options: [
      "W = Fibula, Endoskeleton",
      "W = Patella, Exoskeleton",
      "W = Scapula, Endoskeleton",
      "W = Tibia, Exoskeleton",
    ],
    correctAnswer: 0,
    tip: "Below the femur are the tibia and fibula. Mammals have an internal (endo) skeleton. Per the ECZ marking scheme, W = Fibula, Endoskeleton.",
    image: g12BiologyT1Q23,
  },
  {
    id: 24,
    question:
      "The diagram shows a potted plant placed on its side. After one week the shoot had bent and grown upwards, away from the ground. What type of tropism was exhibited by the shoot?",
    options: ["Negative geotropism", "Negative phototropism", "Positive geotropism", "Positive hydrotropism"],
    correctAnswer: 0,
    tip: "Shoots grow AWAY from gravity — this is negative geotropism (negative gravitropism).",
    image: g12BiologyT1Q24,
  },
  {
    id: 25,
    question:
      "The diagram shows the early growth of a green plant from stage P (seedling) to stage Q (a larger plant with more leaves). What is occurring from P to Q?",
    options: [
      "Mitosis ✓, Development ✓",
      "Mitosis ✓, Development ✗",
      "Mitosis ✗, Development ✓",
      "Mitosis ✗, Development ✗",
    ],
    correctAnswer: 0,
    tip: "Growth from P to Q involves both cell division (mitosis) and the formation of new specialised structures (development).",
    image: g12BiologyT1Q25,
  },
  {
    id: 26,
    question:
      "Some seeds were sown in four dishes:\nDish 1: 1 °C, Dry\nDish 2: 1 °C, Wet\nDish 3: 20 °C, Dry\nDish 4: 20 °C, Wet\nIn which dish will the seeds germinate most rapidly?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 3,
    tip: "Germination needs warmth AND water. Dish 4 provides a warm temperature (20 °C) and moisture.",
  },
  {
    id: 27,
    question:
      "The diagram shows asexual reproduction in a unicellular organism, where one parent cell divides into two equal daughter cells. What name is given to this type of asexual reproduction?",
    options: ["Binary fission", "Budding", "Fragmentation", "Spore formation"],
    correctAnswer: 0,
    tip: "Splitting of a single-celled organism into two equal cells is called binary fission (e.g. in bacteria, Amoeba).",
    image: g12BiologyT1Q27,
  },
  {
    id: 28,
    question:
      "The diagram shows the stages (1, 2 and 3) of a method of artificial vegetative propagation in which a bud from one plant is inserted into the stem of another and bound in place. What type of propagation is this?",
    options: ["Budding (bud grafting)", "Layering", "Stem cutting", "Tissue culture"],
    correctAnswer: 0,
    tip: "Inserting a bud from one plant into a slit cut in the stem of another and binding it so it grows is called budding (a form of grafting).",
    image: g12BiologyT1Q28,
  },
  {
    id: 29,
    question:
      "The diagram shows a section through a flower with parts labelled A, B, C and D. Where are the male gametes produced?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "C labels the anther (the yellow pollen sac at the tip of the stamen). Pollen grains, which contain the male gametes, are produced in the anther.",
    image: g12BiologyT1Q29,
  },
  {
    id: 30,
    question: "Which fruit will be dispersed by wind?",
    options: [
      "Fleshy and scented",
      "Light weight and has a wing",
      "Sticky and has hooks",
      "Sweet tasting and brightly coloured",
    ],
    correctAnswer: 1,
    tip: "Wind-dispersed fruits/seeds are light and often have wings or hairs to help them float on air currents.",
  },
  {
    id: 31,
    question:
      "A diagram of the female reproductive system labels A (ovary), B (oviduct/Fallopian tube), C (uterus) and D (vagina). Where does fertilisation take place?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Fertilisation normally occurs in the oviduct (Fallopian tube), where sperm meet the egg.",
  },
  {
    id: 32,
    question: "Diagrams show four methods of birth control.  Which one is a hormonal method?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The contraceptive pill contains hormones (oestrogen and/or progesterone) that prevent ovulation — it is the hormonal method.",
  },
  {
    id: 33,
    question:
      "A study was made of children whose mother is blood group O (genotype IᴼIᴼ) and whose father is blood group AB (genotype IᴬIᴮ). Which statement about their children is correct?",
    options: [
      "All will have the same blood group.",
      "50% will have the same blood group as their mother.",
      "50% will have the same blood group as their father.",
      "None will have the same blood group as either parent.",
    ],
    correctAnswer: 3,
    tip: "Children's possible genotypes are IᴬIᴼ (group A) or IᴮIᴼ (group B). None will be group O (mother) or AB (father).",
  },
  {
    id: 34,
    question: "Which of the following is a beneficial use of mutation?",
    options: [
      "Creation of nuclear plants",
      "Formation of ultra-violet light",
      "Making of polyploidy plants in agriculture",
      "Making of x-ray machines in hospitals",
    ],
    correctAnswer: 2,
    tip: "Polyploidy (multiple sets of chromosomes) is a beneficial mutation used in agriculture to produce larger, more vigorous crop plants.",
  },
  {
    id: 35,
    question:
      "Which of the following are characteristics of a fish?\n\nA: Constant body temp ✓, External ears ✓, Jelly eggs ✗, Scales ✗\nB: Constant body temp ✓, External ears ✗, Jelly eggs ✓, Scales ✓\nC: Constant body temp ✗, External ears ✓, Jelly eggs ✗, Scales ✗\nD: Constant body temp ✗, External ears ✗, Jelly eggs ✓, Scales ✓",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Fish are cold-blooded (variable body temperature), have no external ears, lay jelly-covered eggs and have scales.",
  },
  {
    id: 36,
    question: "Which factor will cause a decrease in population size?",
    options: ["Decreased death rate", "Decreased disease", "Decreased food supply", "Decreased predation"],
    correctAnswer: 2,
    tip: "Less food means more competition and starvation — population size will fall. The other three would tend to increase population.",
  },
  {
    id: 37,
    question:
      "A diagram of part of the carbon cycle shows arrows between Carbon dioxide (in the air), Plants, Animals and Dead matter. Arrow X goes from animals (and plants) back to carbon dioxide in the air. What does arrow X represent?",
    options: ["Decay", "Nutrition", "Photosynthesis", "Respiration"],
    correctAnswer: 3,
    tip: "Living organisms release CO₂ back into the air through respiration.",
  },
  {
    id: 38,
    question: "Which of the following is an effect of deforestation?",
    options: [
      "Decreased carbon dioxide content in the air.",
      "Decreased flooding of low-lying land.",
      "Increased rainfall.",
      "Increased rate of soil erosion.",
    ],
    correctAnswer: 3,
    tip: "Without tree roots and leaf cover, soil is exposed and easily washed away — soil erosion increases.",
  },
  {
    id: 39,
    question:
      "Some examples of waste products of human activity are:\n1. Discarded household rubbish\n2. Excess fertiliser\n3. Industrial chemicals\n4. Untreated sewage\nWhich of these can cause increased growth of aquatic plants (eutrophication)?",
    options: ["1 and 2", "1 and 3", "2 and 4", "3 and 4"],
    correctAnswer: 2,
    tip: "Excess fertiliser and untreated sewage add nitrates and phosphates to water, causing rapid growth of algae and aquatic plants (eutrophication).",
  },
  {
    id: 40,
    question: "Which of the following is a sustainable use of resources?",
    options: ["Deforestation", "Game keeping", "Over fishing", "Over hunting"],
    correctAnswer: 1,
    tip: "Game keeping (managing wildlife so populations stay healthy) allows the resource to be used without being destroyed — it is sustainable.",
  },
];

// Source: ECZ 2022 Biology 5090/1 Paper 1 (Multiple Choice)
const test2: Question[] = [
  {
    id: 1,
    question:
      "A learner was walking along a road when he saw an object under a tree. When the learner touched the object, it changed colour, rolled over and divided into two. Which characteristics of living organisms has the object shown?",
    options: [
      "Excretion, movement, nutrition",
      "Growth, reproduction, sensitivity",
      "Movement, reproduction, respiration",
      "Movement, reproduction, sensitivity",
    ],
    correctAnswer: 3,
    tip: "Touching → changed colour (sensitivity), rolled over (movement), divided into two (reproduction).",
  },
  {
    id: 2,
    question:
      "Which of the following correctly shows the path followed by a light beam from a mirror to a viewer of a specimen under a microscope?",
    options: [
      "Eye piece → Specimen → Objective lens → Barrel",
      "Specimen → Barrel → Objective lens → Eye piece",
      "Specimen → Eye piece → Barrel → Objective lens",
      "Specimen → Objective lens → Barrel → Eye piece",
    ],
    correctAnswer: 3,
    tip: "Light from the mirror passes through the specimen, then the objective lens, up the barrel and finally through the eyepiece to the viewer.",
  },
  {
    id: 3,
    question:
      "A learner investigated osmosis using two potato cylinders P and Q on a balance — P suspended in distilled water and Q in very concentrated sugar solution. After 4 hours, cylinder P was heavier than Q. Which statement explains what happened? Water moved …",
    options: ["into cylinder P.", "into cylinders P and Q.", "into cylinder Q.", "out of cylinders P and Q."],
    correctAnswer: 0,
    tip: "P was in distilled water (high water potential) so water moved INTO P by osmosis, making it heavier. Q lost water to the concentrated sugar solution.",
    image: g12BiologyT2Q3,
  },
  {
    id: 4,
    question:
      "Two samples of a human enzyme were used in an experiment. Before they were used, sample X was heated to 80 °C and cooled to 37 °C, and sample Y was cooled to 0 °C and then heated to 37 °C. How did this affect the enzyme activity?",
    options: [
      "Sample X and sample Y were no longer active.",
      "Sample X and sample Y were equally active.",
      "Sample X was more active than sample Y.",
      "Sample Y was active while sample X was inactive.",
    ],
    correctAnswer: 3,
    tip: "Heating to 80 °C denatures the enzyme permanently (X is inactive). Cooling only slows it down — warming back to 37 °C restores activity (Y is active).",
  },
  {
    id: 5,
    question:
      "Four food samples have the following composition (Carbohydrate %, Fat %, Protein %): A (59, 33, 4); B (54, 36, 8); C (36, 26, 19); D (30, 22, 18). Which food sample contains the most energy?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Energy: carbs and protein give 4 kcal/g, fat gives 9 kcal/g. B has the most fat (36%) and high carbs (54%), giving the highest total energy.",
  },
  {
    id: 6,
    question:
      "The following symptoms can be caused by a dietary deficiency: bone pain, dental problems, fragile bones, skeletal deformities. Which nutrient deficiency is most likely to cause these symptoms?",
    options: ["Iron", "Protein", "Vitamin C", "Vitamin D"],
    correctAnswer: 3,
    tip: "Vitamin D is needed for calcium absorption. Without it, bones become weak and deformed (rickets/osteomalacia).",
  },
  {
    id: 7,
    question: "Which of the following groups of people need more carbohydrates in their diet?",
    options: [
      "Aged and youth",
      "Lactating woman and sick person",
      "Pregnant woman and sportsman",
      "Sick person and pre-school age",
    ],
    correctAnswer: 2,
    tip: "Pregnant women and sportsmen have very high energy demands, so they need more carbohydrates.",
  },
  {
    id: 8,
    question:
      "A plant had the following signs: poor root growth and small reproductive organs. Which nutrient was the plant lacking?",
    options: ["Boron", "Copper", "Magnesium", "Phosphorus"],
    correctAnswer: 3,
    tip: "Phosphorus is essential for healthy root development and the formation of flowers, fruits and seeds.",
  },
  {
    id: 9,
    question:
      "The diagram shows the internal structure of a dicotyledonous leaf with parts labelled A, B, C and D. Which part transports mineral salts and water?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "A labels the vascular bundle (vein) — the xylem inside transports mineral salts and water from the roots to the leaf.",
    image: g12BiologyT2Q9,
  },
  {
    id: 10,
    question: "Which of the following best describes saprophytic nutrition?",
    options: [
      "Feeding on dead or decaying matter.",
      "Feeding on living organisms.",
      "Involves intracellular digestion.",
      "Manufacturing of food nutrients.",
    ],
    correctAnswer: 0,
    tip: "Saprophytes (e.g. many fungi and bacteria) feed by secreting enzymes onto dead or decaying organic matter and absorbing the digested products.",
  },
  {
    id: 11,
    question: "The diagram shows a tooth with signs of decay. What has caused the tooth to decay?",
    options: ["Acid", "Saliva", "Sugar", "Toothpaste"],
    correctAnswer: 0,
    tip: "Bacteria feed on sugar in the mouth and produce ACID, which dissolves the enamel and causes tooth decay.",
    image: g12BiologyT2Q11,
  },
  {
    id: 12,
    question:
      "During breathing, the diaphragm and intercostal muscles change state. Which combination of muscle changes causes inspiration (breathing in)?",
    options: [
      "Diaphragm relaxes, external intercostals relax, internal intercostals contract",
      "Diaphragm contracts, external intercostals contract, internal intercostals relax",
      "Diaphragm contracts, external intercostals relax, internal intercostals contract",
      "Diaphragm relaxes, external intercostals contract, internal intercostals relax",
    ],
    correctAnswer: 1,
    tip: "Inspiration: diaphragm CONTRACTS (flattens), external intercostals CONTRACT (ribs up and out), internal intercostals RELAX. This increases chest volume so air rushes in.",
  },
  {
    id: 13,
    question: "Which products of anaerobic respiration are important for making beer and bread?",
    options: [
      "Beer: Carbon dioxide; Bread: Simple sugar",
      "Beer: Ethanol; Bread: Carbon dioxide",
      "Beer: Lactic acid; Bread: Ethanol",
      "Beer: Simple sugar; Bread: Lactic acid",
    ],
    correctAnswer: 1,
    tip: "Yeast respires anaerobically: ethanol gives beer its alcohol, while CO₂ makes bread dough rise.",
  },
  {
    id: 14,
    question:
      "In order to reduce the effects of COVID-19, people are advised to get vaccinated. What type of immunity results from these vaccinations?",
    options: [
      "Artificial active immunity",
      "Artificial passive immunity",
      "Natural active immunity",
      "Natural passive immunity",
    ],
    correctAnswer: 0,
    tip: "Vaccines are man-made (artificial) and stimulate the body to make its own antibodies (active) — this is artificial active immunity.",
  },
  {
    id: 15,
    question:
      "The diagram shows a cross section of a dicot plant stem with regions P (outer of vascular bundle) and Q (inner of vascular bundle). A dicot root cross section has region R (the central star-shaped tissue) and region S (surrounding cortex). Which labelled regions contain xylem vessels?",
    options: ["P and R", "P and S", "Q and R", "Q and S"],
    correctAnswer: 2,
    tip: "In a dicot stem, xylem lies on the INNER side of each vascular bundle (Q). In a dicot root, xylem forms the central star (R).",
    image: g12BiologyT2Q15Stem,
  },
  {
    id: 16,
    question:
      "The following is a random list of processes for a wound to heal:\n1. The blood clot forms a seal\n2. Fibrin traps red blood cells\n3. Fibrinogen is converted to fibrin\n4. New tissues form\nIn which correct order do these processes take place?",
    options: ["1 → 2 → 4 → 3", "2 → 4 → 3 → 1", "3 → 2 → 1 → 4", "4 → 3 → 1 → 2"],
    correctAnswer: 2,
    tip: "Soluble fibrinogen is first converted to fibrin (3); the fibrin mesh traps red blood cells (2) forming a clot that seals the wound (1); finally new tissue forms (4).",
    image: g12BiologyT2Q16,
  },
  {
    id: 17,
    question:
      "The diagram shows some body cells and a nearby capillary. Substances pass between them in the direction of the arrow X. Which substances must pass in the direction of arrow X for the cells to respire aerobically?",
    options: ["Carbon dioxide and water", "Glucose and oxygen", "Salts and glucose", "Water and salts"],
    correctAnswer: 1,
    tip: "Aerobic respiration needs glucose and oxygen, which must move from the capillary into the body cells (arrow X).",
    image: g12BiologyT2Q17,
  },
  {
    id: 18,
    question:
      "The diagram shows a nephron with parts numbered 1 (glomerulus/Bowman's capsule), 2 (proximal convoluted tubule), 3 (loop of Henle), 4 (distal convoluted tubule) and 5 (collecting duct). Where do ultra-filtration and selective reabsorption occur?",
    options: [
      "Ultra-filtration: 1; Selective reabsorption: 2",
      "Ultra-filtration: 1; Selective reabsorption: 3",
      "Ultra-filtration: 2; Selective reabsorption: 3",
      "Ultra-filtration: 4; Selective reabsorption: 5",
    ],
    correctAnswer: 0,
    tip: "Ultra-filtration occurs at the glomerulus/Bowman's capsule (1). Selective reabsorption of useful substances (e.g. glucose, salts) takes place in the proximal convoluted tubule (2).",
    image: g12BiologyT2Q18,
  },
  {
    id: 19,
    question: "What is true for a runner at the end of a race in hot weather?",
    options: [
      "Sweating and vasoconstriction",
      "Sweating and vasodilation",
      "Vasoconstriction only",
      "Vasodilation only",
    ],
    correctAnswer: 1,
    tip: "To lose excess heat the body sweats and the skin's blood vessels widen (vasodilation), bringing more blood to the surface to lose heat.",
  },
  {
    id: 20,
    question:
      "Which of the following hormones stimulates growth by stimulating the synthesis of macromolecules such as carbohydrates, lipids and proteins?",
    options: ["Antidiuretic hormone", "Growth hormone", "Thyroid stimulating hormone", "Thyroxine"],
    correctAnswer: 1,
    tip: "Growth hormone (from the pituitary) stimulates the synthesis of proteins, carbohydrates and lipids needed for body growth.",
  },
  {
    id: 21,
    question: "Which of the following correctly shows examples of spinal, cranial and conditioned reflexes?",
    options: [
      "Spinal: Blinking; Cranial: Knee jerk; Conditioned: Salivating",
      "Spinal: Coughing; Cranial: Blinking; Conditioned: Knee jerk",
      "Spinal: Knee jerk; Cranial: Blinking; Conditioned: Salivating (to a learned signal)",
      "Spinal: Salivating; Cranial: Coughing; Conditioned: Blinking",
    ],
    correctAnswer: 2,
    image: g12BiologyT2Q21,
    tip: "Knee jerk is a spinal reflex; blinking is controlled by cranial nerves; salivating in response to a learned cue (e.g. the smell of food) is a conditioned reflex.",
  },
  {
    id: 22,
    question:
      "A diagram of a human ear shows parts labelled A (semicircular canals at the top), B (cochlea), C (Eustachian tube) and D (ear ossicles in the middle ear). Which of the labelled parts is involved in balance?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    image: g12BiologyT2Q22,
    tip: "The semicircular canals (A) detect movement of the head and are responsible for balance.",
  },
  {
    id: 23,
    question:
      "The diagram shows the elbow joint in two different positions. Muscle X is on the upper (anterior) side and Muscle Y on the lower (posterior) side, and the arm bends (flexes). What happens to muscles X and Y to change the position of the joint?",
    options: ["X contracts; Y contracts", "X contracts; Y relaxes", "X relaxes; Y contracts", "X relaxes; Y relaxes"],
    correctAnswer: 1,
    tip: "X is the biceps. To bend (flex) the arm, the biceps (X) contracts and the triceps (Y) relaxes — antagonistic muscle action.",
    image: g12BiologyT2Q23,
  },
  {
    id: 24,
    question:
      "Which of the following correctly distinguishes a taxic response from a tropic response? A taxic response …",
    options: [
      "involves hormones.",
      "is a growth movement.",
      "is a movement of the whole organism.",
      "is irreversible.",
    ],
    correctAnswer: 2,
    tip: "Taxis is the directional movement of a WHOLE organism in response to a stimulus. Tropisms are growth responses in plants.",
  },
  {
    id: 25,
    question: "Which of the following is the correct order of processes that occur during growth?",
    options: [
      "Cell division, cell elongation, cell specialisation",
      "Cell division, cell specialisation, cell elongation",
      "Cell elongation, cell division, cell specialisation",
      "Cell elongation, cell specialisation, cell division",
    ],
    correctAnswer: 0,
    tip: "Growth proceeds by cell DIVISION (more cells), then cell ELONGATION (cells get bigger), then cell SPECIALISATION (cells differentiate).",
  },
  {
    id: 26,
    question:
      "The diagram shows three seedlings labelled 1, 2 and 3. Seedling 1 has its cotyledon below the soil; seedlings 2 and 3 have their cotyledons raised above the soil. Which seedling(s) show(s) epigeal germination?",
    options: ["1 and 3", "1 only", "2 only", "2 and 3"],
    correctAnswer: 3,
    tip: "Epigeal germination is when the cotyledons are pushed ABOVE the soil surface — seen in seedlings 2 and 3.",
    image: g12BiologyT2Q26,
  },
  {
    id: 27,
    question:
      "The diagram shows asexual reproduction in a unicellular organism in which a small outgrowth (with a nucleus) forms on the parent cell and breaks off. What type of asexual reproduction is shown?",
    options: ["Binary fission", "Budding", "Fragmentation", "Spore formation"],
    correctAnswer: 1,
    tip: "A small outgrowth (bud) developing on the parent and detaching to form a new individual is BUDDING (e.g. in yeast, Hydra).",
    image: g12BiologyT2Q27,
  },
  {
    id: 28,
    question:
      "The diagram shows a strawberry plant with parts labelled A (flower), B (fruit), C (leaves) and D (a new daughter plant produced at the tip of a runner). Which labelled part of the plant can ONLY be produced by asexual reproduction?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "D is the new plant formed at the tip of a runner (stolon) — this is vegetative (asexual) reproduction only. Flowers and fruits involve sexual reproduction.",
    image: g12BiologyT2Q28,
  },
  {
    id: 29,
    question: "Which processes occur in the carpel of a flower?",
    options: [
      "Attracting insects and pollination",
      "Fertilisation and producing pollen",
      "Pollination and fruit formation",
      "Releasing pollen and fertilisation",
    ],
    correctAnswer: 2,
    tip: "The carpel (stigma, style, ovary) receives pollen (pollination) and the ovary later develops into the fruit.",
  },
  {
    id: 30,
    question:
      "The following processes occur during reproduction in flowering plants:\n1. Fertilisation\n2. Growth of pollen tubes\n3. Pollination\n4. Seed formation\nIn which order do these processes occur?",
    options: ["1 → 4 → 2 → 3", "2 → 1 → 3 → 4", "3 → 2 → 1 → 4", "4 → 3 → 1 → 2"],
    correctAnswer: 2,
    tip: "Pollination (3) deposits pollen on the stigma; pollen tubes grow (2); fertilisation occurs (1); the ovule develops into a seed (4).",
  },
  {
    id: 31,
    question: "A frog becomes an adult when …",
    options: [
      "it has all four legs and its tail disappears.",
      "it has all four legs and a tail.",
      "it has hind legs.",
      "its tail gets smaller.",
    ],
    correctAnswer: 0,
    tip: "An adult frog has all four legs and the tadpole's tail has been completely reabsorbed.",
  },
  {
    id: 32,
    question:
      "The diagrams show four methods of birth control: A — oral contraceptive pills; B — a coil (intra-uterine device); C — a condom; D — a diaphragm. Which one is placed in the uterus?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The coil (intra-uterine device, IUD) is inserted INTO the uterus to prevent implantation.",
    image: g12BiologyT2Q32,
  },
  {
    id: 33,
    question: "What makes tongue rolling an example of discontinuous variation?",
    options: [
      "A person can either roll a tongue or cannot.",
      "A person can roll a tongue only when he/she is young.",
      "There are many different types of tongue rollers.",
      "Tongue rolling has to be learnt.",
    ],
    correctAnswer: 0,
    tip: "Discontinuous variation has clear-cut categories with no in-between values — you can either roll your tongue or you cannot.",
  },
  {
    id: 34,
    question:
      "The diagram shows one of the stages in mitosis with chromosomes being pulled by spindle fibres towards opposite poles of the cell. Which stage is shown?",
    options: ["Anaphase", "Metaphase", "Prophase", "Telophase"],
    correctAnswer: 0,
    tip: "Anaphase is the stage where sister chromatids are pulled apart to opposite poles of the cell by spindle fibres.",
    image: g12BiologyT2Q34,
  },
  {
    id: 35,
    question: "To which phylum do algae belong?",
    options: ["Bryophyta", "Chlorophyta", "Pteridophyta", "Spermatophyta"],
    correctAnswer: 1,
    tip: "Green algae belong to the phylum Chlorophyta. Bryophyta = mosses, Pteridophyta = ferns, Spermatophyta = seed plants.",
  },
  {
    id: 36,
    question:
      "The diagram shows an experiment to compare the porosity of two soils. Water was poured through funnels containing soil A and soil B (each plugged with cotton wool) and collected in measuring cylinders. After 10 minutes, MORE water had collected from soil B than from soil A. The conclusion was that …",
    options: [
      "soil A had low porosity because it was clay soil.",
      "soil A had low porosity because it was sand soil.",
      "soil B had high porosity because it was clay soil.",
      "soil B had high porosity because it was sand soil.",
    ],
    correctAnswer: 3,
    tip: "Sandy soil has large air spaces between its particles, so water flows through quickly — high porosity. Soil B let through more water, so it must be sandy.",
    image: g12BiologyT2Q36,
  },
  {
    id: 37,
    question: "Which of the following lists of components of the ecosystem forms the abiotic component?",
    options: ["Air, fish, green plants", "Grass, water lily, water", "Water lily, soil, fish", "Water, sunlight, air"],
    correctAnswer: 3,
    tip: "Abiotic = non-living factors. Water, sunlight and air are all non-living parts of the ecosystem.",
  },
  {
    id: 38,
    question:
      "The diagram shows an ecological pyramid with levels A (hawks), B (snakes), C (rabbits) and D (grass). Which of the levels shows primary consumers?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Primary consumers eat producers (plants). Rabbits (C) eat the grass (D), so rabbits are the primary consumers.",
    image: g12BiologyT2Q38,
  },
  {
    id: 39,
    question:
      "A simplified Nitrogen Cycle shows: Plant/animal protein → A → Dead matter → B → Ammonia → C → Nitrate → D → Nitrogen (in air). Which stage depends on nitrifying bacteria?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Nitrifying bacteria oxidise ammonia into nitrates — this is stage C (Ammonia → Nitrate).",
    image: g12BiologyT2Q39,
  },
  {
    id: 40,
    question: "An adaptive feature of an organism is defined as one that helps the organism to …",
    options: ["change.", "disperse to new habitats.", "grow.", "survive and reproduce."],
    correctAnswer: 3,
    tip: "Adaptations are inherited features that improve an organism's chances of surviving and reproducing in its environment.",
  },
];

export const biologyTests: SubjectTests = createEmptyTests();
const test4: Question[] = [
  {
    id: 1,
    question: "Which of the following is not a characteristic of all living organisms?",
    options: ["Excretion", "Photosynthesis", "Reproduction", "Respiration"],
    correctAnswer: 1,
    tip: "Only green plants and some bacteria photosynthesise — it is not a characteristic of all living things.",
  },
  {
    id: 2,
    question:
      "The diagram shows a mesophyll cell of a leaf with structures 1 (chloroplast), 2 (cell wall), 3 (nucleus), 4 (vacuole) and 5 (cytoplasm). Which labelled structures are not found in liver cells of a human being?",
    options: ["1 and 2", "1 and 4", "1 and 5", "3 and 5"],
    correctAnswer: 0,
    tip: "Animal cells lack chloroplasts (1) and a cellulose cell wall (2).",
    image: g12BiologyT4Q2,
  },
  {
    id: 3,
    question:
      "The diagram shows an experiment using an inverted thistle funnel containing red ink solution covered by a selectively permeable membrane, dipped in a beaker of water. After one hour, the water in the beaker turned red. What is the most likely reason? Molecules of …",
    options: [
      "red ink move through the membrane by diffusion.",
      "red ink move through the membrane by osmosis.",
      "water move through the membrane by diffusion.",
      "water move through the membrane by osmosis.",
    ],
    correctAnswer: 0,
    tip: "Osmosis only moves water. The colour change shows ink particles passed through, which is diffusion.",
    image: g12BiologyT4Q3,
  },
  {
    id: 4,
    question:
      "A graph shows the rate of an enzyme-controlled reaction across pH 0–14, peaking around pH 7 and dropping to zero at the extremes. At which point is the enzyme not active?",
    options: ["At pH 1 and pH 13", "At pH 3 and pH 11", "At pH 5 and pH 9", "At pH 7"],
    correctAnswer: 0,
    tip: "Extreme pH values denature the enzyme — activity falls to zero at pH 1 and pH 13.",
  },
  {
    id: 5,
    question: "Which of the following food nutrients would produce a purple colour when mixed with biuret reagent?",
    options: ["Fat", "Protein", "Reducing sugar", "Starch"],
    correctAnswer: 1,
    tip: "Biuret reagent turns purple/violet in the presence of protein.",
  },
  {
    id: 6,
    question:
      "Which of the following correctly identifies disorders caused by lack of vitamin C, roughage and protein?",
    options: [
      "Anaemia / Scurvy / Marasmus",
      "Anaemia / Constipation / Marasmus",
      "Scurvy / Anaemia / Kwashiorkor",
      "Scurvy / Constipation / Kwashiorkor",
    ],
    correctAnswer: 3,
    tip: "Lack of vitamin C → scurvy; lack of roughage → constipation; lack of protein → kwashiorkor.",
  },
  {
    id: 7,
    question: "Which of the following plant nutrients keeps cell membranes healthy?",
    options: ["Boron", "Calcium", "Magnesium", "Potassium"],
    correctAnswer: 1,
    tip: "Calcium is needed for the formation and stability of cell membranes and middle lamellae.",
  },
  {
    id: 8,
    question:
      "The diagram shows a section through a leaf with cell types A (upper epidermis), B (palisade mesophyll), C (spongy mesophyll) and D (lower epidermis). Which cell type absorbs the most carbon dioxide during the day?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Palisade mesophyll cells contain the most chloroplasts and carry out most photosynthesis, so they take in the most CO₂.",
    image: g12BiologyT4Q8,
  },
  {
    id: 9,
    question:
      "The diagram shows a Rhizopus with the rounded structure at the tip of an aerial hypha labelled X. What is the part labelled X?",
    options: ["Hyphae", "Sporangiophore", "Sporangium", "Stolon"],
    correctAnswer: 2,
    tip: "The round capsule at the tip that contains the spores is the sporangium.",
    image: g12BiologyT4Q9,
  },
  {
    id: 10,
    question:
      "The dental formula of a dog is i 3/3, c 1/1, pm 4/4, m 2/3. How many molar teeth are there in the upper jaw of this dog?",
    options: ["2", "3", "4", "6"],
    correctAnswer: 0,
    tip: "The numerator of m 2/3 gives the molars per side of the upper jaw — 2 molars on each side, written as 2 in the formula.",
  },
  {
    id: 11,
    question:
      "The diagram shows part of the human digestive system with organs A (stomach), B (liver), C (pancreas) and D (small intestine). Which of the organs A, B, C or D carries out deamination of excess amino acids?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Deamination — removal of the amino group from excess amino acids — happens in the liver.",
    image: g12BiologyT4Q11,
  },
  {
    id: 12,
    question:
      "Which of the following correctly identifies parts of the respiratory system where gaseous exchange occurs in humans, fish and insects?",
    options: [
      "Alveoli / Gills / Tracheoles",
      "Alveoli / Operculum / Spiracles",
      "Nostrils / Gills / Tracheoles",
      "Nostrils / Operculum / Spiracles",
    ],
    correctAnswer: 0,
    tip: "Gas exchange occurs in alveoli (humans), gill lamellae (fish) and tracheoles (insects).",
  },
  {
    id: 13,
    question: "What is produced during anaerobic respiration in yeast? (Lactic acid / Carbon dioxide)",
    options: [
      "Lactic acid produced, CO₂ produced",
      "Lactic acid produced, CO₂ not produced",
      "Lactic acid not produced, CO₂ produced",
      "Lactic acid not produced, CO₂ not produced",
    ],
    correctAnswer: 2,
    tip: "Yeast performs alcoholic fermentation: glucose → ethanol + carbon dioxide. No lactic acid is made.",
  },
  {
    id: 14,
    question: "Which of the following is a pathogenic disease?",
    options: ["Cholera", "Coronary heart disease", "Sickle cell anaemia", "Scurvy"],
    correctAnswer: 0,
    tip: "Cholera is caused by the bacterium Vibrio cholerae — a pathogen. The others are non-infectious.",
  },
  {
    id: 15,
    question: "Which conditions of humidity, light intensity and temperature make the transpiration rate highest?",
    options: [
      "Humidity 10%, High light, 20 °C",
      "Humidity 10%, Low light, 5 °C",
      "Humidity 80%, High light, 5 °C",
      "Humidity 80%, Low light, 20 °C",
    ],
    correctAnswer: 0,
    tip: "Transpiration is fastest in low humidity, high light intensity and warm temperatures.",
  },
  {
    id: 16,
    question: "Which of the following components is responsible for the clotting of blood?",
    options: ["Erythrocytes", "Lymphocytes", "Phagocytes", "Platelets"],
    correctAnswer: 3,
    tip: "Platelets release clotting factors that trigger the formation of a blood clot.",
  },
  {
    id: 17,
    question:
      "The diagram shows the human circulatory system with vessels A, B, C and D linking the heart to the lungs and the rest of the body. Which of A, B, C or D carries oxygenated blood at lower pressure?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The pulmonary vein returns oxygenated blood from the lungs to the left atrium at low pressure.",
    image: g12BiologyT4Q17,
  },
  {
    id: 18,
    question:
      "Blood entering the kidney of a healthy person contains: Glucose 0.10%, Protein 8.00%, Urea 0.03%. What is the percentage composition of these chemicals in the urine of the healthy person?",
    options: [
      "Glucose 0.00, Protein 0.00, Urea 2.00",
      "Glucose 0.00, Protein 4.00, Urea 0.00",
      "Glucose 0.10, Protein 8.00, Urea 2.00",
      "Glucose 1.00, Protein 4.00, Urea 0.03",
    ],
    correctAnswer: 0,
    tip: "Healthy urine has no glucose and no protein; urea is concentrated to about 2%.",
  },
  {
    id: 19,
    question:
      "A 24-hour graph shows air temperature rising from 20 °C at 00:00 to ~43 °C at 12:00 then falling, while body temperature stays steady at ~38 °C. Which mechanism may help maintain body temperature between 18:00 and 24:00 hours, when air temperature is falling?",
    options: [
      "Decrease in metabolic rate",
      "Evaporation of water in the sweat",
      "Vasoconstriction of arterioles near the skin surface",
      "Vasodilation of arterioles near the skin surface",
    ],
    correctAnswer: 2,
    tip: "When the surroundings cool, vasoconstriction reduces blood flow near the skin to conserve heat.",
  },
  {
    id: 20,
    question:
      "The diagram shows endocrine glands R (pancreas), S (adrenal) and T (pituitary, near the brain) on a human figure. Which hormones are produced by glands R, S and T?",
    options: [
      "ADH / Adrenaline / Insulin",
      "ADH / Insulin / Adrenaline",
      "Insulin / Adrenaline / ADH",
      "Insulin / ADH / Adrenaline",
    ],
    correctAnswer: 2,
    tip: "Pancreas → insulin, adrenal gland → adrenaline, pituitary gland → ADH.",
    image: g12BiologyT4Q20,
  },
  {
    id: 21,
    question:
      "The diagram shows a reflex arc with structures 1 (sensory neurone), 2 (relay neurone in spinal cord), 3 (motor neurone) and 4 (receptor at the knee). What is the correct order of passage of nerve impulses after the knee is tapped?",
    options: ["1 → 2 → 3 → 4", "1 → 4 → 2 → 3", "4 → 1 → 2 → 3", "4 → 3 → 2 → 1"],
    correctAnswer: 2,
    tip: "Receptor (4) → sensory neurone (1) → relay neurone (2) → motor neurone (3) → effector.",
  },
  {
    id: 22,
    question: "What role do the ciliary muscles, suspensory ligaments and lens play to focus a nearby object?",
    options: [
      "Contract / loosen / becomes fat",
      "Contract / tighten / becomes fat",
      "Relax / loosen / becomes thin",
      "Relax / tighten / becomes thin",
    ],
    correctAnswer: 0,
    tip: "For near vision: ciliary muscles contract, suspensory ligaments slacken, and the lens bulges (fat).",
  },
  {
    id: 23,
    question: "Which of the following correctly identifies the type and composition of the skeleton of an insect?",
    options: ["Endoskeleton / Cartilage", "Endoskeleton / Keratin", "Exoskeleton / Chitin", "Exoskeleton / Protein"],
    correctAnswer: 2,
    tip: "Insects have a hard outer exoskeleton made mostly of chitin.",
  },
  {
    id: 24,
    question:
      "In a phototropism experiment, a plant shoot grew with light from one side. After two days the shoot curved towards the new light source from the right, with regions A (tip), B (just below tip on lit side), C (just below tip on shaded side) and D (base) labelled. Which region has the greatest growth after two days?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Auxin moves to the shaded side and stimulates extra elongation there, so region C (shaded side, just below tip) grows most.",
    image: g12BiologyT4Q24,
  },
  {
    id: 25,
    question: "Which environmental condition is not essential for the germination of seeds?",
    options: ["Availability of light", "Availability of oxygen", "Availability of water", "Suitable temperature"],
    correctAnswer: 0,
    tip: "Most seeds germinate without light — water, oxygen and warmth are the essentials.",
  },
  {
    id: 26,
    question:
      "A diagram shows a single bacterial cell dividing into two equal daughter cells. What type of asexual reproduction is illustrated?",
    options: ["Binary fission", "Budding", "Fragmentation", "Spore formation"],
    correctAnswer: 0,
    tip: "Splitting of one parent cell into two equal cells is binary fission, typical of bacteria.",
  },
  {
    id: 27,
    question:
      "The diagram shows a mother plant producing small plantlets along its leaves. Which statement about the plantlets is correct? They are …",
    options: [
      "genetically different from the parent plant.",
      "genetically identical to the parent plant.",
      "produced as a result of the fusion of nuclei.",
      "produced by fertilising the flowers.",
    ],
    correctAnswer: 1,
    tip: "Plantlets are produced by asexual (vegetative) reproduction, so they are clones of the parent.",
  },
  {
    id: 28,
    question:
      "Which of the following adaptations are found in a wind-pollinated flower? (Anthers / Nectary / Petals / Stigma)",
    options: [
      "Firmly attached / present / brightly coloured / inside flower",
      "Firmly attached / present / dull coloured / outside flower",
      "Loosely attached / absent / brightly coloured / inside flower",
      "Loosely attached / absent / dull coloured / outside flower",
    ],
    correctAnswer: 3,
    tip: "Wind-pollinated flowers have loose anthers (to release pollen easily), no nectary, dull petals and stigmas hanging outside the flower to catch pollen.",
  },
  {
    id: 29,
    question: "Which method of fruit dispersal occurs in coconut plants?",
    options: ["Animal", "Self", "Water", "Wind"],
    correctAnswer: 2,
    tip: "Coconuts have a fibrous, buoyant husk and float on water — they are dispersed by water.",
  },
  {
    id: 30,
    question:
      "The diagram shows the male reproductive system with parts A (sperm duct), B (testis), C (urethra) and D (penis). Which part produces testosterone?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The testes produce both sperm and the hormone testosterone.",
    image: g12BiologyT4Q30,
  },
  {
    id: 31,
    question: "Which structure is involved in the transfer of dissolved nutrients from the mother to the foetus?",
    options: ["Kidney", "Liver", "Placenta", "Stomach"],
    correctAnswer: 2,
    tip: "The placenta is the exchange organ between mother and foetus.",
  },
  {
    id: 32,
    question:
      "Which of the following methods of contraception works by inhibiting the production of Follicle Stimulating Hormone (FSH) in the pituitary gland?",
    options: ["Condoms", "Contraceptive pill", "Intra-uterine Device", "Vasectomy"],
    correctAnswer: 1,
    tip: "The contraceptive pill contains hormones that suppress FSH release, preventing ovulation.",
  },
  {
    id: 33,
    question: "Which of the following characteristics is an example of discontinuous variation in humans?",
    options: ["Height", "Length of foot", "Tongue rolling", "Weight"],
    correctAnswer: 2,
    tip: "Tongue rolling has only two clear categories (can or cannot) — discontinuous. Height and weight vary continuously.",
  },
  {
    id: 34,
    question:
      "A couple produces a child who is an albino. Albinism is a condition in which skin pigment is not made. What is the chance that their next child will be an albino?",
    options: ["0%", "25%", "50%", "100%"],
    correctAnswer: 1,
    tip: "Both parents must be carriers (Aa × Aa) to have an albino child, giving a 1 in 4 (25%) chance for each future child.",
  },
  {
    id: 35,
    question:
      "A table shows four vertebrates and whether they have scaly skin, hair, four limbs and a tail. Which row identifies a reptile? A: scales✓, hair✗, limbs✓, tail✓; B: scales✓, hair✓, limbs✗, tail✓; C: scales✗, hair✗, limbs✓, tail✗; D: scales✗, hair✓, limbs✓, tail✓.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Reptiles have dry scaly skin, no hair, four limbs (in most) and a tail — that matches A.",
  },
  {
    id: 36,
    question: "Which of the following soil types has the highest nutrient content?",
    options: ["Clay", "Loam", "Sand", "Silt"],
    correctAnswer: 1,
    tip: "Loam is a balanced mixture rich in humus, holding the most plant nutrients.",
  },
  {
    id: 37,
    question:
      "The diagram shows a pyramid of biomass for an ecosystem with levels P (top), Q, R and S (bottom, producers). Which organisms are carnivores?",
    options: ["P and Q", "P and R", "Q and R", "R and S"],
    correctAnswer: 0,
    tip: "P (tertiary) and Q (secondary) feed on other animals, so they are the carnivores.",
    image: g12BiologyT4Q37,
  },
  {
    id: 38,
    question:
      "The diagram shows the carbon cycle linking animals, decomposers in soil, green plants, fossil fuels and CO₂ in air. Letter X represents the arrow from green plants taking in CO₂ from the air. What process is represented by letter X?",
    options: ["Combustion", "Feeding", "Photosynthesis", "Respiration"],
    correctAnswer: 2,
    tip: "Plants absorb CO₂ from the air during photosynthesis.",
    image: g12BiologyT4Q38,
  },
  {
    id: 39,
    question:
      "Over-use of fertiliser near water bodies causes eutrophication, leading to: 1 algae bloom, 2 fish dying, 3 massive growth of bacteria, 4 oxygen depletion. In which order do these events occur?",
    options: ["1 → 3 → 4 → 2", "1 → 4 → 3 → 2", "3 → 4 → 2 → 1", "4 → 1 → 2 → 3"],
    correctAnswer: 0,
    tip: "Algae bloom first, die and are decomposed by bacteria (3) which use up oxygen (4); fish then die (2).",
  },
  {
    id: 40,
    question: "Which activity will be least likely to lead to the extinction of species?",
    options: ["Conservation", "Deforestation", "Use of herbicides", "Use of pesticides"],
    correctAnswer: 0,
    tip: "Conservation protects habitats and species, reducing the risk of extinction.",
  },
];

// Source: ECZ 2021 Biology 5090/1 Paper 1 (Multiple Choice)
const test3: Question[] = [
  {
    id: 1,
    question: "Which of the following are characteristics of all living things?",
    options: [
      "Egestion and excretion",
      "Egestion and nutrition",
      "Excretion and nutrition",
      "Nutrition and photosynthesis",
    ],
    correctAnswer: 2,
    tip: "All living things excrete waste and need nutrition. Egestion (removal of undigested food) and photosynthesis are not universal.",
  },
  {
    id: 2,
    question:
      "The diagram shows a detailed structure of an animal cell. Which of the labelled parts modifies and transports proteins from the site of synthesis to the site of reaction?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The Golgi apparatus (B – stack of flattened sacs) modifies, packages and transports proteins.",
    image: g12BiologyT3Q2,
  },
  {
    id: 3,
    question:
      "A learner set up an experiment with Visking tubing containing salt solution placed in distilled water. After 12 hours the tubing had swollen. What is the correct explanation? The visking tubing ...",
    options: [
      "became smaller because it is porous.",
      "lost water due to evaporation.",
      "shrank because salt solution moved into it.",
      "gained water because water molecules moved into it by osmosis.",
    ],
    correctAnswer: 3,
    tip: "Water moves by osmosis from the dilute outside (distilled water) into the more concentrated salt solution inside the tubing, so it swells.",
    image: g12BiologyT3Q3,
  },
  {
    id: 4,
    question:
      "The table shows the conditions in four test tubes containing equal amounts of starch and salivary amylase. In which test tube would the starch be broken down fastest? (A: pH 2, 27°C; B: pH 2, 37°C; C: pH 7, 27°C; D: pH 7, 37°C)",
    options: ["A (pH 2, 27°C)", "B (pH 2, 37°C)", "C (pH 7, 27°C)", "D (pH 7, 37°C)"],
    correctAnswer: 3,
    tip: "Salivary amylase works best at neutral pH (≈7) and body temperature (37°C).",
  },
  {
    id: 5,
    question:
      "Four food samples were tested with biuret (purple = protein), Benedict's (brick-red = reducing sugar) and ethanol (white emulsion = fat). Which sample contained proteins AND reducing sugars?",
    options: [
      "A: purple, no brick-red, white emulsion",
      "B: purple, brick-red, no emulsion",
      "C: only white emulsion",
      "D: only brick-red",
    ],
    correctAnswer: 1,
    tip: "Sample B is purple (protein present) AND brick-red (reducing sugar present).",
    image: g12BiologyT3Q5,
  },
  {
    id: 6,
    question:
      "A child is fed on beef, oily fish, cheese and water only. Which nutrient would be in low levels in this diet?",
    options: ["Calcium", "Iron", "Vitamin C", "Vitamin D"],
    correctAnswer: 2,
    tip: "Vitamin C comes mainly from fresh fruits and vegetables, none of which are in the diet.",
  },
  {
    id: 7,
    question:
      "Which of the following plant nutrients is essential for germination of pollen grains and growth of pollen tubes?",
    options: ["Boron", "Calcium", "Iron", "Zinc"],
    correctAnswer: 0,
    tip: "Boron is essential for pollen germination and pollen tube growth.",
  },
  {
    id: 8,
    question:
      "The figure shows a diagrammatic summary of photosynthesis. Name the process X (light reaction splitting water), reactant Y and product Z.",
    options: [
      "Condensation; Glucose; ADP",
      "Condensation; Water; Glucose",
      "Photolysis; Carbon dioxide; Glucose",
      "Photolysis; Carbon dioxide; Starch",
    ],
    correctAnswer: 2,
    tip: "Photolysis splits water in the light stage; CO₂ enters the dark stage and glucose is the product.",
    image: g12BiologyT3Q8,
  },
  {
    id: 9,
    question: "The diagram shows the structure of Bread Mould (Rhizopus). Which part releases digestive enzymes?",
    options: ["A (sporangium)", "B (stolon)", "C (rhizoid)", "D (sporangiophore)"],
    correctAnswer: 2,
    tip: "Rhizoids penetrate the substrate and release digestive enzymes for extracellular digestion.",
    image: g12BiologyT3Q9,
  },
  {
    id: 10,
    question: "Which of the following is a dental formula of a dog?",
    options: [
      "i 0/3, c 0/1, pm 3/3, m 3/3",
      "i 1/1, c 0/0, pm 0/0, m 3/3",
      "i 3/3, c 1/1, pm 4/4, m 2/3",
      "i 2/2, c 1/1, pm 2/2, m 3/3",
    ],
    correctAnswer: 2,
    tip: "A dog (carnivore) has the formula i 3/3, c 1/1, pm 4/4, m 2/3 = 42 teeth.",
  },
  {
    id: 11,
    question:
      "The diagram shows the human alimentary canal. In which of the labelled parts does peristalsis take place?",
    options: ["1 and 2", "2 and 3", "3 and 4", "4 and 2"],
    correctAnswer: 1,
    tip: "Peristalsis occurs along the oesophagus and the small intestine (parts 2 and 3).",
    image: g12BiologyT3Q11,
  },
  {
    id: 12,
    question:
      "Which of the following chemicals from cigarette smoke reduces the amount of oxygen carried in the blood?",
    options: ["Carbon monoxide", "Nicotine", "Sulphur dioxide", "Tar"],
    correctAnswer: 0,
    tip: "Carbon monoxide binds irreversibly to haemoglobin, reducing its oxygen-carrying capacity.",
  },
  {
    id: 13,
    question:
      "Apparatus is set up to investigate CO₂ produced by respiring insects. Air is first passed through KOH (removes CO₂), then through Tube X (lime water), then over insects, then through Tube Y (lime water). What changes occur to the lime water in tubes X and Y after five minutes?",
    options: ["X cloudy; Y cloudy", "X cloudy; Y no change", "X no change; Y cloudy", "X no change; Y no change"],
    correctAnswer: 2,
    tip: "KOH removes all CO₂ before X (so X stays clear); insects respire and release CO₂, turning Y cloudy.",
    image: g12BiologyT3Q13,
  },
  {
    id: 14,
    question: "Which of the following is NOT a safe sexual practice against HIV and AIDS?",
    options: [
      "Abstinence",
      "Consistent and correct use of condoms",
      "Use of contraceptive pills",
      "Voluntary Counselling and Testing services",
    ],
    correctAnswer: 2,
    tip: "Contraceptive pills prevent pregnancy but do NOT protect against HIV transmission.",
  },
  {
    id: 15,
    question:
      "The diagram shows a sketch of the uptake of water by a plant. What processes are represented by arrows 1 (soil → root hair), 2 (root → xylem), 3 (xylem → leaf, pulled by transpiration) and 4 (leaf → air)?",
    options: [
      "1 Diffusion, 2 Osmosis, 3 Transpiration pull, 4 Diffusion",
      "1 Diffusion, 2 Transpiration pull, 3 Osmosis, 4 Diffusion",
      "1 Osmosis, 2 Osmosis, 3 Transpiration pull, 4 Diffusion",
      "1 Osmosis, 2 Transpiration pull, 3 Osmosis, 4 Diffusion",
    ],
    correctAnswer: 2,
    tip: "Water enters root hairs and crosses root cells by osmosis, is pulled up the xylem by transpiration pull, and escapes from leaves by diffusion (transpiration).",
    image: g12BiologyT3Q15,
  },
  {
    id: 16,
    question: "Which donor would safely donate blood to a patient with blood group O? A person with blood group ...",
    options: ["A", "B", "AB", "O"],
    correctAnswer: 3,
    tip: "Group O has no A or B antigens, so it is the only safe donor for a group O recipient.",
  },
  {
    id: 17,
    question:
      "The diagram shows a longitudinal section through a human heart. What are chambers X (top right), Y (bottom left) and blood vessel Z (large vessel leaving Y)?",
    options: [
      "X Left atrium; Y Right ventricle; Z Aorta",
      "X Left ventricle; Y Right atrium; Z Aorta",
      "X Right atrium; Y Left ventricle; Z Aorta",
      "X Right ventricle; Y Left atrium; Z Pulmonary artery",
    ],
    correctAnswer: 2,
    tip: "Right atrium (top right) receives deoxygenated blood; left ventricle (bottom left) pumps oxygenated blood into the aorta.",
    image: g12BiologyT3Q17,
  },
  {
    id: 18,
    question:
      "The diagram shows a kidney with the renal artery, renal vein, ureter and a part X labelled inside. What is the name of part X?",
    options: ["Cortex", "Medulla", "Pelvis", "Ureter"],
    correctAnswer: 2,
    tip: "The pelvis is the central funnel-shaped cavity inside the kidney that collects urine before it enters the ureter.",
    image: g12BiologyT3Q18,
  },
  {
    id: 19,
    question:
      "The diagram shows human skin with nerve endings, capillaries, X and fat labelled. What is the name of structure X?",
    options: ["Adipose tissue", "Dermis", "Epidermis", "Sweat gland"],
    correctAnswer: 3,
    tip: "The coiled structure within the dermis that releases fluid onto the skin surface is the sweat gland.",
    image: g12BiologyT3Q19,
  },
  {
    id: 20,
    question: "Compared to a hormone, a nerve impulse generally has ...",
    options: [
      "A long lasting response: Yes; widespread: No; fast: Yes",
      "A long lasting response: No; widespread: No; fast: Yes",
      "A long lasting response: Yes; widespread: Yes; fast: No",
      "A long lasting response: No; widespread: Yes; fast: No",
    ],
    correctAnswer: 1,
    tip: "Nerve impulses are fast and short-lived, and act on a specific (not widespread) target.",
  },
  {
    id: 21,
    question:
      "A girl accidentally touches a very hot object and immediately pulls her hand away. In this reflex action, what is the effector?",
    options: ["A heat receptor in her hand", "A motor neurone", "A muscle in her arm", "The spinal cord"],
    correctAnswer: 2,
    tip: "The effector is the structure that produces the response — here, the arm muscle that pulls the hand away.",
  },
  {
    id: 22,
    question:
      "The diagram shows a human ear. What is the function of the part labelled X (auditory/Eustachian tube linking middle ear to throat)?",
    options: [
      "Amplify sound.",
      "Collect sound waves and pass them to the external auditory canal.",
      "Contains hairs that trap particles entering the ear.",
      "Equalise pressure between the middle ear and the atmosphere.",
    ],
    correctAnswer: 3,
    tip: "The Eustachian tube equalises air pressure between the middle ear and the atmosphere.",
    image: g12BiologyT3Q22,
  },
  {
    id: 23,
    question: "Which of the following actions straighten the arm at the elbow joint?",
    options: [
      "Biceps contract; Triceps contract",
      "Biceps contract; Triceps relax",
      "Biceps relax; Triceps contract",
      "Biceps relax; Triceps relax",
    ],
    correctAnswer: 2,
    tip: "To straighten (extend) the arm the triceps contracts and the biceps relaxes — they are antagonistic muscles.",
  },
  {
    id: 24,
    question: "Which of the following indicates primary growth in plants?",
    options: [
      "Differentiation of cells in the cortex.",
      "Formation of secondary xylem and phloem.",
      "Increase in the length of the stem.",
      "Increase in the size of the girth.",
    ],
    correctAnswer: 2,
    tip: "Primary growth is the increase in length of stems and roots from apical meristems.",
  },
  {
    id: 25,
    question: "Which of the following is NOT a condition necessary for seed germination?",
    options: ["Oxygen", "Soil", "Suitable temperature", "Water"],
    correctAnswer: 1,
    tip: "Seeds can germinate without soil — they only need water, oxygen and a suitable temperature.",
  },
  {
    id: 26,
    question:
      "A bean seed was germinated in the dark. Diagram P shows it horizontal at the start; diagram Q shows after two days, the shoot has bent upwards and the root has bent downwards. What response is exhibited by the root and shoot in diagram Q?",
    options: [
      "Roots negative geotropism; Shoots negative geotropism",
      "Roots negative phototropism; Shoots positive phototropism",
      "Roots positive geotropism; Shoots negative geotropism",
      "Roots positive phototropism; Shoots negative phototropism",
    ],
    correctAnswer: 2,
    tip: "In the dark, gravity is the only stimulus: roots grow towards gravity (positive geotropism), shoots grow away from gravity (negative geotropism).",
    image: g12BiologyT3Q26,
  },
  {
    id: 27,
    question:
      "Which of the following methods of asexual reproduction are unique to amoeba, yeast and fungi (in that order)?",
    options: [
      "Amoeba: Binary fission; Yeast: Budding; Fungi: Spore formation",
      "Amoeba: Binary fission; Yeast: Spore formation; Fungi: Budding",
      "Amoeba: Budding; Yeast: Binary fission; Fungi: Spore formation",
      "Amoeba: Spore formation; Yeast: Budding; Fungi: Budding",
    ],
    correctAnswer: 0,
    tip: "Amoeba reproduces by binary fission, yeast by budding, and fungi (e.g. moulds) by spore formation.",
  },
  {
    id: 28,
    question:
      "Name the vegetative structures labelled X (onion-like), Y (underground horizontal stem) and Z (swollen underground stem base).",
    options: [
      "X Bulb; Y Rhizome; Z Corm",
      "X Bulb; Y Rhizome; Z Tuber",
      "X Corm; Y Sucker; Z Rhizome",
      "X Tuber; Y Runner; Z Rhizome",
    ],
    correctAnswer: 0,
    tip: "X is a bulb (onion), Y is a rhizome (horizontal underground stem), Z is a corm (short swollen vertical stem).",
    image: g12BiologyT3Q28,
  },
  {
    id: 29,
    question:
      "The diagram shows a process in plant reproduction in which pollen is transferred from the anther to the stigma. What process is represented by letter X?",
    options: ["Fertilisation", "Fruit dispersal", "Pollination", "Seed dispersal"],
    correctAnswer: 2,
    tip: "Transfer of pollen from anther to stigma is pollination.",
    image: g12BiologyT3Q29,
  },
  {
    id: 30,
    question:
      "The diagram shows a winged fruit with pericarp, seed and remains of style/stigma and sepals. What mode of dispersal is illustrated?",
    options: ["Animal", "Self", "Water", "Wind"],
    correctAnswer: 3,
    tip: "Wing-like extensions on the fruit are an adaptation for wind dispersal.",
    image: g12BiologyT3Q30,
  },
  {
    id: 31,
    question:
      "Which route does an unfertilised ovum follow through the female reproductive system after it has been released from the ovary?",
    options: [
      "Oviduct → Uterus → Vagina",
      "Oviduct → Vagina → Uterus",
      "Uterus → Oviduct → Vagina",
      "Uterus → Vagina → Oviduct",
    ],
    correctAnswer: 0,
    tip: "After ovulation the ovum travels: oviduct (fallopian tube) → uterus → vagina.",
  },
  {
    id: 32,
    question:
      "The diagrams show the side view of the male and female reproductive systems. Parts 1 and 2 are oviducts (female); 3 and 4 are sperm ducts (male). Which two parts are cut and tied during tubal ligation and vasectomy?",
    options: ["1 and 3", "1 and 4", "2 and 3", "2 and 4"],
    correctAnswer: 0,
    tip: "Tubal ligation cuts/ties the oviduct (1) and vasectomy cuts/ties the sperm duct (3).",
    image: g12BiologyT3Q32,
  },
  {
    id: 33,
    question: "Which of the following correctly identifies examples of continuous and discontinuous variation?",
    options: [
      "Continuous: Blood groups; Discontinuous: Tongue rolling",
      "Continuous: Flower colour in peas; Discontinuous: Intelligence",
      "Continuous: Height in humans; Discontinuous: Eye colour",
      "Continuous: Sex in humans; Discontinuous: Skin colour",
    ],
    correctAnswer: 2,
    tip: "Height shows a continuous range of values; eye colour falls into distinct categories (discontinuous).",
  },
  {
    id: 34,
    question:
      "The diagram shows chromosomes lined up at the equator of the cell with spindle fibres attached. What stage of mitosis is illustrated?",
    options: ["Anaphase", "Metaphase", "Prophase", "Telophase"],
    correctAnswer: 1,
    tip: "Chromosomes lined up along the cell equator is the defining feature of metaphase.",
    image: g12BiologyT3Q34,
  },
  {
    id: 35,
    question:
      "The pedigree shows a family with haemophilia. Individuals A and the second son in generation III are affected males; B is an unaffected female with an affected father (A). Which person is a carrier for haemophilia?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Haemophilia is X-linked recessive. B has an affected father (A), so she must have inherited his X^h — making her a carrier (X^H X^h).",
    image: g12BiologyT3Q35,
  },
  {
    id: 36,
    question: "Which of the following types of soil has the highest distribution of earthworms?",
    options: ["Clay soil", "Loam soil", "Sand soil", "Silt soil"],
    correctAnswer: 1,
    tip: "Loam soil has balanced moisture, air spaces and humus, supporting the highest earthworm population.",
  },
  {
    id: 37,
    question:
      "The diagram shows a pyramid of biomass with levels P (base, largest) → Q → R → S (apex, smallest). Which organisms are carnivores?",
    options: ["P and Q", "P and R", "Q and R", "R and S"],
    correctAnswer: 3,
    tip: "P = producers, Q = primary consumers (herbivores), R and S = secondary and tertiary consumers (carnivores).",
    image: g12BiologyT3Q37,
  },
  {
    id: 38,
    question:
      "Rabbits are primary consumers. The figure shows changes in the rabbit population after a small number was released on an island where none had previously lived: A (rapid growth), B (slowing), C (plateau), D (decline). Which stage shows when the birth rate was equal to the death rate?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "At the plateau (C) the population is stable, meaning birth rate equals death rate (carrying capacity).",
    image: g12BiologyT3Q38,
  },
  {
    id: 39,
    question:
      "The diagram shows part of the carbon cycle. Arrow A goes from dead matter to CO₂; B from animal compounds to CO₂; C from CO₂ to plant compounds; D from plant compounds to dead matter. Which letter represents photosynthesis?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Photosynthesis fixes CO₂ from the air into plant compounds — arrow C.",
    image: g12BiologyT3Q39,
  },
  {
    id: 40,
    question: "Which effect is least likely to occur as a result of deforestation?",
    options: [
      "A decrease in biodiversity.",
      "An increase in soil erosion.",
      "An increase in the level of carbon dioxide in the atmosphere.",
      "An increased risk of flooding.",
    ],
    correctAnswer: 3,
    tip: "Deforestation strongly reduces biodiversity, increases erosion and increases atmospheric CO₂. Increased flooding does occur but is the least direct/immediate consequence among these.",
  },
];

biologyTests[0] = test1;
biologyTests[1] = test2;
biologyTests[2] = test3;


const test5: Question[] = [
  {
    id: 1,
    question:
      "A learner walking along a road saw an object under a tree. When she touched it, it rolled over and divided into two. Which characteristics of living organisms did the object show?",
    options: [
      "Excretion, movement, nutrition",
      "Growth, reproduction, sensitivity",
      "Movement, reproduction, respiration",
      "Movement, reproduction, sensitivity",
    ],
    correctAnswer: 3,
    tip: "Touching → reacted (sensitivity), rolled over (movement), split in two (reproduction).",
  },
  {
    id: 2,
    question:
      "Which of the following correctly lists the path followed by a light beam from the mirror to a viewer of the specimen under a microscope?",
    options: [
      "Specimen → objective lens → barrel → eye piece",
      "Specimen → eye piece → barrel → objective lens",
      "Specimen → barrel → objective lens → eye piece",
      "Eye piece → Specimen → objective lens → barrel",
    ],
    correctAnswer: 0,
    tip: "Light passes through the specimen, then the objective lens, up the barrel, and finally through the eye piece to the viewer.",
  },
  {
    id: 3,
    question:
      "The diagram shows a section through a leaf with parts S (whole leaf), P (palisade layer), R (single cell) and Q (chloroplast). Which structure is an organ and which one is a tissue?",
    options: ["Organ S, Tissue P", "Organ P, Tissue R", "Organ S, Tissue R", "Organ Q, Tissue S"],
    correctAnswer: 0,
    tip: "The whole leaf (S) is an organ; the palisade layer (P) is a tissue made of similar cells.",
    image: g12BiologyT5Q3,
  },
  {
    id: 4,
    question:
      "Four test tubes contain equal quantities of starch and salivary amylase. 1: pH 2, 27°C; 2: pH 2, 37°C; 3: pH 7, 27°C; 4: pH 7, 37°C. In which test tube would the starch be broken down fastest?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 3,
    tip: "Salivary amylase works best at body temperature (37°C) and neutral pH (7).",
  },
  {
    id: 5,
    question:
      "Which meal is most likely to stimulate peristalsis along the alimentary canal? A: carbs 18, fat 12, roughage 8, protein 25; B: 30/32/2/12; C: 38/4/22/10; D: 40/15/10/5.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Roughage (fibre) stimulates peristalsis. Meal C has the highest roughage content (22 g/100 g).",
    image: g12BiologyT5Q5,
  },
  {
    id: 6,
    question: "Which of the following deficiency diseases results from consuming foods that lack iodine?",
    options: ["Anaemia", "Goitre", "Kwashiorkor", "Marasmus"],
    correctAnswer: 1,
    tip: "Iodine is needed by the thyroid gland; lack of it causes goitre (swollen thyroid).",
  },
  {
    id: 7,
    question: "Which macronutrient stimulates growth of flowers and fruits in plants?",
    options: ["Magnesium", "Nitrogen", "Phosphorus", "Potassium"],
    correctAnswer: 3,
    tip: "Potassium promotes flowering, fruiting and overall plant vigour.",
  },
  {
    id: 8,
    question:
      "The diagram shows a variegated leaf with regions: 1 (white area exposed to light), 2 (green area exposed to light), 3 (green area covered by black paper) and 4 (green area showing through a hole in the black paper). After 4 hours of light, the leaf was tested for starch. Which regions will turn blue-black?",
    options: ["1 and 2", "1 and 3", "2 and 4", "2 and 3"],
    correctAnswer: 2,
    tip: "Starch forms only where there is chlorophyll (green) AND light. That is regions 2 and 4.",
    image: g12BiologyT5Q8,
  },
  {
    id: 9,
    question:
      "The dental formula of a dog is i 3/3, c 1/1, pm 4/4, m 2/3. How many incisors are in the mouth of this dog?",
    options: ["6", "8", "12", "16"],
    correctAnswer: 2,
    tip: "i 3/3 means 3 incisors per side, top and bottom: 3 × 2 × 2 = 12.",
  },
  {
    id: 10,
    question:
      "The diagram shows part of the human digestive system with Q labelling the duodenum. What digestive juice flows through the part labelled Q?",
    options: ["Bile", "Gastric juice", "Intestinal juice", "Pancreatic juice"],
    correctAnswer: 0,
    tip: "Bile from the liver/gall bladder enters the duodenum through the bile duct.",
    image: g12BiologyT5Q10,
  },
  {
    id: 11,
    question: "Which of the following can be caused by excessive drinking of alcohol?",
    options: ["Emphysema", "Cirrhosis", "Hepatitis", "Hepatomegaly"],
    correctAnswer: 1,
    tip: "Long-term heavy drinking damages liver cells, producing scar tissue — cirrhosis.",
  },
  {
    id: 12,
    question:
      "What happens to the floor of the mouth and operculum during inspiration in fish? (Floor of mouth / Mouth / Operculum)",
    options: [
      "Lowered / Open / Closed",
      "Lowered / Closed / Closed",
      "Raised / Closed / Open",
      "Raised / Open / Closed",
    ],
    correctAnswer: 0,
    tip: "During inspiration, the floor of the mouth lowers, the mouth opens to draw water in, and the operculum stays closed.",
  },
  {
    id: 13,
    question:
      "Four sterilised flasks were set up: A yeast and water at 4°C, B yeast and water at 20°C, C yeast, sugar and water at 4°C, D yeast, sugar and water at 20°C. Which flask will contain the most alcohol after several hours?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Yeast needs sugar (substrate) and a warm temperature for fermentation. Flask D has both.",
    image: g12BiologyT5Q13,
  },
  {
    id: 14,
    question:
      "Children under five years receive immunisation against measles. What type of immunity do they develop after an injection against measles?",
    options: ["Active/Natural", "Active/Artificial", "Passive/Natural", "Passive/Artificial"],
    correctAnswer: 1,
    tip: "Vaccination introduces antigens artificially; the body then makes its own antibodies — active artificial immunity.",
  },
  {
    id: 15,
    question: "How is the rate of transpiration affected by decreasing temperature and decreasing light intensity?",
    options: ["Slower / Slower", "Slower / Faster", "Faster / Slower", "Faster / Faster"],
    correctAnswer: 0,
    tip: "Lower temperature reduces evaporation; lower light closes stomata. Both slow transpiration.",
  },
  {
    id: 16,
    question:
      "The diagram shows four mammalian blood cells labelled A (red blood cell), B (lymphocyte), C (phagocyte) and D (platelet). Which of the above cells breaks down pathogens?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Phagocytes engulf and digest (break down) pathogens by phagocytosis.",
    image: g12BiologyT5Q16,
  },
  {
    id: 17,
    question:
      "A longitudinal section of the heart shows valves 1 and 2 (atrioventricular) and 3 and 4 (semilunar). Which valves are open and which are closed during atrial systole?",
    options: [
      "Valves 1 and 2 closed, 3 and 4 closed",
      "Valves 1 and 2 closed, 3 and 4 open",
      "Valves 1 and 2 open, 3 and 4 closed",
      "Valves 1 and 2 open, 3 and 4 open",
    ],
    correctAnswer: 2,
    tip: "During atrial systole, blood flows into the ventricles: AV valves (1,2) open, semilunar valves (3,4) stay closed.",
    image: g12BiologyT5Q17,
  },
  {
    id: 18,
    question:
      "The diagram shows the human excretory system with X labelling the bladder. What is the function of part labelled X?",
    options: ["To excrete urea", "To produce urea", "To produce urine", "To store urine"],
    correctAnswer: 3,
    tip: "The bladder stores urine until it is released through the urethra.",
    image: g12BiologyT5Q18,
  },
  {
    id: 19,
    question:
      "How does the skin maintain the body temperature at 37°C when a person moves from a hot to a cold environment?",
    options: [
      "Arterioles in skin constrict",
      "Arterioles in skin dilate",
      "Hairs on skin lie flat",
      "Skin produces sweat",
    ],
    correctAnswer: 0,
    tip: "In the cold, vasoconstriction reduces blood flow near the skin to conserve body heat.",
  },
  {
    id: 20,
    question:
      "The diagram shows a reflex arc with a hand near a candle, with parts P (receptor in skin), Q (effector muscle), R (sensory neurone) and S (relay/motor neurones in spinal cord). Which is the correct sequence of the electrical impulse?",
    options: ["P → Q → R → S", "P → R → S → Q", "Q → R → S → P", "Q → S → P → R"],
    correctAnswer: 1,
    tip: "Receptor (P) → sensory neurone (R) → CNS / motor neurone (S) → effector (Q).",
    image: g12BiologyT5Q20,
  },
  {
    id: 21,
    question:
      "The following are drugs used or abused: 1 alcohol, 2 heroin, 3 penicillin. Which of these may be addictive, leading to possible withdrawal symptoms when use is stopped?",
    options: ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"],
    correctAnswer: 1,
    tip: "Alcohol and heroin cause dependence and withdrawal; penicillin (an antibiotic) does not.",
  },
  {
    id: 22,
    question:
      "The diagram shows a section through a human eye with parts A (sclera), B (ciliary body), C (lens) and D (retina). Which structure contains the muscles which contract to produce a focused image on the retina?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The ciliary body contains the ciliary muscles that change the lens shape (accommodation) to focus light on the retina.",
    image: g12BiologyT5Q22,
  },
  {
    id: 23,
    question: "How are bones and cartilage similar?",
    options: [
      "They are both rigid.",
      "They both act as shock absorbers.",
      "They both contain living cells.",
      "They both produce red blood cells.",
    ],
    correctAnswer: 2,
    tip: "Both are living connective tissues containing living cells (osteocytes / chondrocytes).",
  },
  {
    id: 24,
    question:
      "Three shoots are exposed to light from one direction: P (intact), Q (tip cut off) and R (tip covered with opaque cap). How will these plant shoots look after 48 hours?",
    options: [
      "P bends towards light, Q stays straight, R stays straight",
      "P stays straight, Q bends, R bends",
      "All three bend towards the light",
      "None of them bend",
    ],
    correctAnswer: 0,
    tip: "Auxin is made in the tip. Only the intact shoot (P) detects light and bends; Q and R cannot respond.",
    image: g12BiologyT5Q24,
  },
  {
    id: 25,
    question:
      "The diagram shows parts of a shoot tip with regions A (apical meristem), B (zone of cell elongation), C (zone of cell maturation) and D (older stem). Which region is the area of cell elongation?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Just behind the meristem, cells absorb water and stretch — this is the elongation zone (B).",
    image: g12BiologyT5Q25,
  },
  {
    id: 26,
    question:
      "Diagrams show germination of broad bean, mustard and sunflower seeds. What type of germination is shown by these seedlings?",
    options: [
      "Hypogeal / Epigeal / Epigeal",
      "Hypogeal / Hypogeal / Epigeal",
      "Epigeal / Epigeal / Hypogeal",
      "Epigeal / Hypogeal / Epigeal",
    ],
    correctAnswer: 0,
    tip: "Broad bean keeps cotyledons underground (hypogeal); mustard and sunflower lift them above ground (epigeal).",
    image: g12BiologyT5Q26,
  },
  {
    id: 27,
    question: "Which of the following is a disadvantage of vegetative propagation?",
    options: [
      "Plants are usually overcrowded.",
      "Plants are widely dispersed.",
      "Plant population grows slowly.",
      "Varieties of useful plants are kept unchanged.",
    ],
    correctAnswer: 0,
    tip: "Plantlets grow close to the parent, so they often crowd one another and compete for resources.",
  },
  {
    id: 28,
    question:
      "A marigold fruit (magnified ×3) shows a slim body with a tuft of light, hair-like structures (parachute) at the top. The above fruit is dispersed by …",
    image: g12BiologyT5Q28,
    options: ["animals.", "self mechanism.", "water.", "wind."],
    correctAnswer: 3,
    tip: "Light fruits with feathery parachutes are carried by the wind.",
  },
  {
    id: 29,
    question:
      "The diagram shows the male reproductive and urinary systems. Which structure produces the fluid part of semen?",
    options: ["Testis", "Epididymis", "Seminal vesicle", "Urethra"],
    correctAnswer: 2,
    tip: "Seminal vesicles (with the prostate) produce the fluid that nourishes and carries the sperm.",
    image: g12BiologyT5Q29,
  },
  {
    id: 30,
    question:
      "A natural method of birth control assumes sperm live for 3 days, ovulation happens between days 13–15, and ova live for 36 hours. On which day of the cycle would sexual intercourse not result in pregnancy?",
    options: ["Day 7", "Day 10", "Day 12", "Day 16"],
    correctAnswer: 0,
    tip: "Day 7 is far from the fertile window (sperm from day 10+ could meet an egg; ova survive until ~day 16). Day 7 is safe.",
  },
  {
    id: 31,
    question:
      "The diagram shows a foetus in the uterus with structures R, Q, P and S, where P is the placenta and Q is the umbilical cord. Which structures remove excretory products from the foetus?",
    options: ["P and Q", "Q and R", "R and S", "S and P"],
    correctAnswer: 0,
    tip: "Wastes pass from the foetus via the umbilical cord (Q) to the placenta (P), where they cross into the mother's blood.",
    image: g12BiologyT5Q31,
  },
  {
    id: 32,
    question: "What is the advantage of male circumcision?",
    options: [
      "It prevents the spread of HIV and other STIs.",
      "It helps the man enjoy sex more.",
      "It prevents spread of cervical cancer.",
      "It helps the female enjoy sex more.",
    ],
    correctAnswer: 0,
    tip: "Circumcision reduces the risk of contracting HIV and several other sexually transmitted infections.",
  },
  {
    id: 33,
    question:
      "Examples of human characteristics: 1 Eye colour, 2 Height, 3 Body mass, 4 Sex. Which are examples of continuous variation?",
    options: ["1 and 2", "1 and 3", "2 and 3", "3 and 4"],
    correctAnswer: 2,
    tip: "Continuous variation shows a range of values — height and body mass. Eye colour and sex fall into discrete categories.",
  },
  {
    id: 34,
    question:
      "A woman has blood group O. Her child also has blood group O. What is the likely blood group genotype of the father?",
    options: ["IᴬIᴬ", "IᴮIᴮ", "IᴬIᴮ", "IᴬIᴼ"],
    correctAnswer: 3,
    tip: "The child is OO, so each parent supplied an O allele. The father must carry at least one O allele — IᴬIᴼ fits.",
  },
  {
    id: 35,
    question: "Which of the following is the smallest and most commonly used taxon in classifying living organisms?",
    options: ["Class", "Kingdom", "Phylum", "Species"],
    correctAnswer: 3,
    tip: "Species is the smallest taxonomic unit — members can interbreed to produce fertile offspring.",
  },
  {
    id: 36,
    question:
      "An experiment investigated drainage of four soil samples using equal amounts of soil and water. The water collected was: 1 low, 2 high, 3 very low, 4 medium. Which soil sample was clay?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 2,
    tip: "Clay has the smallest particles and the slowest drainage, so the least water passes through — sample 3.",
    image: g12BiologyT5Q36,
  },
  {
    id: 37,
    question:
      "The diagram shows what happens to the energy that enters the atmosphere from the sun (reflected, absorbed by atmosphere, used for evaporation, etc.). How much of the sun's energy is not used for photosynthesis?",
    options: ["less than 2%", "about 32%", "about 66%", "more than 98%"],
    correctAnswer: 3,
    tip: "Plants capture less than 2% of incoming solar energy — over 98% is not used for photosynthesis.",
    image: g12BiologyT5Q37,
  },
  {
    id: 38,
    question: "Plants and animals living in a particular area at a particular time are collectively called a …",
    options: ["community.", "habitat.", "population.", "species."],
    correctAnswer: 0,
    tip: "All the populations of different species in one area form a community.",
  },
  {
    id: 39,
    question: "Which of the following is undertaken to minimise pollution of the air from motor vehicle exhaust fumes?",
    options: ["Paying carbon tax", "Stopping using vehicles", "Using air filters", "Using catalytic converters"],
    correctAnswer: 3,
    tip: "Catalytic converters change harmful exhaust gases (CO, NOₓ) into less harmful ones before they leave the vehicle.",
  },
  {
    id: 40,
    question: "Which one of the following is not an economic reason for maintaining biodiversity?",
    options: ["Charcoal production", "Sources of food", "Sources of medicine", "Tourist attraction"],
    correctAnswer: 0,
    tip: "Charcoal production destroys forests and reduces biodiversity — it is not a reason to maintain it.",
  },
];

biologyTests[4] = test5;

const test6: Question[] = [
  {
    id: 1,
    question:
      "Which of the following characteristics of living organisms is defined as the ability to detect and respond to stimuli?",
    options: ["Irritability", "Movement", "Nutrition", "Respiration"],
    correctAnswer: 0,
    tip: "Irritability (sensitivity) is the ability to detect and respond to stimuli.",
  },
  {
    id: 2,
    question:
      "A diagram shows a plant cell and an animal cell side by side. Which feature is found in both of the cells?",
    options: ["Cell membrane", "Cell wall", "Central vacuole", "Chloroplasts"],
    correctAnswer: 0,
    tip: "Both plant and animal cells have a cell membrane. Cell walls, large vacuoles and chloroplasts are only in plant cells.",
  },
  {
    id: 3,
    question:
      "A piece of plant tissue is transferred from a beaker of pure water into a beaker containing 20% salt solution. Which of the following correctly explains what happened? (Movement of water / Volume of tissue cells)",
    options: [
      "Enters the cells / Decreases",
      "Enters the cells / Increases",
      "Leaves the cells / Decreases",
      "Leaves the cells / Increases",
    ],
    correctAnswer: 2,
    tip: "Salt solution is more concentrated, so water leaves the cells by osmosis and they shrink.",
  },
  {
    id: 4,
    question:
      "An experiment on protein digestion uses egg albumen and protease from the human stomach in a water bath at 37°C. The four tubes contain: A egg albumen + protease; B egg albumen + hydrochloric acid; C egg albumen + hydrochloric acid + protease; D egg albumen + hydrochloric acid + boiled protease. In which test tube will the protein be digested most quickly?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Stomach protease (pepsin) needs an acidic pH and active enzyme. Tube C provides HCl + active protease.",
  },
  {
    id: 5,
    question:
      "Different food samples were tested. ✓ = nutrient present, ✗ = absent. A: Benedict ✓, Biuret ✓, Ethanol ✗, Iodine ✗. B: ✓ ✗ ✓ ✗. C: ✗ ✓ ✗ ✓. D: ✗ ✗ ✓ ✗. Which food sample contained both glucose and oil?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Glucose → Benedict's test positive; oil → ethanol emulsion test positive. Sample B is positive for both.",
  },
  {
    id: 6,
    question:
      "Per 100 g, foods contain protein/fat: meat 18/17, bread 9/1.5, fish 18/0.5, eggs 13/11, potato chips 4/9. Which foods have the best value for body building?",
    options: ["Bread and meat", "Bread and potato chips", "Meat and eggs", "Meat and fish"],
    correctAnswer: 3,
    tip: "Body building needs protein. Meat and fish both contain the most protein (18 g) with little fat — best for growth.",
  },
  {
    id: 7,
    question: "What are the effects of lack of magnesium ions and lack of nitrate ions on plant growth?",
    options: [
      "Leaves go yellow between veins / Unable to form enzymes",
      "Roots lack root hairs / Overall growth stunted",
      "Unable to form amino acids / Unable to form glucose",
      "Unable to form cellulose / Oldest leaves turn yellow",
    ],
    correctAnswer: 0,
    tip: "Magnesium is needed to make chlorophyll (yellowing between veins); nitrate is needed for amino acids and enzymes.",
  },
  {
    id: 8,
    question:
      "A potted plant has two leaves sealed in flasks: leaf P with potassium hydroxide solution (absorbs CO₂) and leaf Q with water. After 10 hours in sunlight, leaf P had no starch while leaf Q had a lot of starch. What does this show? A leaf cannot make starch …",
    options: ["in a sealed flask.", "without carbon dioxide.", "without sunlight.", "without oxygen."],
    correctAnswer: 1,
    tip: "KOH removed CO₂ from leaf P's flask, so it could not photosynthesise — proving CO₂ is needed.",
    image: g12BiologyT6Q8,
  },
  {
    id: 9,
    question:
      "What do we call the type of symbiotic relationship in which one species benefits from another species without either harming or benefiting that other species?",
    options: ["Amensalism", "Commensalism", "Mutualism", "Parasitism"],
    correctAnswer: 1,
    tip: "Commensalism: one benefits, the other is unaffected.",
  },
  {
    id: 10,
    question: "Which part of the tooth is the hardest?",
    options: ["Cement", "Dentine", "Enamel", "Pulp cavity"],
    correctAnswer: 2,
    tip: "Enamel is the hardest substance in the body, covering the crown of the tooth.",
  },
  {
    id: 11,
    question:
      "The diagram shows part of the alimentary canal in human beings with parts A (oesophagus), B (stomach), C (duodenum) and D (ileum). Which of the labelled parts produces an acidic juice?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The stomach produces gastric juice containing hydrochloric acid.",
  },
  {
    id: 12,
    question: "Gaseous exchange in an insect is mostly achieved by …",
    options: ["active transport.", "breathing.", "diffusion.", "osmosis."],
    correctAnswer: 2,
    tip: "Oxygen and carbon dioxide move along the tracheoles by simple diffusion.",
  },
  {
    id: 13,
    question:
      "A flask containing yeast, warm water and substance Z is connected to lime water, which turns milky. What is substance Z?",
    options: ["Alcohol", "Carbon dioxide", "Glucose", "Oxygen"],
    correctAnswer: 2,
    tip: "Yeast ferments glucose, producing CO₂ that turns lime water milky. Substance Z must be glucose (the food source).",
  },
  {
    id: 14,
    question: "Which of the following is not a myth about HIV and AIDS? It is transmitted by …",
    options: ["casual shaking of hands.", "hugging.", "sexual intercourse.", "talking to infected people."],
    correctAnswer: 2,
    tip: "HIV is genuinely transmitted through unprotected sexual intercourse — the others are myths.",
  },
  {
    id: 15,
    question:
      "Roots of a seedling were placed in a solution containing red dye. What was the path of the red dye after it had entered the roots?",
    options: [
      "Phloem in root → phloem in stem.",
      "Phloem in root → xylem in stem.",
      "Xylem in root → phloem in stem.",
      "Xylem in root → xylem in stem.",
    ],
    correctAnswer: 3,
    tip: "Water and dissolved dye are carried upwards through the xylem in both root and stem.",
    image: g12BiologyT6Q15,
  },
  {
    id: 16,
    question: "Which component of blood helps it to absorb huge amounts of oxygen?",
    options: ["Plasma proteins", "Platelets", "Red blood cells", "White blood cells"],
    correctAnswer: 2,
    tip: "Red blood cells contain haemoglobin, which binds and carries oxygen.",
  },
  {
    id: 17,
    question:
      "The diagram shows a section through the human heart with valve R (right atrioventricular / tricuspid) and valve S (pulmonary semilunar). What happens to valves R and S as blood leaves the right ventricle?",
    options: ["R closes, S closes", "R closes, S opens", "R opens, S closes", "R opens, S opens"],
    correctAnswer: 1,
    tip: "During ventricular systole, the AV valve (R) closes to prevent backflow; the semilunar valve (S) opens so blood leaves to the pulmonary artery.",
    image: g12BiologyT6Q17,
  },
  {
    id: 18,
    question:
      "A simple dialysis machine has blood entering at X and leaving at Y. The substance in blood at X which should not be found in blood at Y is …",
    options: ["amino acids.", "fatty acids.", "glucose.", "urea."],
    correctAnswer: 3,
    tip: "Dialysis removes waste — urea — from the blood. Useful substances stay.",
  },
  {
    id: 19,
    question:
      "A graph shows blood sugar concentration falling during light exercise to a low point P, then rising back to a high point Q during recovery rest. Which of the following could have caused the change in blood sugar level between P and Q?",
    options: [
      "Glucagon released by the liver.",
      "Glucose released by the liver.",
      "Glycogen released by the muscles.",
      "Insulin released by the pancreas.",
    ],
    correctAnswer: 1,
    tip: "After exercise, the liver breaks down stored glycogen and releases glucose into the blood, raising sugar levels.",
  },
  {
    id: 20,
    question:
      "The diagram shows a reflex arc with structures A (receptor), B (sensory neurone), C (motor neurone) and D (effector). Which structure is a motor neurone?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The motor neurone (C) carries impulses from the spinal cord to the effector (muscle).",
    image: g12BiologyT6Q20,
  },
  {
    id: 21,
    question:
      "A section through the human brain shows parts A (cerebrum), B (cerebellum), C (medulla oblongata) and D (spinal cord). Which part controls balance and muscular coordination?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The cerebellum is responsible for balance and the coordination of muscular movement.",
    image: g12BiologyT6Q21,
  },
  {
    id: 22,
    question: "What is the function of the Eustachian tube in an ear?",
    options: [
      "To direct excess sounds out of the ear.",
      "To equalise the air pressure on the ear drum.",
      "To maintain the posture of the body.",
      "To transmit sounds from the pharynx to the ear.",
    ],
    correctAnswer: 1,
    tip: "The Eustachian tube connects the middle ear to the throat to balance air pressure on either side of the ear drum.",
  },
  {
    id: 23,
    question: "The diagram shows the bones of a human arm with parts 1, 2 and 3. What are the numbered bones?",
    options: [
      "1 Humerus, 2 Radius, 3 Ulna",
      "1 Humerus, 2 Scapula, 3 Radius",
      "1 Scapula, 2 Humerus, 3 Radius",
      "1 Scapula, 2 Humerus, 3 Ulna",
    ],
    correctAnswer: 2,
    tip: "Working down the arm: shoulder blade (scapula) → upper arm bone (humerus) → forearm bone (radius).",
    image: g12BiologyT6Q23,
  },
  {
    id: 24,
    question:
      "Invertebrates in a glass container were exposed to light from one side and they all moved away from the light to the dark side. Which response is exhibited by these invertebrates?",
    options: ["Negative phototaxis.", "Negative phototropism.", "Positive phototaxis.", "Positive phototropism."],
    correctAnswer: 0,
    tip: "Whole-body movement away from light is negative phototaxis. Tropism is for plants only.",
    image: g12BiologyT6Q24,
  },
  {
    id: 25,
    question:
      "The diagram shows a seedling with parts A (cotyledon), B (radicle), C (plumule) and D (hypocotyl). Which part is the plumule?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The plumule is the young shoot of the seedling that grows upward into the stem.",
    image: g12BiologyT6Q25,
  },
  {
    id: 26,
    question: "In addition to suitable temperature, which other factors are necessary for seed germination?",
    options: ["Carbon dioxide and sunlight", "Mineral ions only", "Sunlight only", "Water and oxygen"],
    correctAnswer: 3,
    tip: "Seeds need water (to activate enzymes) and oxygen (for respiration) plus warmth.",
  },
  {
    id: 27,
    question:
      "The diagram shows a parent plant sending out long horizontal stems with new plantlets along the soil surface. Which method of natural propagation is illustrated?",
    options: ["Corms", "Rhizomes", "Runners", "Suckers"],
    correctAnswer: 2,
    tip: "Above-ground horizontal stems that root and form new plantlets are runners (e.g., strawberry).",
    image: g12BiologyT6Q27,
  },
  {
    id: 28,
    question:
      "The diagram shows a longitudinal section of a flower with parts A (anther), B (stigma), C (style) and D (ovary). On which structure would pollen grains be deposited?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Pollen grains land on the sticky stigma during pollination.",
    image: g12BiologyT6Q28,
  },
  {
    id: 29,
    question:
      "A diagram shows two fruits: W has hooks/spines on its surface; X has feathery, parachute-like wings. How are these fruits dispersed?",
    options: ["W Animals, X Animals", "W Animals, X Wind", "W Wind, X Animals", "W Wind, X Wind"],
    correctAnswer: 1,
    tip: "Hooked fruits cling to animal fur (W = animals); light feathery fruits float on the wind (X = wind).",
  },
  {
    id: 30,
    question:
      "The diagram shows the side view of a female reproductive system with parts A (ovary), B (oviduct/fallopian tube), C (uterus) and D (vagina). In which labelled part is the zygote formed?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Fertilisation (and so zygote formation) takes place in the oviduct (fallopian tube).",
    image: g12BiologyT6Q30,
  },
  {
    id: 31,
    question:
      "Menstruation for a woman started on March 14th. During which of the shaded days was the lining of the uterus at its thickest and richest in blood vessels?",
    options: ["March 10th", "March 15th", "March 24th", "April 15th"],
    correctAnswer: 0,
    tip: "The lining is thickest just before menstruation. Day before March 14th — i.e. March 10th — fits best.",
  },
  {
    id: 32,
    question:
      "Which method of contraception is the most effective in preventing the spread of diseases such as syphilis and AIDS?",
    options: ["Diaphragm", "Male condom", "Oral contraceptive pills", "Spermicides"],
    correctAnswer: 1,
    tip: "Only the male condom forms a barrier that blocks the exchange of body fluids carrying STI pathogens.",
  },
  {
    id: 33,
    question: "Which of the following is obtained when a diploid cell undergoes meiosis?",
    options: [
      "Genetically different diploid cells.",
      "Genetically different haploid cells.",
      "Genetically identical diploid cells.",
      "Genetically identical haploid cells.",
    ],
    correctAnswer: 1,
    tip: "Meiosis halves the chromosome number (haploid) and produces genetic variation.",
  },
  {
    id: 34,
    question:
      "A pure-breeding tall plant was crossed with a pure-breeding dwarf plant of the same species. The resulting seeds were grown to produce the next (F1) generation. What were the approximate percentages of tall and dwarf offspring?",
    options: ["100% tall, 0% dwarf", "75% tall, 25% dwarf", "50% tall, 50% dwarf", "25% tall, 75% dwarf"],
    correctAnswer: 0,
    tip: "Tall is dominant. TT × tt gives all Tt — 100% tall in the F1.",
  },
  {
    id: 35,
    question: "What is the correct order of arthropods, from those with the most legs to those with the fewest legs?",
    options: [
      "Arachnids → crustaceans → insects → myriapods.",
      "Crustaceans → myriapods → insects → arachnids.",
      "Insects → arachnids → myriapods → crustaceans.",
      "Myriapods → crustaceans → arachnids → insects.",
    ],
    correctAnswer: 3,
    tip: "Myriapods (many legs) > crustaceans (10+) > arachnids (8) > insects (6).",
  },
  {
    id: 36,
    question:
      "The diagram shows an experiment to find the proportion of one component in a soil sample by heating soil in an evaporating dish until the mass stops decreasing. What component of the soil is being investigated?",
    options: ["Air", "Humus", "Sand", "Water"],
    correctAnswer: 3,
    tip: "Gentle heating drives off water; the loss in mass gives the water content.",
    image: g12BiologyT6Q36,
  },
  {
    id: 37,
    question:
      "Dung beetles lay their eggs in the dung of plant-eating mammals like cattle. Both adults and young eat the undigested food in the dung. Which of the following shows this feeding relationship?",
    options: [
      "Cattle → Dung beetle, with Grass branching off Cattle",
      "Dung beetle → Grass → Cattle",
      "Grass → Cattle → Dung beetle",
      "Grass → Cattle, with Dung beetle branching off Cattle",
    ],
    correctAnswer: 2,
    tip: "Energy flows: Grass is eaten by Cattle, whose dung is eaten by Dung beetles.",
  },
  {
    id: 38,
    question:
      "In a nitrogen cycle: A converts soil nitrates → nitrogen gas; B is decay of organisms to ammonia; C converts ammonia → protein in organisms; D converts ammonia → soil nitrates. Which process is nitrification?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Nitrification is the conversion of ammonia/ammonium into nitrates by nitrifying bacteria — process D.",
  },
  {
    id: 39,
    question:
      "Water samples were taken at four points along a river — W and X upstream of an untreated sewage outlet, Y just below it, Z further downstream — to measure oxygen concentration. Which graph best describes the oxygen concentrations in the river?",
    options: [
      "Oxygen high at W and X, drops sharply at Y, recovers by Z",
      "Oxygen low at W, rises through X, Y, Z",
      "Oxygen the same at all four points",
      "Oxygen rises at Y and falls at Z",
    ],
    correctAnswer: 0,
    tip: "Sewage causes bacteria to multiply and use up oxygen near the outlet (Y); oxygen recovers further downstream (Z).",
  },
  {
    id: 40,
    question: "Which of the following must be controlled to protect the habitat of an endangered species?",
    options: ["Decomposition", "Nitrogen fixation", "Pollution", "Rainfall"],
    correctAnswer: 2,
    tip: "Pollution is a human-controlled threat that degrades habitats; controlling it protects endangered species.",
  },
];

// biologyTests[5] = test6;

const test7: Question[] = [
  {
    id: 1,
    question:
      "The diagram shows a microscope with parts A (eye piece), B (objective lens), C (diaphragm under the stage) and D (mirror). Which labelled part regulates the amount of light passing through the object?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The diaphragm (iris) below the stage opens and closes to control how much light reaches the specimen.",
    image: g12BiologyT7Q1,
  },
  {
    id: 2,
    question:
      "Two cells are shown — one from a bean leaf and one from a human liver — with labels A (cell membrane), B (nucleus), C (cytoplasm) and D (chloroplast labelled in the animal cell). Which label is not pointing to the correct structure found in both cells?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Chloroplasts are only in plant cells, so label D cannot be a feature of both.",
    image: g12BiologyT7Q2,
  },
  {
    id: 3,
    question:
      "An osmosis apparatus has a visking tube of concentrated salt solution attached to a glass tube and dipped in a beaker of dilute salt solution. After two hours, what would be observed?",
    options: [
      "Falls — Salt molecules moved out of the visking tube into the beaker.",
      "Falls — Water molecules moved out of the visking tube into the beaker.",
      "Rises — Salt molecules moved from the beaker into the visking tube.",
      "Rises — Water molecules moved from the beaker into the visking tube.",
    ],
    correctAnswer: 3,
    tip: "Water moves by osmosis from the dilute beaker into the more concentrated visking tube — the level in the glass tube rises.",
    image: g12BiologyT7Q3,
  },
  {
    id: 4,
    question:
      "Statements about enzymes: 1 They are proteins. 2 They are secreted in the alimentary canal. 3 They speed up biochemical reactions. 4 None of them work at low pH. Which statements are correct for ALL enzymes?",
    options: ["1 and 3", "1 and 4", "2 and 3", "2 and 4"],
    correctAnswer: 0,
    tip: "All enzymes are proteins (1) and biological catalysts (3). Statements 2 and 4 are not true of every enzyme (e.g. pepsin works at low pH).",
  },
  {
    id: 5,
    question:
      "A food sample gave: purple with Biuret, blue when heated with Benedict's, yellow with iodine, white emulsion with ethanol. What nutrients did the food sample contain?",
    options: ["Fat and Protein.", "Fat and Starch.", "Protein and Reducing Sugar.", "Reducing Sugar and Starch."],
    correctAnswer: 0,
    tip: "Purple Biuret = protein; white emulsion with ethanol = fat. Blue Benedict's and yellow iodine show no reducing sugar and no starch.",
  },
  {
    id: 6,
    question:
      "Daily intakes (W/X/Y/Z) — Carbohydrate 520/30/50/40 g; Fat 110/200/50/20 g; Iron 15/4/30/20 mg; Protein 50/180/120/65 g; Vitamin C 95/100/10/80 mg. In which person will cuts on the skin be least likely to heal properly?",
    options: ["W", "X", "Y", "Z"],
    correctAnswer: 2,
    tip: "Vitamin C is needed for healing wounds. Person Y has the lowest vitamin C (10 mg).",
  },
  {
    id: 7,
    question: "Which of the following signs shows that a plant was grown in a soil deficient in magnesium ions?",
    options: ["Poor root growth.", "Small leaves.", "Stunted growth.", "Yellow leaves."],
    correctAnswer: 3,
    tip: "Magnesium is needed to make chlorophyll; lack of it causes leaves to turn yellow (chlorosis).",
  },
  {
    id: 8,
    question:
      "Two bell jars are set up: an experiment jar contains a green leafy shoot and a candle, the control contains only a candle. Both stand in water. The candle in the experiment burnt longer than the candle in the control. What conclusion can be drawn?",
    options: [
      "Oxygen is liberated during photosynthesis.",
      "Carbon dioxide is used during photosynthesis.",
      "Water is used during photosynthesis.",
      "Light energy is used during photosynthesis.",
    ],
    correctAnswer: 0,
    tip: "More O₂ in the experiment jar (released by the plant) keeps the candle burning longer — showing photosynthesis releases oxygen.",
    image: g12BiologyT7Q8,
  },
  {
    id: 9,
    question: "What type of nutrition is carried out by a Rhizopus?",
    options: ["Autotrophic nutrition.", "Parasitic nutrition.", "Photosynthesis.", "Saprophytic nutrition."],
    correctAnswer: 3,
    tip: "Rhizopus is a fungus that feeds on dead organic matter — saprophytic nutrition.",
  },
  {
    id: 10,
    question:
      "The dental formula of a dog is i 3/3, c 1/1, pm 4/4, m 2/3. How many premolars are in the upper jaw of the dog?",
    options: ["2", "4", "6", "8"],
    correctAnswer: 3,
    tip: "pm 4/4 means 4 premolars per side of the upper jaw — 4 × 2 = 8.",
  },
  {
    id: 11,
    question:
      "The diagram shows part of the human alimentary canal with structures 1 (liver), 2 (stomach), 3 (pancreas), 4 (duodenum) and 5 (ileum). Which two structures produce substances involved in the digestion of fat (lipid)?",
    options: ["1 and 2", "1 and 5", "2 and 3", "3 and 4"],
    correctAnswer: 3,
    tip: "The pancreas releases lipase and the duodenum receives bile (made by the liver). Lipase + bile digest fats — best matched here as 3 and 4.",
    image: g12BiologyT7Q11,
  },
  {
    id: 12,
    question: "Which equation represents anaerobic respiration in human muscles?",
    options: [
      "glucose → carbon dioxide + ethanol (alcohol) + energy.",
      "glucose → carbon dioxide + lactic acid + energy.",
      "glucose → ethanol (alcohol) + energy.",
      "glucose → lactic acid + energy.",
    ],
    correctAnswer: 3,
    tip: "In human muscles, glucose is broken down to lactic acid + a small amount of energy (no CO₂, no ethanol).",
  },
  {
    id: 13,
    question:
      "A medical officer needs to introduce a publicity campaign to reduce the spread of AIDS. What advice should be included?",
    options: [
      "Do not drink from cups used by other people.",
      "Do not kiss infected people.",
      "Do not use soap and towels used by other people.",
      "Have sexual intercourse with only one faithful partner.",
    ],
    correctAnswer: 3,
    tip: "HIV is mainly spread by unprotected sex. Sticking to one faithful partner reduces the risk.",
  },
  {
    id: 14,
    question: "Which of the following statements best describes the importance of immunisation?",
    options: [
      "To monitor the growth of children.",
      "For the body to produce antigens.",
      "For the body to produce antibodies.",
      "For the body to produce hormones.",
    ],
    correctAnswer: 2,
    tip: "Vaccines stimulate the body to produce antibodies against the pathogen.",
  },
  {
    id: 15,
    question:
      "Sections from the root and stem of a plant are shown. Which tissues conduct sucrose in solution? (Root / Stem)",
    options: ["1 / 5", "2 / 4", "2 / 6", "3 / 5"],
    correctAnswer: 2,
    tip: "Sucrose is transported in the phloem of both root and stem. Here that matches root 2 and stem 6.",
  },
  {
    id: 16,
    question: "Which one of the following correctly identifies a blood group with its antigen and antibody?",
    options: [
      "Group A — Antigen A, Antibody A",
      "Group B — Antigen A, Antibody B",
      "Group AB — Antigen AB, no antibodies",
      "Group O — Antigen O, no antibodies",
    ],
    correctAnswer: 2,
    tip: "Group AB has both A and B antigens and no anti-A or anti-B antibodies, so it is the universal recipient.",
  },
  {
    id: 17,
    question:
      "The diagram shows three blood vessels X (thick muscular wall, narrow lumen), Y (thin wall, single layer of cells) and Z (thinner wall than X, wider lumen with valves). What are the names of these blood vessels?",
    options: [
      "X Artery, Y Capillary, Z Vein",
      "X Artery, Y Vein, Z Capillary",
      "X Capillary, Y Vein, Z Artery",
      "X Capillary, Y Artery, Z Vein",
    ],
    correctAnswer: 0,
    tip: "Thick wall = artery (X); single-cell wall = capillary (Y); valves and wider lumen = vein (Z).",
    image: g12BiologyT7Q17,
  },
  {
    id: 18,
    question:
      "A nephron diagram labels X (Bowman's capsule/glomerulus), Y (proximal convoluted tubule) and Z (collecting duct). What processes occur at points X, Y and Z?",
    options: [
      "X Ultrafiltration, Y Selective reabsorption, Z Osmoregulation",
      "X Ultrafiltration, Y Osmoregulation, Z Selective reabsorption",
      "X Selective reabsorption, Y Osmoregulation, Z Ultrafiltration",
      "X Selective reabsorption, Y Ultrafiltration, Z Osmoregulation",
    ],
    correctAnswer: 0,
    tip: "Filtering happens at the glomerulus (X), useful substances are reabsorbed in the PCT (Y), and water balance is finalised in the collecting duct (Z).",
    image: g12BiologyT7Q18,
  },
  {
    id: 19,
    question: "What happens when human body temperature falls below 37°C? (Blood flow to skin / Sweating)",
    options: ["Decreased / Decreased", "Decreased / Increased", "Increased / Decreased", "Increased / Increased"],
    correctAnswer: 0,
    tip: "When cold, vasoconstriction reduces blood flow to the skin and sweating stops to conserve heat.",
  },
  {
    id: 20,
    question:
      "The diagram shows endocrine glands in humans labelled P (pituitary), Q (thyroid) and R (pancreas / adrenal area depending on body position). Which hormones are produced in glands P, Q and R?",
    options: [
      "P ADH, Q Insulin, R Adrenalin",
      "P ADH, Q Thyroxine, R Glucagon",
      "P Adrenalin, Q ADH, R Thyroxine",
      "P Adrenalin, Q Thyroxine, R ADH",
    ],
    correctAnswer: 1,
    tip: "Pituitary → ADH; thyroid → thyroxine; pancreas (alpha cells) → glucagon.",
    image: g12BiologyT7Q20,
  },
  {
    id: 21,
    question:
      "A section through the brain and spinal cord shows A (cerebrum), B (cerebellum), C (medulla oblongata) and D (spinal cord). Which region controls the breathing rate and heart rate?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The medulla oblongata controls automatic processes like heart rate and breathing.",
    image: g12BiologyT7Q21,
  },
  {
    id: 22,
    question:
      "Which of the following correctly identifies the part of the ear and the structure found in it? (Outer / Middle / Inner)",
    options: [
      "Cochlea / Eustachian tube / Pinna",
      "Cochlea / Pinna / Ossicles",
      "Pinna / Ossicles / Cochlea",
      "Pinna / Cochlea / Eustachian tube",
    ],
    correctAnswer: 2,
    tip: "Pinna is in the outer ear, ossicles in the middle ear, cochlea in the inner ear.",
  },
  {
    id: 23,
    question: "Which of the following correctly differentiates a hinge joint from a ball and socket joint?",
    options: [
      "Hinge: movement in three planes; Ball and socket: in one plane",
      "Hinge: movement in one plane; Ball and socket: in three planes",
      "Hinge: fixed joint; Ball and socket: movable joint",
      "Hinge: at the shoulder; Ball and socket: at the knee",
    ],
    correctAnswer: 1,
    tip: "A hinge joint (e.g. knee) moves in one plane; a ball-and-socket joint (e.g. shoulder) moves in all directions.",
  },
  {
    id: 24,
    question:
      "Invertebrates were placed in a partially covered glass box exposed to light. They all moved into the dark, covered side. What response is shown by these animals?",
    options: ["Negative phototaxis.", "Negative phototropism.", "Positive phototaxis.", "Positive phototropism."],
    correctAnswer: 0,
    tip: "Whole-body movement away from light = negative phototaxis. Tropism is for plants only.",
    image: g12BiologyT7Q24,
  },
  {
    id: 25,
    question:
      "The diagram shows a germinating seed with regions A (root cap), B (zone of cell division), C (zone of cell elongation) and D (zone of cell differentiation/maturation). Which part is the region for cell differentiation?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Just behind elongation, cells specialise into different tissues — the differentiation zone (D).",
    image: g12BiologyT7Q25,
  },
  {
    id: 26,
    question:
      "A graph of % germination against storage time shows germination dropping from near 100% to about 30% as storage time increases over 4 years. What can be concluded?",
    options: [
      "Older seeds do not germinate.",
      "Older seeds germinate better than younger seeds.",
      "Younger seeds always germinate.",
      "Younger seeds germinate better than older seeds.",
    ],
    correctAnswer: 3,
    tip: "Germination percentage falls as storage time increases — younger seeds germinate better.",
  },
  {
    id: 27,
    question:
      "The diagram shows sexual reproduction in a fungus with stages A, B, C and D, where C is a thick-walled spore formed by the fusion of two hyphae. Which of the labelled stages is the zygospore?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The zygospore is the thick-walled diploid spore formed after the fusion of two compatible hyphae — stage C.",
    image: g12BiologyT7Q27,
  },
  {
    id: 28,
    question:
      "Some events in sexual reproduction in a flowering plant: 1 male gamete fuses with female gamete; 2 anthers split open; 3 growth of pollen tube; 4 pollen grain sticks to stigma; 5 seed develops inside ovary. In which order do these events take place?",
    options: ["2 → 4 → 3 → 1 → 5", "3 → 2 → 4 → 5 → 1", "4 → 2 → 1 → 5 → 3", "4 → 2 → 3 → 1 → 5"],
    correctAnswer: 0,
    tip: "Anthers open (2) → pollen lands on stigma (4) → pollen tube grows (3) → fertilisation (1) → seed forms (5).",
  },
  {
    id: 29,
    question:
      "The diagram shows four fruits: 1 (hooked burr), 2 (winged seed), 3 (fleshy berry), 4 (parachute seed). Which two fruits are dispersed by animals?",
    options: ["1 and 2", "1 and 3", "2 and 4", "3 and 4"],
    correctAnswer: 1,
    tip: "Hooked fruits cling to fur (1) and fleshy fruits are eaten (3) — both are dispersed by animals.",
    image: g12BiologyT7Q29,
  },
  {
    id: 30,
    question:
      "A section through the male reproductive system shows parts 1 (testis), 2 (epididymis), 3 (sperm duct) and 4 (urethra). In which numbered parts are sperms produced and where are they stored?",
    options: ["Produced 1, Stored 2", "Produced 2, Stored 3", "Produced 3, Stored 1", "Produced 4, Stored 3"],
    correctAnswer: 0,
    tip: "Sperm are produced in the testis (1) and stored in the epididymis (2) until ejaculation.",
    image: g12BiologyT7Q30,
  },
  {
    id: 31,
    question: "How often is an ovum usually released from the ovaries of a woman?",
    options: ["Once a week.", "Once every 14 days.", "Once every 28 days.", "Once every 9 months."],
    correctAnswer: 2,
    tip: "Ovulation typically occurs once each menstrual cycle — about every 28 days.",
  },
  {
    id: 32,
    question:
      "Birth control methods may be classified as hormonal, mechanical and behavioural. Which is the correct identification of each? (Behavioural / Hormonal / Mechanical)",
    options: [
      "Condom / Spermicide / Rhythm",
      "Condom / IUD / Vasectomy",
      "Rhythm / Condom / Spermicide",
      "Rhythm / Pill / Diaphragm",
    ],
    correctAnswer: 3,
    tip: "Rhythm method = behavioural; the contraceptive pill = hormonal; the diaphragm = mechanical barrier.",
  },
  {
    id: 33,
    question:
      "In cats the gene for folded ear is dominant to the gene for normal ear. Two heterozygous cats produced 120 kittens. What would be the expected ratio of folded ear to normal ear amongst these offspring?",
    options: ["90:30", "80:40", "60:50", "30:90"],
    correctAnswer: 0,
    tip: "A heterozygous cross gives a 3:1 ratio. 3/4 × 120 = 90 folded; 1/4 × 120 = 30 normal — 90:30.",
  },
  {
    id: 34,
    question: "Which of the following genetic diseases is caused by chromosomal mutation?",
    options: ["Colour blindness.", "Down's syndrome.", "Haemophilia.", "Sickle cell anaemia."],
    correctAnswer: 1,
    tip: "Down's syndrome is caused by an extra copy of chromosome 21 — a chromosomal mutation. The others are gene mutations.",
  },
  {
    id: 35,
    question:
      "Living organisms are split into kingdoms: A (single-celled, no chlorophyll), B (single-celled, may have chlorophyll), C (multicellular with chlorophyll) and D (multicellular without chlorophyll). Which kingdom represents the fungi?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Fungi are multicellular and have no chlorophyll — kingdom D.",
  },
  {
    id: 36,
    question:
      "A metal crucible weighing 25 g was half filled with fresh soil and weighed 50 g. After overnight in an oven at 102°C the mass was 44 g. What was the percentage by mass of water in the original soil sample?",
    options: ["6%", "12%", "24%", "33%"],
    correctAnswer: 2,
    tip: "Soil = 25 g; water lost = 50 − 44 = 6 g. % water = 6/25 × 100 = 24%.",
  },
  {
    id: 37,
    question:
      "The diagram shows the flow of energy through an ecosystem from the sun to producers to primary consumers to secondary consumers, with arrows numbered 1–5 (some between trophic levels, some lost as heat to the environment). Which arrows represent the least amount of energy transferred between organisms and the greatest amount of energy lost to the environment?",
    options: ["Least 1, Greatest 4", "Least 1, Greatest 5", "Least 2, Greatest 3", "Least 2, Greatest 4"],
    correctAnswer: 2,
    tip: "Energy transferred between trophic levels falls at each step (least at the top — arrow 2). Most energy is lost as heat at the producer level (arrow 3).",
    image: g12BiologyT7Q37,
  },
  {
    id: 38,
    question:
      "A town's population fell from 1500 to 1300. Events: 1 100 people shifted to the nearest town; 2 heavy rainfall causing massive floods; 3 outbreak of cholera due to garbage; 4 improved medical facilities. Which of these events would reduce the population size?",
    options: ["1, 2, 3", "1, 2, 4", "1, 3, 4", "2, 3, 4"],
    correctAnswer: 0,
    tip: "Emigration (1), deaths from floods (2) and deaths from cholera (3) all reduce the population. Better medical care (4) increases survival.",
  },
  {
    id: 39,
    question:
      "A nitrogen cycle diagram shows points A (nitrogen in air), B (root nodules of legumes), C (soil nitrates) and D (decomposers). At which point in the cycle are nitrogen-fixing bacteria found?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Nitrogen-fixing bacteria (e.g. Rhizobium) live in the root nodules of leguminous plants (B).",
  },
  {
    id: 40,
    question: "Which of the following does not reduce biodiversity?",
    options: ["Deforestation", "Overfishing", "Poaching", "Tourism"],
    correctAnswer: 3,
    tip: "Well-managed tourism can support conservation. The other three directly destroy habitats or species.",
  },
];

// biologyTests[6] = test7;

const test8: Question[] = [
  {
    id: 1,
    question: "Which group of organisms in an ecosystem are classified as angiosperms?",
    options: ["Mushrooms and moulds", "Flowering plants", "Mosses and ferns", "Lizards and snakes"],
    correctAnswer: 1,
    tip: "Angiosperms are flowering plants that produce seeds enclosed in fruits.",
  },
  {
    id: 2,
    question: "To which vertebrate class does a lizard belong?",
    options: ["Amphibian", "Mammal", "Reptile", "Bird"],
    correctAnswer: 2,
    tip: "Lizards have dry scaly skin and lay shelled eggs on land — characteristics of reptiles.",
  },
  {
    id: 3,
    question: "What type of nutrition is carried out by fungi growing on a decaying leaf?",
    options: ["Autotrophic", "Saprophytic", "Parasitic", "Holozoic"],
    correctAnswer: 1,
    tip: "Fungi feeding on dead matter secrete enzymes onto the substrate and absorb the products — saprophytic nutrition.",
  },
  {
    id: 4,
    question: "What type of nutrition is carried out by a green plant in an ecosystem?",
    options: ["Saprophytic", "Parasitic", "Holozoic", "Autotrophic"],
    correctAnswer: 3,
    tip: "Green plants make their own food by photosynthesis — autotrophic nutrition.",
  },
  {
    id: 5,
    question: "Which of the following is a difference between a lizard cell and a plant cell?",
    options: [
      "Lizard cell has a cell wall; plant cell has none",
      "Plant cell has chloroplasts; lizard cell has none",
      "Lizard cell has a nucleus; plant cell has none",
      "Plant cell has mitochondria; lizard cell has none",
    ],
    correctAnswer: 1,
    tip: "Only plant cells have a cellulose wall and chloroplasts; both have nuclei and mitochondria.",
  },
  {
    id: 6,
    question: "Which of the following is a correct food chain in a forest ecosystem?",
    options: ["Bird → insect → plant", "Plant → insect → bird", "Insect → plant → bird", "Bird → plant → insect"],
    correctAnswer: 1,
    tip: "A food chain starts with a producer (plant), then a primary consumer (insect), then a secondary consumer (bird).",
  },
  {
    id: 7,
    question: "In the digestive system, which structure stores bile produced by the liver?",
    options: ["Pancreas", "Gall bladder", "Duodenum", "Ileum"],
    correctAnswer: 1,
    tip: "Bile from the liver is stored in the gall bladder before being released into the duodenum.",
  },
  {
    id: 8,
    question: "Which product of digestion in the ileum is not transported by the blood?",
    options: ["Glucose", "Amino acids", "Fatty acids and glycerol", "Vitamin C"],
    correctAnswer: 2,
    tip: "Fatty acids and glycerol are absorbed into the lacteals of the lymphatic system, not directly into the blood.",
  },
  {
    id: 9,
    question: "Which enzyme in the ileum breaks down maltose to produce glucose?",
    options: ["Amylase", "Lipase", "Maltase", "Pepsin"],
    correctAnswer: 2,
    tip: "Maltase, secreted by the wall of the ileum, hydrolyses maltose into two glucose molecules.",
  },
  {
    id: 10,
    question: "Glycogen in the liver is mainly formed from which substance?",
    options: ["Amino acids", "Fatty acids", "Glucose", "Vitamins"],
    correctAnswer: 2,
    tip: "Excess glucose is converted to glycogen in the liver under the action of insulin.",
  },
  {
    id: 11,
    question: "Which of the following is a function of glucose in the body?",
    options: ["Forming antibodies", "Providing energy through respiration", "Carrying oxygen", "Clotting blood"],
    correctAnswer: 1,
    tip: "Glucose is the main respiratory substrate; its oxidation releases energy as ATP.",
  },
  {
    id: 12,
    question: "Urine is produced when the body has",
    options: [
      "low water and high salts",
      "excess water or excess salts",
      "low salts and low water",
      "no waste products",
    ],
    correctAnswer: 1,
    tip: "The kidneys remove excess water, salts and urea from the blood, forming urine.",
  },
  {
    id: 13,
    question: "The circulation between the heart and the body (excluding the lungs) is called",
    options: ["pulmonary circulation", "systemic circulation", "portal circulation", "coronary circulation"],
    correctAnswer: 1,
    tip: "Systemic circulation carries oxygenated blood from the heart to body tissues and returns deoxygenated blood.",
  },
  {
    id: 14,
    question: "The circulation between the heart and the lungs is called",
    options: ["pulmonary circulation", "systemic circulation", "hepatic circulation", "renal circulation"],
    correctAnswer: 0,
    tip: "Pulmonary circulation moves blood from the right side of the heart to the lungs and back to the left side.",
  },
  {
    id: 15,
    question: "Which blood vessel carries oxygenated blood from the lungs to the heart?",
    options: ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"],
    correctAnswer: 1,
    tip: "The pulmonary vein is the only vein that carries oxygenated blood — from lungs to the left atrium.",
  },
  {
    id: 16,
    question: "Which is a structural difference between an artery and a vein?",
    options: [
      "Arteries have valves; veins do not",
      "Veins have thicker muscular walls than arteries",
      "Arteries have thicker muscular walls; veins have valves",
      "Veins carry blood away from the heart",
    ],
    correctAnswer: 2,
    tip: "Arteries have thick, muscular, elastic walls to handle high pressure; veins have thinner walls and valves.",
  },
  {
    id: 17,
    question: "The chamber of the heart that receives oxygenated blood from the lungs is the",
    options: ["right atrium", "right ventricle", "left atrium", "left ventricle"],
    correctAnswer: 2,
    tip: "Oxygenated blood enters the left atrium via the pulmonary veins.",
  },
  {
    id: 18,
    question: "Which of the following is a blood disorder in humans?",
    options: ["Anaemia", "Asthma", "Diabetes", "Tuberculosis"],
    correctAnswer: 0,
    tip: "Anaemia is a deficiency of haemoglobin or red blood cells in the blood.",
  },
  {
    id: 19,
    question: "Haemophilia is a disorder where",
    options: [
      "blood does not clot properly",
      "haemoglobin is reduced",
      "white cells multiply uncontrollably",
      "blood pressure is high",
    ],
    correctAnswer: 0,
    tip: "Haemophilia is caused by a missing clotting factor; affected individuals bleed for long periods.",
  },
  {
    id: 20,
    question: "Which blood vessel carries blood into the kidney?",
    options: ["Renal vein", "Renal artery", "Hepatic artery", "Pulmonary artery"],
    correctAnswer: 1,
    tip: "The renal artery, branching from the aorta, supplies oxygenated blood to the kidney.",
  },
  {
    id: 21,
    question: "Which two waste substances are normally found in urine?",
    options: [
      "Glucose and amino acids",
      "Urea and excess salts",
      "Proteins and fats",
      "Carbon dioxide and water vapour",
    ],
    correctAnswer: 1,
    tip: "Urea (from protein breakdown) and excess mineral salts are excreted dissolved in water as urine.",
  },
  {
    id: 22,
    question: "Which two processes occur in the kidney during urine formation?",
    options: [
      "Diffusion and osmosis",
      "Ultrafiltration and selective reabsorption",
      "Active transport and digestion",
      "Photosynthesis and respiration",
    ],
    correctAnswer: 1,
    tip: "Blood is ultrafiltered at the glomerulus, then useful substances are selectively reabsorbed in the tubules.",
  },
  {
    id: 23,
    question: "Which method can keep a person with kidney failure alive?",
    options: ["Insulin injection", "Dialysis or kidney transplant", "Blood transfusion", "Bone marrow transplant"],
    correctAnswer: 1,
    tip: "Dialysis filters the blood mechanically; a transplant replaces the failed kidney.",
  },
  {
    id: 24,
    question: "The hormone that controls osmoregulation by the kidney is",
    options: ["insulin", "adrenaline", "antidiuretic hormone (ADH)", "oestrogen"],
    correctAnswer: 2,
    tip: "ADH from the pituitary increases water reabsorption in the kidney tubules.",
  },
  {
    id: 25,
    question: "A sex-linked characteristic is one that is",
    options: [
      "only expressed in adults",
      "carried on the sex chromosomes",
      "always dominant",
      "found only on autosomes",
    ],
    correctAnswer: 1,
    tip: "Sex-linked traits are controlled by genes on the X or Y chromosome.",
  },
  {
    id: 26,
    question:
      "A normal man (X^H Y) and a carrier woman (X^H X^h) have a son. The probability that he has haemophilia is",
    options: ["0", "1/4", "1/2", "1"],
    correctAnswer: 2,
    tip: "Sons receive Y from father and either X^H or X^h from mother — 1/2 chance of being haemophilic.",
  },
  {
    id: 27,
    question: "Aerobic respiration is the breakdown of glucose",
    options: [
      "in the absence of oxygen producing lactic acid",
      "using oxygen to produce carbon dioxide, water and energy",
      "by enzymes only at low temperature",
      "to form starch and oxygen",
    ],
    correctAnswer: 1,
    tip: "Aerobic respiration: C6H12O6 + 6O2 → 6CO2 + 6H2O + energy (ATP).",
  },
  {
    id: 28,
    question: "Which air pollutant from car exhausts combines with haemoglobin and reduces oxygen transport?",
    options: ["Sulphur dioxide", "Carbon monoxide", "Nitrogen", "Ozone"],
    correctAnswer: 1,
    tip: "Carbon monoxide binds to haemoglobin more tightly than oxygen, forming carboxyhaemoglobin.",
  },
  {
    id: 29,
    question: "Which part of the respiratory system traps dust and microbes before they reach the lungs?",
    options: ["Alveoli", "Diaphragm", "Mucus and cilia in the trachea", "Bronchioles"],
    correctAnswer: 2,
    tip: "Goblet cells secrete sticky mucus that traps particles; cilia sweep it back up to the throat.",
  },
  {
    id: 30,
    question: "A fruit that is dispersed by wind is usually",
    options: ["heavy and fleshy", "light with wings or hairs", "hooked and rough", "explosive"],
    correctAnswer: 1,
    tip: "Wind-dispersed fruits/seeds (e.g. dandelion) are light with wings or parachute-like hairs.",
  },
  {
    id: 31,
    question: "An advantage of vegetative propagation in plants is that",
    options: [
      "offspring show wide variation",
      "offspring are genetically identical to the parent",
      "seeds are produced in large numbers",
      "cross-pollination occurs",
    ],
    correctAnswer: 1,
    tip: "Vegetative propagation produces clones — useful when the parent has desirable traits.",
  },
  {
    id: 32,
    question: "A disadvantage of vegetative propagation is that",
    options: [
      "it is slow",
      "lack of variation makes plants vulnerable to disease",
      "it requires two parents",
      "it produces fruits",
    ],
    correctAnswer: 1,
    tip: "Without genetic variation, a single disease can wipe out the whole population.",
  },
  {
    id: 33,
    question: "Positive phototropism in plants means growth",
    options: ["away from light", "towards light", "towards gravity", "away from water"],
    correctAnswer: 1,
    tip: "Shoots grow towards light because auxin accumulates on the shaded side, causing it to elongate.",
  },
  {
    id: 34,
    question: "In a germinating seed, the radicle shows",
    options: ["positive phototropism", "negative geotropism", "positive geotropism", "negative hydrotropism"],
    correctAnswer: 2,
    tip: "The radicle (root) grows downwards in response to gravity — positive geotropism.",
  },
  {
    id: 35,
    question: "The plumule of a germinating seed shows",
    options: ["positive geotropism", "negative geotropism", "positive hydrotropism", "no response"],
    correctAnswer: 1,
    tip: "The plumule (shoot) grows upwards, away from gravity — negative geotropism.",
  },
  {
    id: 36,
    question: "Which is a similarity between adrenaline and glucagon?",
    options: [
      "Both are produced by the pancreas",
      "Both raise blood glucose levels",
      "Both lower blood pressure",
      "Both are proteins for growth",
    ],
    correctAnswer: 1,
    tip: "Both hormones stimulate the breakdown of glycogen to glucose, raising blood glucose.",
  },
  {
    id: 37,
    question: "A ball-and-socket joint differs from a hinge joint in that it",
    options: [
      "allows movement in only one plane",
      "allows movement in many planes",
      "has no synovial fluid",
      "is found in the elbow",
    ],
    correctAnswer: 1,
    tip: "Ball-and-socket joints (hip, shoulder) allow rotation in many directions; hinge joints move in one plane only.",
  },
  {
    id: 38,
    question: "When the arm is bent at the elbow, the biceps",
    options: [
      "contracts and triceps relaxes",
      "relaxes and triceps contracts",
      "and triceps both contract",
      "and triceps both relax",
    ],
    correctAnswer: 0,
    tip: "Biceps and triceps are antagonistic — biceps contracts to bend the arm while triceps relaxes.",
  },
  {
    id: 39,
    question: "The first stage in the life cycle of a mosquito is the",
    options: ["pupa", "larva", "egg", "adult"],
    correctAnswer: 2,
    tip: "Mosquito life cycle: egg → larva → pupa → adult, all but the adult occurring in water.",
  },
  {
    id: 40,
    question: "Bilharzia is mainly transmitted to humans through",
    options: [
      "mosquito bites",
      "contact with water containing infected snails",
      "eating undercooked meat",
      "airborne droplets",
    ],
    correctAnswer: 1,
    tip: "Schistosoma cercariae released by freshwater snails penetrate human skin during contact with infested water.",
  },
];

// biologyTests[7] = test8;

const test9: Question[] = [
  {
    id: 1,
    question: "Guard cells in a leaf are specialised to",
    options: [
      "transport water in the xylem",
      "control the opening and closing of stomata",
      "carry out photosynthesis only",
      "absorb mineral salts from soil",
    ],
    correctAnswer: 1,
    tip: "A pair of guard cells flanks each stoma; changes in their turgor open or close the pore.",
  },
  {
    id: 2,
    question: "A stoma opens when the guard cells",
    options: ["lose water and become flaccid", "gain water and become turgid", "die and shrink", "store starch"],
    correctAnswer: 1,
    tip: "Water entering by osmosis makes guard cells turgid; their unevenly thickened walls bend apart, opening the pore.",
  },
  {
    id: 3,
    question: "Stomata mainly close at night because",
    options: [
      "photosynthesis stops and water is conserved",
      "the plant respires more",
      "the temperature rises",
      "wind speed increases",
    ],
    correctAnswer: 0,
    tip: "With no photosynthesis at night, stomata close to reduce water loss by transpiration.",
  },
  {
    id: 4,
    question: "The hard outer covering of the crown of a tooth is the",
    options: ["dentine", "enamel", "cement", "pulp"],
    correctAnswer: 1,
    tip: "Enamel is the hardest substance in the body and protects the underlying dentine.",
  },
  {
    id: 5,
    question: "The pulp cavity of a tooth contains",
    options: ["enamel and cement", "blood vessels and nerves", "muscles and tendons", "bone marrow only"],
    correctAnswer: 1,
    tip: "The pulp cavity holds nerves and blood vessels that supply the living tooth.",
  },
  {
    id: 6,
    question: "Tooth decay is caused mainly by",
    options: [
      "acid produced by bacteria acting on sugars",
      "drinking too much water",
      "eating fibrous food",
      "low temperatures in the mouth",
    ],
    correctAnswer: 0,
    tip: "Bacteria in plaque ferment sugars to produce acids that dissolve enamel.",
  },
  {
    id: 7,
    question: "Which of the following helps prevent tooth decay?",
    options: [
      "Eating sugary foods often",
      "Brushing teeth regularly with fluoride toothpaste",
      "Avoiding fruits and vegetables",
      "Drinking only fizzy drinks",
    ],
    correctAnswer: 1,
    tip: "Brushing removes plaque and fluoride strengthens enamel against acid attack.",
  },
  {
    id: 8,
    question: "The main food substance stored in cassava root tubers is",
    options: ["protein", "fat", "starch", "vitamin C"],
    correctAnswer: 2,
    tip: "Cassava tubers store excess carbohydrate as starch.",
  },
  {
    id: 9,
    question: "The food in cassava root tubers is manufactured in the",
    options: ["roots", "leaves", "stem", "flowers"],
    correctAnswer: 1,
    tip: "Photosynthesis takes place in the chloroplasts of the leaves.",
  },
  {
    id: 10,
    question: "Glucose made in the leaves is transported to the root tubers through the",
    options: ["xylem", "phloem", "epidermis", "cortex only"],
    correctAnswer: 1,
    tip: "Phloem translocates dissolved sugars (mainly sucrose) from leaves to storage organs.",
  },
  {
    id: 11,
    question: "In the storage tubers, glucose is converted into",
    options: ["protein", "starch", "fat", "cellulose only"],
    correctAnswer: 1,
    tip: "Glucose molecules are joined together to form insoluble starch for storage.",
  },
  {
    id: 12,
    question: "Which mineral ion is most needed by a plant to make chlorophyll for photosynthesis?",
    options: ["Calcium", "Sodium", "Magnesium", "Iron only"],
    correctAnswer: 2,
    tip: "Magnesium ions are a key component of the chlorophyll molecule.",
  },
  {
    id: 13,
    question: "Mineral ions are absorbed from the soil by the roots mainly through",
    options: [
      "osmosis through phloem",
      "active transport through root hair cells",
      "photosynthesis",
      "respiration in the leaves",
    ],
    correctAnswer: 1,
    tip: "Active transport, using energy from respiration, moves mineral ions from soil into root hair cells against a concentration gradient.",
  },
  {
    id: 14,
    question: "In a food web, an organism that eats only plants is called a",
    options: ["producer", "primary consumer", "secondary consumer", "decomposer"],
    correctAnswer: 1,
    tip: "Herbivores that feed directly on producers are primary consumers.",
  },
  {
    id: 15,
    question: "A correct food chain is",
    options: ["grass → goat → lion", "lion → goat → grass", "goat → grass → lion", "grass → lion → goat"],
    correctAnswer: 0,
    tip: "Food chains start with a producer and arrows point in the direction of energy flow.",
  },
  {
    id: 16,
    question: "A pyramid of energy is always",
    options: [
      "inverted",
      "upright (largest at the bottom)",
      "the same width at every level",
      "made of two trophic levels only",
    ],
    correctAnswer: 1,
    tip: "Energy decreases up the trophic levels because most is lost as heat — producers always have most energy.",
  },
  {
    id: 17,
    question: "A food web differs from a food chain in that it",
    options: [
      "shows only producers",
      "shows interconnected food chains",
      "has only one consumer",
      "has no decomposers",
    ],
    correctAnswer: 1,
    tip: "A food web is many interlinked food chains showing how organisms feed at multiple levels.",
  },
  {
    id: 18,
    question: "Organisms at the end of a food chain have the least energy because",
    options: [
      "they reproduce slowly",
      "energy is lost as heat at each trophic level",
      "they do not respire",
      "they have no predators",
    ],
    correctAnswer: 1,
    tip: "Roughly 90% of energy is lost as heat, in faeces, and in respiration at each level.",
  },
  {
    id: 19,
    question: "A pure-breeding (homozygous) organism",
    options: [
      "has two identical alleles for a gene",
      "always produces varied offspring",
      "is always tall",
      "carries one allele only",
    ],
    correctAnswer: 0,
    tip: "Homozygous individuals have two identical alleles (e.g. TT or tt) and always pass the same allele to offspring.",
  },
  {
    id: 20,
    question: "When pure tall pea plants (TT) are crossed with pure dwarf (tt) plants, the F1 are all",
    options: ["dwarf (tt)", "tall (Tt)", "half tall and half dwarf", "intermediate height"],
    correctAnswer: 1,
    tip: "All offspring are heterozygous Tt; T (tall) is dominant so all are tall.",
  },
  {
    id: 21,
    question: "Crossing an F1 tall (Tt) plant with a pure dwarf (tt) plant gives a phenotype ratio of",
    options: ["3 tall : 1 dwarf", "1 tall : 1 dwarf", "all tall", "all dwarf"],
    correctAnswer: 1,
    tip: "Tt × tt → 1 Tt : 1 tt = 1 tall : 1 dwarf (a test cross).",
  },
  {
    id: 22,
    question: "A heterozygous organism",
    options: [
      "has two different alleles for a gene",
      "has two identical alleles for a gene",
      "has no alleles",
      "shows the recessive phenotype always",
    ],
    correctAnswer: 0,
    tip: "Heterozygous = two different alleles (e.g. Tt); the dominant allele is expressed.",
  },
  {
    id: 23,
    question: "Anaerobic respiration in yeast produces",
    options: [
      "lactic acid + energy",
      "ethanol + carbon dioxide + energy",
      "oxygen + glucose",
      "water + carbon dioxide only",
    ],
    correctAnswer: 1,
    tip: "Yeast ferments glucose to ethanol and CO2 — the basis of brewing and baking.",
  },
  {
    id: 24,
    question: "Yeast is used in baking mainly because the carbon dioxide it produces",
    options: ["kills bacteria", "makes the dough rise", "adds protein", "removes water"],
    correctAnswer: 1,
    tip: "CO2 bubbles trapped in the dough cause it to rise; the alcohol evaporates during baking.",
  },
  {
    id: 25,
    question: "Anaerobic respiration in human muscles produces",
    options: ["ethanol and CO2", "lactic acid and energy", "carbon dioxide and water", "oxygen and glucose"],
    correctAnswer: 1,
    tip: "When oxygen is short, glucose is partially broken down to lactic acid, releasing some energy.",
  },
  {
    id: 26,
    question: "Grafting is an artificial method of vegetative propagation that involves",
    options: [
      "joining a cutting (scion) to a rooted stock",
      "planting seeds in rows",
      "spraying flowers with pollen",
      "rooting a leaf in water",
    ],
    correctAnswer: 0,
    tip: "A scion of one plant is joined to the rootstock of another so they grow as one plant.",
  },
  {
    id: 27,
    question: "Which is an artificial method of birth control in humans?",
    options: ["Use of condoms", "Breast feeding only", "Eating a balanced diet", "Regular exercise"],
    correctAnswer: 0,
    tip: "Condoms are a barrier method of contraception; pills, IUDs and sterilisation are also artificial methods.",
  },
  {
    id: 28,
    question: "The Eustachian tube in the ear",
    options: [
      "detects sound vibrations",
      "equalises air pressure between the middle ear and the throat",
      "controls balance",
      "produces wax",
    ],
    correctAnswer: 1,
    tip: "The Eustachian tube connects the middle ear to the pharynx, balancing pressure on either side of the eardrum.",
  },
  {
    id: 29,
    question: "The cochlea in the ear is responsible for",
    options: [
      "balance only",
      "converting sound vibrations into nerve impulses",
      "producing earwax",
      "amplifying light",
    ],
    correctAnswer: 1,
    tip: "Sensory hair cells in the cochlea respond to vibrations and send impulses along the auditory nerve to the brain.",
  },
  {
    id: 30,
    question: "A sensory neurone differs from a motor neurone because it",
    options: [
      "carries impulses from receptors to the CNS",
      "carries impulses from the CNS to muscles",
      "has no axon",
      "is found only in the brain",
    ],
    correctAnswer: 0,
    tip: "Sensory neurones take impulses from sense organs to the central nervous system; motor neurones carry them to effectors.",
  },
  {
    id: 31,
    question: "In bright light, the pupil reflex causes the pupil to",
    options: ["become wider", "become narrower (constrict)", "stay the same size", "disappear"],
    correctAnswer: 1,
    tip: "Circular muscles of the iris contract in bright light, narrowing the pupil to protect the retina.",
  },
  {
    id: 32,
    question: "Pollination is the",
    options: [
      "fusion of male and female gametes",
      "transfer of pollen from anther to stigma",
      "production of seeds",
      "growth of pollen tubes",
    ],
    correctAnswer: 1,
    tip: "Pollination is just the transfer of pollen; fertilisation is the fusion of gametes that follows.",
  },
  {
    id: 33,
    question: "Fertilisation in flowering plants involves",
    options: [
      "the fusion of a male nucleus with the egg cell",
      "the transfer of pollen by wind",
      "the bursting of the anther",
      "the opening of the petals",
    ],
    correctAnswer: 0,
    tip: "After pollination, a pollen tube grows down the style and a male nucleus fuses with the egg in the ovule.",
  },
  {
    id: 34,
    question: "A fruit dispersed by animals is usually",
    options: ["light with hairs", "fleshy and brightly coloured or hooked", "winged", "explosive"],
    correctAnswer: 1,
    tip: "Animals eat fleshy fruits and pass the seeds in their droppings; hooked fruits stick to fur.",
  },
  {
    id: 35,
    question: "A fruit dispersed by water is usually",
    options: ["light and contains air spaces", "small and dry", "hooked", "explosive"],
    correctAnswer: 0,
    tip: "Water-dispersed fruits (e.g. coconut) have air spaces in a fibrous husk that helps them float.",
  },
  {
    id: 36,
    question: "Excretion is the removal of",
    options: [
      "undigested food from the gut",
      "metabolic waste products from the body",
      "sweat from the skin only",
      "carbon dioxide from the lungs only",
    ],
    correctAnswer: 1,
    tip: "Excretion is the removal of waste produced by metabolism (e.g. urea, CO2). Removal of undigested food is egestion.",
  },
  {
    id: 37,
    question: "Carbon dioxide is excreted from the human body mainly through the",
    options: ["kidneys", "lungs", "liver", "skin"],
    correctAnswer: 1,
    tip: "CO2 produced by respiration diffuses from blood into the alveoli and is breathed out.",
  },
  {
    id: 38,
    question: "Urea in humans is produced in the",
    options: ["kidneys", "lungs", "liver", "skin"],
    correctAnswer: 2,
    tip: "The liver deaminates excess amino acids, producing urea, which the kidneys then excrete.",
  },
  {
    id: 39,
    question: "Urea is removed from the blood by the",
    options: ["lungs", "kidneys", "liver", "stomach"],
    correctAnswer: 1,
    tip: "The kidneys filter urea from the blood and excrete it in urine.",
  },
  {
    id: 40,
    question: "Which of the following is not an excretory organ in humans?",
    options: ["Kidneys", "Lungs", "Skin", "Stomach"],
    correctAnswer: 3,
    tip: "The stomach digests food; it does not excrete metabolic waste.",
  },
];

// biologyTests[8] = test9;
