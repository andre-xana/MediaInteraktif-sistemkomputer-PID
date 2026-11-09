export type TabType = 'materi' | 'kuis-permainan' | 'asesmen' | 'dashboard-guru';

export interface MaterialSubSection {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  iconName: string;
  summary: string;
  keyPoints: string[];
  examples: string[];
  deepDive: {
    title: string;
    description: string;
    items?: { label: string; desc: string; detail?: string }[];
  };
  interactiveType?: 'trio-system' | 'ipos-pipeline' | 'motherboard-diagram' | 'os-layers' | 'dataflow-sim';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export type DeviceCategory = 'input' | 'proses' | 'output' | 'storage';

export interface DeviceItem {
  id: string;
  name: string;
  category: DeviceCategory;
  categoryLabel: string;
  icon: string;
  description: string;
  hint: string;
}

export type AssessmentQuestionType = 'mcq' | 'short_answer';

export interface AssessmentQuestion {
  id: number;
  type: AssessmentQuestionType;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  expectedKeywords?: string[];
  expectedAnswerSample?: string;
  explanation: string;
  scoreWeight: number;
}

export interface AssessmentResult {
  studentName: string;
  studentClass: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  answers: {
    questionId: number;
    userAnswer: string | number;
    isCorrect: boolean;
    earnedScore: number;
  }[];
}
