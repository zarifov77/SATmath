
export enum Domain {
  ALGEBRA = 'Algebra',
  ADVANCED_MATH = 'Advanced Math',
  PROBLEM_SOLVING = 'Problem-Solving and Data Analysis',
  GEOMETRY = 'Geometry and Trigonometry'
}

export interface Question {
  id: number;
  module: 1 | 2;
  text: string;
  options: string[];
  correctAnswer: string;
  domain: Domain;
}

export type Answers = Record<number, string>;
export type ReviewFlags = Record<number, boolean>;
export type Strikethroughs = Record<number, string[]>; // questionId -> list of crossed out options

export type AppView = 'exam' | 'review' | 'break' | 'results';

export interface ExamState {
  view: AppView;
  currentModule: 1 | 2;
  currentQuestionIndex: number;
  answers: Answers;
  reviewFlags: ReviewFlags;
  strikethroughs: Strikethroughs;
  timer: number;
  isTimerVisible: boolean;
  breakTimer: number;
}
