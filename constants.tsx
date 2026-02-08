
import { Domain, Question } from './types';

export const MODULE_TIME = 35 * 60; // 35 minutes in seconds

export const QUESTIONS: Question[] = [
  // Module 1 (22 Questions)
  {
    id: 1,
    module: 1,
    text: "If $f(x) = 3x + 7$, what is the value of $f(4)$?",
    options: ["12", "19", "21", "28"],
    correctAnswer: "19",
    domain: Domain.ALGEBRA
  },
  {
    id: 2,
    module: 1,
    text: "The expression $(x^2 - 4)/(x - 2)$ is equivalent to which of the following for all $x \\neq 2$?",
    options: ["$x - 2$", "$x + 2$", "$x + 4$", "$x - 4$"],
    correctAnswer: "$x + 2$",
    domain: Domain.ALGEBRA
  },
  {
    id: 3,
    module: 1,
    text: "A rectangular box has a volume of 48 cubic inches. If the length is 4 inches and the width is 3 inches, what is the height of the box in inches?",
    options: ["2", "4", "6", "8"],
    correctAnswer: "4",
    domain: Domain.GEOMETRY
  },
  {
    id: 4,
    module: 1,
    text: "In a survey of 200 people, 60% preferred tea over coffee. How many people in the survey preferred tea?",
    options: ["60", "80", "120", "140"],
    correctAnswer: "120",
    domain: Domain.PROBLEM_SOLVING
  },
  {
    id: 5,
    module: 1,
    text: "What is the slope of the line given by the equation $2x - 3y = 9$?",
    options: ["$2/3$", "$-2/3$", "$3/2$", "$-3/2$"],
    correctAnswer: "$2/3$",
    domain: Domain.ALGEBRA
  },
  // Adding more dummy questions to fill the module
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 6,
    module: 1 as const,
    text: `Sample Question ${i + 6} for Module 1. Solve for $x$ where $x + ${i} = 20$.`,
    options: ["10", "15", (20 - i).toString(), "25"],
    correctAnswer: (20 - i).toString(),
    domain: i % 4 === 0 ? Domain.ALGEBRA : i % 4 === 1 ? Domain.ADVANCED_MATH : i % 4 === 2 ? Domain.GEOMETRY : Domain.PROBLEM_SOLVING
  })),

  // Module 2 (22 Questions)
  ...Array.from({ length: 22 }, (_, i) => ({
    id: i + 23,
    module: 2 as const,
    text: `Sample Question ${i + 23} for Module 2. This module is typically harder based on performance. What is the value of $2^{${i+1}}$?`,
    options: [Math.pow(2, i + 1).toString(), Math.pow(2, i).toString(), (Math.pow(2, i + 1) + 2).toString(), "None"],
    correctAnswer: Math.pow(2, i + 1).toString(),
    domain: i % 4 === 0 ? Domain.ALGEBRA : i % 4 === 1 ? Domain.ADVANCED_MATH : i % 4 === 2 ? Domain.GEOMETRY : Domain.PROBLEM_SOLVING
  }))
];
