import { Question, SubjectTests } from "./types";

// SP2 Test 4 (2014) question images
import sp2q4_1 from "@/assets/sp2/q4-1.jpg";
import sp2q4_2 from "@/assets/sp2/q4-2.jpg";
import sp2q4_3 from "@/assets/sp2/q4-3.jpg";
import sp2q4_4 from "@/assets/sp2/q4-4.jpg";
import sp2q4_5 from "@/assets/sp2/q4-5.jpg";
import sp2q4_6 from "@/assets/sp2/q4-6.jpg";
import sp2q4_7 from "@/assets/sp2/q4-7.jpg";
import sp2q4_8 from "@/assets/sp2/q4-8.jpg";
import sp2q4_9 from "@/assets/sp2/q4-9.jpg";
import sp2q4_10 from "@/assets/sp2/q4-10.jpg";
import sp2q4_11 from "@/assets/sp2/q4-11.jpg";
import sp2q4_12 from "@/assets/sp2/q4-12.jpg";
import sp2q4_13 from "@/assets/sp2/q4-13.jpg";
import sp2q4_14 from "@/assets/sp2/q4-14.jpg";
import sp2q4_15 from "@/assets/sp2/q4-15.jpg";
import sp2q4_16 from "@/assets/sp2/q4-16.jpg";
import sp2q4_17 from "@/assets/sp2/q4-17.jpg";
import sp2q4_18 from "@/assets/sp2/q4-18.jpg";
import sp2q4_19 from "@/assets/sp2/q4-19.jpg";
import sp2q4_20 from "@/assets/sp2/q4-20.jpg";
import sp2q4_21 from "@/assets/sp2/q4-21.jpg";
import sp2q4_22 from "@/assets/sp2/q4-22.jpg";
import sp2q4_23 from "@/assets/sp2/q4-23.jpg";
import sp2q4_24 from "@/assets/sp2/q4-24.jpg";
import sp2q4_25 from "@/assets/sp2/q4-25.jpg";
import sp2q4_26 from "@/assets/sp2/q4-26.jpg";
import sp2q4_27 from "@/assets/sp2/q4-27.jpg";
import sp2q4_28 from "@/assets/sp2/q4-28.jpg";
import sp2q4_29 from "@/assets/sp2/q4-29.jpg";
import sp2q4_30 from "@/assets/sp2/q4-30.jpg";
import sp2q4_31 from "@/assets/sp2/q4-31.jpg";
import sp2q4_32 from "@/assets/sp2/q4-32.jpg";
import sp2q4_33 from "@/assets/sp2/q4-33.jpg";
import sp2q4_34 from "@/assets/sp2/q4-34.jpg";
import sp2q4_35 from "@/assets/sp2/q4-35.jpg";
import sp2q4_36 from "@/assets/sp2/q4-36.jpg";
import sp2q4_37 from "@/assets/sp2/q4-37.jpg";
import sp2q4_38 from "@/assets/sp2/q4-38.jpg";
import sp2q4_39 from "@/assets/sp2/q4-39.jpg";
import sp2q4_40 from "@/assets/sp2/q4-40.jpg";
import sp2q4_41 from "@/assets/sp2/q4-41.jpg";
import sp2q4_42 from "@/assets/sp2/q4-42.jpg";
import sp2q4_43 from "@/assets/sp2/q4-43.jpg";
import sp2q4_44 from "@/assets/sp2/q4-44.jpg";
import sp2q4_45 from "@/assets/sp2/q4-45.jpg";
import sp2q4_46 from "@/assets/sp2/q4-46.jpg";
import sp2q4_47 from "@/assets/sp2/q4-47.jpg";
import sp2q4_48 from "@/assets/sp2/q4-48.jpg";
import sp2q4_49 from "@/assets/sp2/q4-49.jpg";
import sp2q4_50 from "@/assets/sp2/q4-50.jpg";

