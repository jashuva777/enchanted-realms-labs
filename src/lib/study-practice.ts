import { modules } from '@/lib/syllabus';
import { studyPrompts } from '@/lib/study-prompts';

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
  question: studyPrompts[module.number - 1]?.[index]?.[0] ?? `Define ${topic.title.toLowerCase()}.`,
  longQuestion: studyPrompts[module.number - 1]?.[index]?.[1] ?? `Explain ${topic.title.toLowerCase()} with a suitable example.`,
  answer: topic.summary,
  example: topic.example,
})));

export function filterStudyQuestions(module: string, search: string) {
  const query = search.trim().toLowerCase();
  return studyQuestions.filter(item => (module === 'all' || item.module === Number(module)) &&
    `${item.topic} ${item.question} ${item.longQuestion} ${item.answer}`.toLowerCase().includes(query));
}

export const questionMarkOptions = [2, 8] as const;