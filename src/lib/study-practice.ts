import { modules } from '@/lib/syllabus';

export type StudyQuestion = {
  id: string;
  module: number;
  topic: string;
  question: string;
  longQuestion: string;
  answer: string;
  example: string;
};

export const studyQuestions: StudyQuestion[] = modules.flatMap(module => module.pages.map((topic, index) => ({
  id: `M${module.number}-Q${String(index + 1).padStart(2, '0')}`,
  module: module.number,
  topic: topic.title,
  question: `What is meant by ${topic.title.toLowerCase()}?`,
  longQuestion: `Explain ${topic.title.toLowerCase()} in detail. Discuss its purpose, key concepts, practical application and limitations with a suitable example.`,
  answer: topic.summary,
  example: topic.example,
})));

export function filterStudyQuestions(module: string, search: string) {
  const query = search.trim().toLowerCase();
  return studyQuestions.filter(item => (module === 'all' || item.module === Number(module)) &&
    `${item.topic} ${item.question} ${item.longQuestion} ${item.answer}`.toLowerCase().includes(query));
}

export const questionMarkOptions = [2, 8] as const;