const test1: Question[] = [
  {
    id: 101,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["square", "diamond", "hexagon", "diamond", "hexagon", "square", "hexagon", "square", "diamond"], options: [["circle"], ["cross"], ["star"], ["diamond"]], cols: 3, missing: 1 }
  },
  {
    id: 102,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A is a triangle, while all others are circles.",
    visual: { type: 'oddOneOut', items: ["triangle", "circle", "circle", "circle"] }
  },
  {
    id: 103,
    question: "If this shape is rotated 180\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Imagine turning the shape 180 degrees clockwise.",
    visual: { type: 'rotation', items: ["circle:g", "180"], options: [["hexagon:g:180"], ["circle:g:270"], ["circle:g"], ["circle:g:180"]] }
  },
  {
    id: 104,
    question: "Which two shapes in the row are exactly the same?",
    options: ["1 and 5", "2 and 5", "3 and 4", "1 and 3"],
    correctAnswer: 3,
    tip: "Shapes at positions 1 and 3 are identical.",
    visual: { type: 'matching', items: ["star", "triangle", "star", "square", "pentagon"] }
  },
  {
    id: 105,
    question: "If this shape is rotated 180\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Imagine turning the shape 180 degrees clockwise.",
    visual: { type: 'rotation', items: ["pentagon:e", "180"], options: [["pentagon:e:90"], ["pentagon:e:180"], ["square:e:180"], ["pentagon:e:270"]] }
  },
  {
    id: 106,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The pattern repeats every 3 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["hexagon:g", "pentagon:e", "square", "hexagon:g", "pentagon:e", "square"], options: [["pentagon:e"], ["cross:g"], ["triangle:e"], ["hexagon:g"]] }
  },
  {
    id: 107,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["star", "star:e", "star:g", "star", "star:e"], options: [["star"], ["star:e"], ["pentagon:g"], ["star:g"]] }
  },
  {
    id: 108,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["hexagon", "cross", "star", "cross", "star", "hexagon", "star", "hexagon", "cross"], options: [["triangle"], ["hexagon"], ["diamond"], ["circle"]], cols: 3, missing: 5 }
  },
  {
    id: 109,
    question: "If this shape is rotated 90\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Imagine turning the shape 90 degrees clockwise.",
    visual: { type: 'rotation', items: ["pentagon", "90"], options: [["pentagon:f:180"], ["pentagon:f:270"], ["square:f:90"], ["pentagon:f:90"]] }
  },
  {
    id: 110,
    question: "How many circles can you count in the image below?",
    options: ["7", "6", "5", "4"],
    correctAnswer: 1,
    tip: "Count carefully. There are 6 circles in the image.",
    visual: { type: 'counting', items: ["circle", "star", "pentagon", "circle", "circle", "circle", "circle", "pentagon", "circle"], target: 'circle' }
  },
  {
    id: 111,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["hexagon", "square", "star", "square", "star", "hexagon", "star", "hexagon", "square"], options: [["star"], ["cross"], ["diamond"], ["hexagon"]], cols: 3, missing: 7 }
  },
  {
    id: 112,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["pentagon", "diamond", "star"], options: [["cross"], ["circle"], ["hexagon"], ["square"]] }
  },
  {
    id: 113,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A is a cross, while all others are hexagons.",
    visual: { type: 'oddOneOut', items: ["cross:g", "hexagon:g", "hexagon:g", "hexagon:g"] }
  },
  {
    id: 114,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["square", "square:e", "square:g", "square:e", "square:g", "square", "square:g", "square", "square:e"], options: [["square:g"], ["square:e"], ["square"], ["diamond:g"]], cols: 3, missing: 6 }
  },
  {
    id: 115,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The first shape becomes an outline. Apply the same change to the third shape.",
    visual: { type: 'analogy', items: ["cross", "cross:e", "diamond"], options: [["hexagon:e"], ["diamond:e"], ["cross:e"], ["diamond:g"]] }
  },
  {
    id: 116,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["semicircle", "semicircle:f:90", "semicircle:f:180", "semicircle:f:270"], options: [["semicircle:e"], ["circle"], ["semicircle"], ["semicircle:f:45"]] }
  },
  {
    id: 117,
    question: "How many stars can you count in the image below?",
    options: ["7", "6", "8", "5"],
    correctAnswer: 0,
    tip: "Count carefully. There are 7 stars in the image.",
    visual: { type: 'counting', items: ["star", "cross", "square", "star", "hexagon", "star", "star", "circle", "star", "star", "star", "circle"], target: 'star' }
  },
  {
    id: 118,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle:f:45"], ["triangle:e"], ["triangle"], ["triangle"]] }
  },
  {
    id: 119,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["diamond"], options: [["star"], ["triangle"], ["square"], ["diamond"]] }
  },
  {
    id: 120,
    question: "How many squares can you count in the image below?",
    options: ["5", "7", "6", "4"],
    correctAnswer: 2,
    tip: "Count carefully. There are 6 squares in the image.",
    visual: { type: 'counting', items: ["diamond", "square", "square", "cross", "square", "square", "square", "square", "triangle"], target: 'square' }
  },
  {
    id: 121,
    question: "If this shape is rotated 90\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Imagine turning the shape 90 degrees clockwise.",
    visual: { type: 'rotation', items: ["diamond:g", "90"], options: [["star:g:90"], ["diamond:g:270"], ["diamond:g:90"], ["diamond:g:180"]] }
  },
  {
    id: 122,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["diamond:f:180", "diamond:f:180", "diamond:f:45", "diamond:f:180"] }
  },
  {
    id: 123,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The pattern repeats every 2 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["circle", "cross", "circle", "cross"], options: [["circle"], ["cross:g"], ["triangle"], ["hexagon:e"]] }
  },
  {
    id: 124,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["triangle:e"], options: [["triangle:e"], ["triangle:e:270"], ["triangle:e:90"], ["triangle:e:180"]] }
  },
  {
    id: 125,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The pattern repeats every 2 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["square:e", "circle:g", "square:e", "circle:g"], options: [["circle"], ["diamond"], ["square:e"], ["triangle:g"]] }
  },
  {
    id: 126,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The outline shape becomes filled. Apply the same change.",
    visual: { type: 'analogy', items: ["triangle:e", "triangle", "star:e"], options: [["star:g"], ["star"], ["circle:e"], ["triangle"]] }
  },
  {
    id: 127,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle:f:45"], ["triangle:e"], ["triangle"], ["cross"]] }
  },
  {
    id: 128,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle:f:45"], ["triangle:e"], ["square"], ["triangle"]] }
  },
  {
    id: 129,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The outline shape becomes filled. Apply the same change.",
    visual: { type: 'analogy', items: ["cross:e", "cross", "triangle:e"], options: [["cross"], ["hexagon:e"], ["triangle"], ["triangle:g"]] }
  },
  {
    id: 130,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["square", "pentagon", "triangle"], options: [["hexagon"], ["diamond"], ["cross"], ["star"]] }
  },
  {
    id: 131,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["cross", "cross:e", "cross:g", "cross", "cross:e"], options: [["cross"], ["star:g"], ["cross:g"], ["cross:e"]] }
  },
  {
    id: 132,
    question: "Which two shapes in the row are exactly the same?",
    options: ["1 and 5", "3 and 5", "1 and 3", "4 and 5"],
    correctAnswer: 3,
    tip: "Shapes at positions 4 and 5 are identical.",
    visual: { type: 'matching', items: ["diamond", "star", "triangle", "hexagon", "hexagon"] }
  },
  {
    id: 133,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["diamond", "diamond:e", "diamond:g", "diamond", "diamond:e"], options: [["star:g"], ["diamond:e"], ["diamond:g"], ["diamond"]] }
  },
  {
    id: 134,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["square"], options: [["square"], ["hexagon"], ["diamond"], ["circle"]] }
  },
  {
    id: 135,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A has a different fill (empty (outline)) from the others.",
    visual: { type: 'oddOneOut', items: ["hexagon:e", "hexagon", "hexagon", "hexagon"] }
  },
  {
    id: 136,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Shape B is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["triangle", "triangle:f:135", "triangle", "triangle"] }
  },
  {
    id: 137,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["cross"], options: [["triangle"], ["star"], ["circle"], ["cross"]] }
  },
  {
    id: 138,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["hexagon", "hexagon:e", "hexagon:g", "hexagon", "hexagon:e"], options: [["hexagon"], ["diamond:g"], ["hexagon:g"], ["hexagon:e"]] }
  },
  {
    id: 139,
    question: "Which two shapes in the row are exactly the same?",
    options: ["1 and 3", "3 and 4", "1 and 5", "2 and 4"],
    correctAnswer: 1,
    tip: "Shapes at positions 3 and 4 are identical.",
    visual: { type: 'matching', items: ["diamond", "star", "square", "square", "hexagon"] }
  },
  {
    id: 140,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The pattern repeats every 2 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["circle:e", "star", "circle:e", "star"], options: [["square:g"], ["triangle:g"], ["pentagon:g"], ["circle:e"]] }
  },
  {
    id: 141,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["diamond:f:90", "diamond:f:90", "diamond:f:135", "diamond:f:90"] }
  },
  {
    id: 142,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["circle", "hexagon", "square", "hexagon", "square", "circle", "square", "circle", "hexagon"], options: [["diamond"], ["pentagon"], ["hexagon"], ["square"]], cols: 3, missing: 8 }
  },
  {
    id: 143,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The outline shape becomes filled. Apply the same change.",
    visual: { type: 'analogy', items: ["hexagon:e", "hexagon", "star:e"], options: [["triangle:e"], ["star:g"], ["hexagon"], ["star"]] }
  },
  {
    id: 144,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["cross", "cross:e", "cross:g", "cross:e", "cross:g", "cross", "cross:g", "cross", "cross:e"], options: [["cross:e"], ["triangle:g"], ["cross:g"], ["cross"]], cols: 3, missing: 6 }
  },
  {
    id: 145,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Shape B is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["diamond:f:90", "diamond:f:135", "diamond:f:90", "diamond:f:90"] }
  },
  {
    id: 146,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["pentagon", "square", "hexagon"], options: [["star"], ["circle"], ["cross"], ["triangle"]] }
  },
  {
    id: 147,
    question: "Which two shapes in the row are exactly the same?",
    options: ["1 and 4", "2 and 3", "1 and 5", "3 and 5"],
    correctAnswer: 1,
    tip: "Shapes at positions 2 and 3 are identical.",
    visual: { type: 'matching', items: ["star", "diamond", "diamond", "triangle", "circle"] }
  },
  {
    id: 148,
    question: "How many circles can you count in the image below?",
    options: ["8", "7", "6", "5"],
    correctAnswer: 1,
    tip: "Count carefully. There are 7 circles in the image.",
    visual: { type: 'counting', items: ["star", "circle", "circle", "cross", "circle", "circle", "diamond", "square", "circle", "square", "circle", "circle", "hexagon", "star", "square"], target: 'circle' }
  },
  {
    id: 149,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["square", "square:e", "square:g", "square:e", "square:g", "square", "square:g", "square", "square:e"], options: [["square"], ["square:e"], ["diamond:g"], ["square:g"]], cols: 3, missing: 2 }
  },
  {
    id: 150,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Shape D is a pentagon, while all others are triangles.",
    visual: { type: 'oddOneOut', items: ["triangle:e", "triangle:e", "triangle:e", "pentagon:e"] }
  }
];

const test2: Question[] = [
  {
    id: 201,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["triangle:f:180", "triangle:f:90", "triangle:f:90", "triangle:f:90"] }
  },
  {
    id: 202,
    question: "How many hexagons can you count in the image below?",
    options: ["7", "4", "5", "6"],
    correctAnswer: 3,
    tip: "Count carefully. There are 6 hexagons in the image.",
    visual: { type: 'counting', items: ["hexagon", "hexagon", "hexagon", "hexagon", "diamond", "pentagon", "cross", "diamond", "hexagon", "hexagon"], target: 'hexagon' }
  },
  {
    id: 203,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["diamond:f:270", "diamond:f:180", "diamond:f:180", "diamond:f:180"] }
  },
  {
    id: 204,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Shape B is a diamond, while all others are triangles.",
    visual: { type: 'oddOneOut', items: ["triangle:e", "diamond:e", "triangle:e", "triangle:e"] }
  },
  {
    id: 205,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["diamond", "diamond:e", "diamond:g", "diamond:e", "diamond:g", "diamond", "diamond:g", "diamond", "diamond:e"], options: [["diamond:g"], ["diamond"], ["diamond:e"], ["star"]], cols: 3, missing: 7 }
  },
  {
    id: 206,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["circle", "circle:e", "circle:g", "circle", "circle:e"], options: [["circle:e"], ["circle:g"], ["circle"], ["pentagon:g"]] }
  },
  {
    id: 207,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["hexagon", "star", "diamond", "star", "diamond", "hexagon", "diamond", "hexagon", "star"], options: [["square"], ["star"], ["triangle"], ["cross"]], cols: 3, missing: 1 }
  },
  {
    id: 208,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["diamond"], options: [["pentagon"], ["cross"], ["diamond"], ["star"]] }
  },
  {
    id: 209,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["cross", "diamond", "circle"], options: [["hexagon"], ["triangle"], ["pentagon"], ["star"]] }
  },
  {
    id: 210,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["cross:g"], options: [["cross:g"], ["triangle:g"], ["hexagon:g"], ["star:g"]] }
  },
  {
    id: 211,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["cross", "cross:e", "cross:g", "cross", "cross:e"], options: [["cross:g"], ["cross:e"], ["cross"], ["star:g"]] }
  },
  {
    id: 212,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A is a triangle, while all others are pentagons.",
    visual: { type: 'oddOneOut', items: ["triangle:e", "pentagon:e", "pentagon:e", "pentagon:e"] }
  },
  {
    id: 213,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Shape B is a circle, while all others are hexagons.",
    visual: { type: 'oddOneOut', items: ["hexagon", "circle", "hexagon", "hexagon"] }
  },
  {
    id: 214,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The first shape becomes an outline. Apply the same change to the third shape.",
    visual: { type: 'analogy', items: ["pentagon", "pentagon:e", "circle"], options: [["cross:e"], ["pentagon:e"], ["circle:g"], ["circle:e"]] }
  },
  {
    id: 215,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Shape D has a different fill (empty (outline)) from the others.",
    visual: { type: 'oddOneOut', items: ["square", "square", "square", "square:e"] }
  },
  {
    id: 216,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["circle", "square", "diamond", "square", "diamond", "circle", "diamond", "circle", "square"], options: [["square"], ["star"], ["pentagon"], ["hexagon"]], cols: 3, missing: 1 }
  },
  {
    id: 217,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle:f:45"], ["triangle:e"], ["pentagon"], ["triangle"]] }
  },
  {
    id: 218,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["pentagon", "diamond", "cross"], options: [["circle"], ["square"], ["triangle"], ["hexagon"]] }
  },
  {
    id: 219,
    question: "If this shape is rotated 180\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Imagine turning the shape 180 degrees clockwise.",
    visual: { type: 'rotation', items: ["pentagon:g", "180"], options: [["pentagon:g:90"], ["pentagon:g:180"], ["pentagon:g:270"], ["triangle:g:180"]] }
  },
  {
    id: 220,
    question: "Which two shapes in the row are exactly the same?",
    options: ["2 and 4", "2 and 5", "1 and 4", "3 and 4"],
    correctAnswer: 3,
    tip: "Shapes at positions 3 and 4 are identical.",
    visual: { type: 'matching', items: ["star", "diamond", "cross", "cross", "circle"] }
  },
  {
    id: 221,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle"], ["circle"], ["triangle:e"], ["triangle:f:45"]] }
  },
  {
    id: 222,
    question: "If this shape is rotated 90\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Imagine turning the shape 90 degrees clockwise.",
    visual: { type: 'rotation', items: ["square:e", "90"], options: [["square:e:90"], ["square:e:180"], ["square:e:270"], ["pentagon:e:90"]] }
  },
  {
    id: 223,
    question: "How many hexagons can you count in the image below?",
    options: ["2", "3", "1", "4"],
    correctAnswer: 1,
    tip: "Count carefully. There are 3 hexagons in the image.",
    visual: { type: 'counting', items: ["triangle", "hexagon", "circle", "circle", "hexagon", "star", "triangle", "hexagon", "cross"], target: 'hexagon' }
  },
  {
    id: 224,
    question: "Which two shapes in the row are exactly the same?",
    options: ["3 and 5", "1 and 3", "2 and 3", "1 and 5"],
    correctAnswer: 1,
    tip: "Shapes at positions 1 and 3 are identical.",
    visual: { type: 'matching', items: ["diamond", "triangle", "diamond", "cross", "star"] }
  },
  {
    id: 225,
    question: "How many triangles can you count in the image below?",
    options: ["2", "5", "3", "4"],
    correctAnswer: 3,
    tip: "Count carefully. There are 4 triangles in the image.",
    visual: { type: 'counting', items: ["pentagon", "pentagon", "triangle", "cross", "triangle", "cross", "circle", "square", "triangle", "triangle", "star"], target: 'triangle' }
  },
  {
    id: 226,
    question: "Which two shapes in the row are exactly the same?",
    options: ["4 and 5", "2 and 5", "1 and 2", "3 and 4"],
    correctAnswer: 2,
    tip: "Shapes at positions 1 and 2 are identical.",
    visual: { type: 'matching', items: ["square", "square", "star", "triangle", "hexagon"] }
  },
  {
    id: 227,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["semicircle", "semicircle:f:90", "semicircle:f:180", "semicircle:f:270"], options: [["circle"], ["semicircle:f:45"], ["semicircle"], ["semicircle:e"]] }
  },
  {
    id: 228,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["arrow", "arrow", "arrow:f:45", "arrow"] }
  },
  {
    id: 229,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["cross", "triangle", "square", "triangle", "square", "cross", "square", "cross", "triangle"], options: [["cross"], ["diamond"], ["triangle"], ["pentagon"]], cols: 3, missing: 7 }
  },
  {
    id: 230,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle:f:45"], ["triangle"], ["star"], ["triangle:e"]] }
  },
  {
    id: 231,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["cross", "cross:e", "cross:g", "cross:e", "cross:g", "cross", "cross:g", "cross", "cross:e"], options: [["cross"], ["hexagon:g"], ["cross:e"], ["cross:g"]], cols: 3, missing: 4 }
  },
  {
    id: 232,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["diamond", "circle", "hexagon"], options: [["pentagon"], ["star"], ["triangle"], ["cross"]] }
  },
  {
    id: 233,
    question: "If this shape is rotated 180\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Imagine turning the shape 180 degrees clockwise.",
    visual: { type: 'rotation', items: ["diamond", "180"], options: [["diamond:f:180"], ["diamond"], ["star:f:180"], ["diamond:f:270"]] }
  },
  {
    id: 234,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["square", "square:e", "square:g", "square", "square:e"], options: [["square:g"], ["square:e"], ["square"], ["hexagon:g"]] }
  },
  {
    id: 235,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["square:g"], options: [["triangle:g"], ["pentagon:g"], ["square:g"], ["circle:g"]] }
  },
  {
    id: 236,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The pattern repeats every 3 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["triangle", "cross:g", "diamond:g", "triangle", "cross:g", "diamond:g"], options: [["star"], ["circle:g"], ["hexagon:g"], ["triangle"]] }
  },
  {
    id: 237,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["circle"], options: [["star"], ["circle"], ["pentagon"], ["diamond"]] }
  },
  {
    id: 238,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["pentagon", "star", "cross", "star", "cross", "pentagon", "cross", "pentagon", "star"], options: [["star"], ["diamond"], ["pentagon"], ["circle"]], cols: 3, missing: 7 }
  },
  {
    id: 239,
    question: "If this shape is rotated 90\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Imagine turning the shape 90 degrees clockwise.",
    visual: { type: 'rotation', items: ["hexagon", "90"], options: [["hexagon:f:270"], ["triangle:f:90"], ["hexagon"], ["hexagon:f:90"]] }
  },
  {
    id: 240,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The pattern repeats every 2 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["diamond:g", "triangle", "diamond:g", "triangle"], options: [["cross"], ["pentagon"], ["square:g"], ["diamond:g"]] }
  },
  {
    id: 241,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["triangle", "triangle", "triangle:f:270", "triangle"] }
  },
  {
    id: 242,
    question: "Which two shapes in the row are exactly the same?",
    options: ["3 and 5", "2 and 3", "1 and 4", "4 and 5"],
    correctAnswer: 2,
    tip: "Shapes at positions 1 and 4 are identical.",
    visual: { type: 'matching', items: ["triangle", "star", "diamond", "triangle", "circle"] }
  },
  {
    id: 243,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["hexagon", "hexagon:e", "hexagon:g", "hexagon:e", "hexagon:g", "hexagon", "hexagon:g", "hexagon", "hexagon:e"], options: [["diamond:g"], ["hexagon:e"], ["hexagon"], ["hexagon:g"]], cols: 3, missing: 6 }
  },
  {
    id: 244,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The shape changes from the first pair. Apply the same shape change with the same fill.",
    visual: { type: 'analogy', items: ["cross", "square", "cross:e"], options: [["cross:e"], ["square:g"], ["triangle:e"], ["square:e"]] }
  },
  {
    id: 245,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The pattern repeats every 3 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["star", "square:e", "diamond:e", "star", "square:e", "diamond:e"], options: [["triangle:g"], ["hexagon:g"], ["pentagon:e"], ["star"]] }
  },
  {
    id: 246,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The outline shape becomes filled. Apply the same change.",
    visual: { type: 'analogy', items: ["diamond:e", "diamond", "triangle:e"], options: [["triangle"], ["triangle:g"], ["diamond"], ["star:e"]] }
  },
  {
    id: 247,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["hexagon", "hexagon:e", "hexagon:g", "hexagon", "hexagon:e"], options: [["hexagon"], ["hexagon:e"], ["hexagon:g"], ["pentagon:g"]] }
  },
  {
    id: 248,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The outline shape becomes filled. Apply the same change.",
    visual: { type: 'analogy', items: ["diamond:e", "diamond", "cross:e"], options: [["cross:g"], ["triangle:e"], ["cross"], ["diamond"]] }
  },
  {
    id: 249,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The pattern repeats every 3 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["pentagon:g", "diamond", "cross:g", "pentagon:g", "diamond", "cross:g"], options: [["diamond:g"], ["square:e"], ["pentagon:g"], ["star"]] }
  },
  {
    id: 250,
    question: "How many squares can you count in the image below?",
    options: ["5", "2", "3", "4"],
    correctAnswer: 3,
    tip: "Count carefully. There are 4 squares in the image.",
    visual: { type: 'counting', items: ["star", "star", "pentagon", "cross", "square", "square", "diamond", "diamond", "star", "hexagon", "square", "square"], target: 'square' }
  }
];

const test3: Question[] = [
  {
    id: 301,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle:e"], ["triangle:f:45"], ["diamond"], ["triangle"]] }
  },
  {
    id: 302,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["triangle", "triangle:f:90", "triangle:f:180", "triangle:f:270"], options: [["triangle"], ["star"], ["triangle:e"], ["triangle:f:45"]] }
  },
  {
    id: 303,
    question: "Which two shapes in the row are exactly the same?",
    options: ["1 and 5", "3 and 4", "1 and 4", "1 and 3"],
    correctAnswer: 0,
    tip: "Shapes at positions 1 and 5 are identical.",
    visual: { type: 'matching', items: ["pentagon", "cross", "triangle", "star", "pentagon"] }
  },
  {
    id: 304,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["square", "square:e", "square:g", "square", "square:e"], options: [["square:g"], ["hexagon:g"], ["square:e"], ["square"]] }
  },
  {
    id: 305,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["diamond", "pentagon", "circle"], options: [["square"], ["star"], ["cross"], ["hexagon"]] }
  },
  {
    id: 306,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["hexagon", "hexagon:e", "hexagon:g", "hexagon:e", "hexagon:g", "hexagon", "hexagon:g", "hexagon", "hexagon:e"], options: [["circle:g"], ["hexagon:e"], ["hexagon:g"], ["hexagon"]], cols: 3, missing: 6 }
  },
  {
    id: 307,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C is a diamond, while all others are hexagons.",
    visual: { type: 'oddOneOut', items: ["hexagon:e", "hexagon:e", "diamond:e", "hexagon:e"] }
  },
  {
    id: 308,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["triangle", "triangle:f:180", "triangle:f:180", "triangle:f:180"] }
  },
  {
    id: 309,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["pentagon", "cross", "diamond"], options: [["square"], ["circle"], ["triangle"], ["star"]] }
  },
  {
    id: 310,
    question: "If this shape is rotated 270\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Imagine turning the shape 270 degrees clockwise.",
    visual: { type: 'rotation', items: ["cross:e", "270"], options: [["triangle:e:270"], ["cross:e:270"], ["cross:e:90"], ["cross:e"]] }
  },
  {
    id: 311,
    question: "Complete the analogy.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Each shape in the first pair maps to a shape in the second pair.",
    visual: { type: 'analogy', items: ["diamond", "hexagon", "pentagon"], options: [["triangle"], ["square"], ["circle"], ["cross"]] }
  },
  {
    id: 312,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["star:g"], options: [["diamond:g"], ["star:g"], ["cross:g"], ["pentagon:g"]] }
  },
  {
    id: 313,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["triangle", "diamond", "hexagon", "diamond", "hexagon", "triangle", "hexagon", "triangle", "diamond"], options: [["triangle"], ["pentagon"], ["diamond"], ["star"]], cols: 3, missing: 7 }
  },
  {
    id: 314,
    question: "How many stars can you count in the image below?",
    options: ["5", "2", "4", "3"],
    correctAnswer: 2,
    tip: "Count carefully. There are 4 stars in the image.",
    visual: { type: 'counting', items: ["star", "cross", "star", "triangle", "triangle", "star", "star"], target: 'star' }
  },
  {
    id: 315,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["diamond"], options: [["circle"], ["diamond"], ["hexagon"], ["pentagon"]] }
  },
  {
    id: 316,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["square", "square:e", "square:g", "square", "square:e"], options: [["square:e"], ["square:g"], ["square"], ["hexagon:g"]] }
  },
  {
    id: 317,
    question: "How many hexagons can you count in the image below?",
    options: ["6", "4", "7", "5"],
    correctAnswer: 0,
    tip: "Count carefully. There are 6 hexagons in the image.",
    visual: { type: 'counting', items: ["square", "hexagon", "hexagon", "cross", "hexagon", "diamond", "hexagon", "hexagon", "hexagon"], target: 'hexagon' }
  },
  {
    id: 318,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The pattern repeats every 2 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["pentagon", "hexagon:e", "pentagon", "hexagon:e"], options: [["pentagon"], ["star"], ["square:g"], ["hexagon"]] }
  },
  {
    id: 319,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["diamond:f:90", "diamond:f:90", "diamond", "diamond:f:90"] }
  },
  {
    id: 320,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["diamond", "diamond:e", "diamond:g", "diamond:e", "diamond:g", "diamond", "diamond:g", "diamond", "diamond:e"], options: [["diamond:g"], ["star"], ["diamond"], ["diamond:e"]], cols: 3, missing: 7 }
  },
  {
    id: 321,
    question: "Which two shapes in the row are exactly the same?",
    options: ["1 and 2", "2 and 4", "1 and 4", "2 and 5"],
    correctAnswer: 1,
    tip: "Shapes at positions 2 and 4 are identical.",
    visual: { type: 'matching', items: ["hexagon", "diamond", "triangle", "diamond", "circle"] }
  },
  {
    id: 322,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C has a different fill (gray) from the others.",
    visual: { type: 'oddOneOut', items: ["hexagon", "hexagon", "hexagon:g", "hexagon"] }
  },
  {
    id: 323,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The outline shape becomes filled. Apply the same change.",
    visual: { type: 'analogy', items: ["star:e", "star", "hexagon:e"], options: [["star:e"], ["star"], ["hexagon:g"], ["hexagon"]] }
  },
  {
    id: 324,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Shape C has a different fill (gray) from the others.",
    visual: { type: 'oddOneOut', items: ["diamond:e", "diamond:e", "diamond:g", "diamond:e"] }
  },
  {
    id: 325,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The first shape becomes an outline. Apply the same change to the third shape.",
    visual: { type: 'analogy', items: ["cross", "cross:e", "triangle"], options: [["cross:e"], ["triangle:g"], ["circle:e"], ["triangle:e"]] }
  },
  {
    id: 326,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["pentagon", "circle", "square", "circle", "square", "pentagon", "square", "pentagon", "circle"], options: [["square"], ["star"], ["pentagon"], ["diamond"]], cols: 3, missing: 6 }
  },
  {
    id: 327,
    question: "If this shape is rotated 90\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Imagine turning the shape 90 degrees clockwise.",
    visual: { type: 'rotation', items: ["triangle:g", "90"], options: [["triangle:g"], ["triangle:g:270"], ["triangle:g:90"], ["diamond:g:90"]] }
  },
  {
    id: 328,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["circle", "circle:e", "circle:g", "circle", "circle:e"], options: [["circle:g"], ["circle:e"], ["square:g"], ["circle"]] }
  },
  {
    id: 329,
    question: "What comes next? Look at how the shading changes.",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The fill pattern (solid, outline, gray) repeats in a cycle.",
    visual: { type: 'sequence', items: ["star", "star:e", "star:g", "star", "star:e"], options: [["star:e"], ["star"], ["star:g"], ["circle:g"]] }
  },
  {
    id: 330,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["diamond", "diamond:f:90", "diamond:f:90", "diamond:f:90"] }
  },
  {
    id: 331,
    question: "Which two shapes in the row are exactly the same?",
    options: ["1 and 5", "4 and 5", "1 and 3", "2 and 4"],
    correctAnswer: 2,
    tip: "Shapes at positions 1 and 3 are identical.",
    visual: { type: 'matching', items: ["hexagon", "star", "hexagon", "triangle", "cross"] }
  },
  {
    id: 332,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["cross", "star", "circle", "star", "circle", "cross", "circle", "cross", "star"], options: [["star"], ["diamond"], ["cross"], ["triangle"]], cols: 3, missing: 5 }
  },
  {
    id: 333,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["semicircle", "semicircle:f:90", "semicircle:f:180", "semicircle:f:270"], options: [["semicircle"], ["square"], ["semicircle:f:45"], ["semicircle:e"]] }
  },
  {
    id: 334,
    question: "Which two shapes in the row are exactly the same?",
    options: ["2 and 4", "1 and 4", "2 and 3", "1 and 2"],
    correctAnswer: 3,
    tip: "Shapes at positions 1 and 2 are identical.",
    visual: { type: 'matching', items: ["star", "star", "pentagon", "cross", "diamond"] }
  },
  {
    id: 335,
    question: "How many squares can you count in the image below?",
    options: ["4", "6", "5", "3"],
    correctAnswer: 2,
    tip: "Count carefully. There are 5 squares in the image.",
    visual: { type: 'counting', items: ["star", "square", "pentagon", "square", "square", "circle", "square", "diamond", "square"], target: 'square' }
  },
  {
    id: 336,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The pattern repeats every 3 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["pentagon", "triangle:e", "star:e", "pentagon", "triangle:e", "star:e"], options: [["pentagon"], ["star"], ["square:e"], ["hexagon:e"]] }
  },
  {
    id: 337,
    question: "How many hexagons can you count in the image below?",
    options: ["5", "8", "7", "6"],
    correctAnswer: 2,
    tip: "Count carefully. There are 7 hexagons in the image.",
    visual: { type: 'counting', items: ["square", "hexagon", "hexagon", "square", "hexagon", "hexagon", "hexagon", "diamond", "cross", "hexagon", "hexagon"], target: 'hexagon' }
  },
  {
    id: 338,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The pattern repeats every 3 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["pentagon", "circle:g", "cross", "pentagon", "circle:g", "cross"], options: [["diamond:g"], ["pentagon"], ["cross:g"], ["triangle:g"]] }
  },
  {
    id: 339,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "The first shape becomes an outline. Apply the same change to the third shape.",
    visual: { type: 'analogy', items: ["square", "square:e", "cross"], options: [["circle:e"], ["square:e"], ["cross:g"], ["cross:e"]] }
  },
  {
    id: 340,
    question: "Which shape with the correct shading completes the grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Each row and column has one filled, one outline, and one gray shape.",
    visual: { type: 'patternGrid', items: ["triangle", "triangle:e", "triangle:g", "triangle:e", "triangle:g", "triangle", "triangle:g", "triangle", "triangle:e"], options: [["triangle:e"], ["triangle"], ["square:e"], ["triangle:g"]], cols: 3, missing: 1 }
  },
  {
    id: 341,
    question: "If this shape is rotated 90\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Imagine turning the shape 90 degrees clockwise.",
    visual: { type: 'rotation', items: ["circle:e", "90"], options: [["square:e:90"], ["circle:e:90"], ["circle:e:270"], ["circle:e"]] }
  },
  {
    id: 342,
    question: "Which shape is the odd one out?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "Shape A has a different fill (empty (outline)) from the others.",
    visual: { type: 'oddOneOut', items: ["cross:e", "cross:g", "cross:g", "cross:g"] }
  },
  {
    id: 343,
    question: "Which shape completes the pattern grid?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "Look at the pattern in each row and column. The shapes follow a repeating sequence.",
    visual: { type: 'patternGrid', items: ["hexagon", "circle", "star", "circle", "star", "hexagon", "star", "hexagon", "circle"], options: [["diamond"], ["hexagon"], ["cross"], ["square"]], cols: 3, missing: 5 }
  },
  {
    id: 344,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["hexagon"], options: [["hexagon"], ["square"], ["triangle"], ["star"]] }
  },
  {
    id: 345,
    question: "If this shape is rotated 90\u00b0, which option shows the result?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Imagine turning the shape 90 degrees clockwise.",
    visual: { type: 'rotation', items: ["pentagon", "90"], options: [["pentagon:f:180"], ["cross:f:90"], ["pentagon:f:270"], ["pentagon:f:90"]] }
  },
  {
    id: 346,
    question: "Which option shows the mirror image of this shape?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "A mirror image is a reflection. Look for the shape that is flipped horizontally.",
    visual: { type: 'mirror', items: ["star"], options: [["hexagon"], ["star"], ["pentagon"], ["circle"]] }
  },
  {
    id: 347,
    question: "Complete the analogy: the first shape is to the second as the third is to...?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    tip: "The first shape becomes an outline. Apply the same change to the third shape.",
    visual: { type: 'analogy', items: ["diamond", "diamond:e", "hexagon"], options: [["star:e"], ["hexagon:e"], ["diamond:e"], ["hexagon:g"]] }
  },
  {
    id: 348,
    question: "What shape comes next in the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    tip: "The pattern repeats every 3 shapes. The next shape continues the pattern.",
    visual: { type: 'sequence', items: ["hexagon:g", "diamond:e", "pentagon", "hexagon:g", "diamond:e", "pentagon"], options: [["hexagon:g"], ["cross:g"], ["circle:g"], ["pentagon:g"]] }
  },
  {
    id: 349,
    question: "Which shape is rotated differently from the others?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    tip: "Shape D is rotated to a different angle than the rest.",
    visual: { type: 'oddOneOut', items: ["triangle:f:90", "triangle:f:90", "triangle:f:90", "triangle:f:45"] }
  },
  {
    id: 350,
    question: "The shape rotates in each step. What comes next?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    tip: "The shape rotates 90\u00b0 clockwise each time, completing a full turn.",
    visual: { type: 'sequence', items: ["arrow", "arrow:f:90", "arrow:f:180", "arrow:f:270"], options: [["arrow:e"], ["arrow:f:45"], ["arrow"], ["circle"]] }
  }
];

const test4: Question[] = [
  { id: 351, question: "Which one is different?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "Option C has the cross-hatched fill in a different position compared to the others.", image: sp2q4_1 },
  { id: 352, question: "Which one is different?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "Option C has the eye positioned differently from the other three bird-like figures.", image: sp2q4_2 },
  { id: 353, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The number of arrow-like elements increases each step. Follow the progression of added details.", image: sp2q4_3 },
  { id: 354, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The inner triangle's fill changes in a cycle: dotted → grey → smaller. Option D continues the pattern.", image: sp2q4_4 },
  { id: 355, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The arrow shapes grow in size each step while maintaining their striped fill. The next is the largest.", image: sp2q4_5 },
  { id: 356, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "Follow the pattern of shapes rotating and fills changing across the grid cells.", image: sp2q4_6 },
  { id: 357, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The fills change across rows and columns in a systematic pattern. Track the dotted and striped regions.", image: sp2q4_7 },
  { id: 358, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The number of small triangles on the grey shape increases each step. Count them carefully.", image: sp2q4_8 },
  { id: 359, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The person-like figure's body fill alternates between dotted and grey in a regular cycle.", image: sp2q4_9 },
  { id: 360, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "Each row changes the fill pattern diagonally. Follow the transformation to find the missing piece.", image: sp2q4_10 },
  { id: 361, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "Look at both row and column patterns. Each shape and fill appears once per row and column.", image: sp2q4_11 },
  { id: 362, question: "Which one is different?", options: ["A", "B", "C", "D"], correctAnswer: 1, tip: "Option B has the diamond element in a different position compared to the other arrow-like figures.", image: sp2q4_12 },
  { id: 363, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The shapes transform across rows. Follow the transformation rule to find the missing cell.", image: sp2q4_13 },
  { id: 364, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The arrow-like shapes rotate and the dots/fills change position across the grid.", image: sp2q4_14 },
  { id: 365, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The striped fill changes position in each step. The shape outline remains the same.", image: sp2q4_15 },
  { id: 366, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "Each row shows shapes becoming more complex. The fills progress from empty to gridded to bold.", image: sp2q4_16 },
  { id: 367, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The footprint-like shapes grow into longer chains. The pattern adds more connected elements.", image: sp2q4_17 },
  { id: 368, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The number of elements increases in each step following a triangular number pattern.", image: sp2q4_18 },
  { id: 369, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The shape's outline stays the same while the internal fill pattern changes systematically.", image: sp2q4_19 },
  { id: 370, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The shape rotates and the fill changes across the grid following a logical rule.", image: sp2q4_20 },
  { id: 371, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The grid alternates between two shape types. Follow the alternating pattern.", image: sp2q4_21 },
  { id: 372, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The diamond shape rotates and the dashed line moves position each step.", image: sp2q4_22 },
  { id: 373, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The outline changes from solid to dashed progressively. Follow the dashed line pattern.", image: sp2q4_23 },
  { id: 374, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The shapes transform systematically across rows and columns in the grid.", image: sp2q4_24 },
  { id: 375, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "Track how the hatching, solid, and empty fills rotate through the shapes.", image: sp2q4_25 },
  { id: 376, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The number of elements doubles in each step. Count the shapes to predict the next.", image: sp2q4_26 },
  { id: 377, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The small square moves to a different position on the semicircle each step, following a clockwise pattern.", image: sp2q4_27 },
  { id: 378, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 1, tip: "The yin-yang shape rotates and the arrow/bar elements change position following a pattern.", image: sp2q4_28 },
  { id: 379, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The shapes rotate and the fill patterns change. Track both orientation and internal fills.", image: sp2q4_29 },
  { id: 380, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The number of internal elements increases across rows while the outer shape changes across columns.", image: sp2q4_30 },
  { id: 381, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The fills of the elements swap in each step. Track which element becomes solid, grey, or striped.", image: sp2q4_31 },
  { id: 382, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 1, tip: "The arrows rotate 90° clockwise each step while the central circle remains unchanged.", image: sp2q4_32 },
  { id: 383, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "Follow the transformation rule across the grid. Each cell modifies the shape from the previous one.", image: sp2q4_33 },
  { id: 384, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The fill inverts between black and striped in each step. The shape outline remains the same.", image: sp2q4_34 },
  { id: 385, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The shape rotates and changes fill. The missing piece follows the same transformation.", image: sp2q4_35 },
  { id: 386, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The pentagon-like shape rotates and the hatched internal element moves to the next position.", image: sp2q4_36 },
  { id: 387, question: "Which one is different?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "Option D is missing the pointed extension that the other three capsule-like shapes have.", image: sp2q4_37 },
  { id: 388, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The grid follows a repeating pattern of three different shapes with three different fills.", image: sp2q4_38 },
  { id: 389, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The butterfly-like figure's fills alternate in a pattern. Track the hatching and solid areas.", image: sp2q4_39 },
  { id: 390, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The entire figure rotates 90° clockwise each step. Find the option matching the next rotation.", image: sp2q4_40 },
  { id: 391, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 1, tip: "The triangles are arranged in a growing pattern. Count: 1, 3, 6... the next should follow the triangular number sequence.", image: sp2q4_41 },
  { id: 392, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The figure-8 shape transforms between two states. The dashed line and solid elements alternate positions.", image: sp2q4_42 },
  { id: 393, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The cylinder and cone shapes rotate clockwise. Track their relative positions.", image: sp2q4_43 },
  { id: 394, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The outer and inner shapes swap their fills in each step of the grid.", image: sp2q4_44 },
  { id: 395, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "The shape is reflected vertically. Track the triangle and arrow positions to find the mirror image.", image: sp2q4_45 },
  { id: 396, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The jigsaw-like shape rotates 90° clockwise each step. The internal diamond and arrow maintain their positions.", image: sp2q4_46 },
  { id: 397, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 0, tip: "The shapes in the grid follow a rotation and fill-change pattern. The missing piece completes both rules.", image: sp2q4_47 },
  { id: 398, question: "Which one is different?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "Option C has the crosshatch pattern on a different blade compared to the other propeller shapes.", image: sp2q4_48 },
  { id: 399, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 2, tip: "Each row shows the same block letter shape rotated/reflected. Follow the pattern to find the missing cell.", image: sp2q4_49 },
  { id: 400, question: "Which one comes next?", options: ["A", "B", "C", "D"], correctAnswer: 3, tip: "The L-shape rotates 90° in each cell. The fill alternates between striped and hatched across rows.", image: sp2q4_50 },
];
const test5: Question[] = [];
const test6: Question[] = [];
const test7: Question[] = [];
const test8: Question[] = [];
const test9: Question[] = [];
const test10: Question[] = [];

export const specialPaper2Tests: SubjectTests = [
  test1, test2, test3, test4, test5,
  test6, test7, test8, test9, test10,
];
