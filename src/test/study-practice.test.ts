import { describe, expect, it } from 'vitest';
import { modules } from '@/lib/syllabus';
import { studyPrompts } from '@/lib/study-prompts';
import { studyQuestions, filterStudyQuestions, questionMarkOptions } from '@/lib/study-practice';

describe('Syllabus practice rules', () => {
  it('covers every supplied topic across modules 1 through 5', () => {
    expect([...new Set(studyQuestions.map(item => item.module))]).toEqual([1, 2, 3, 4, 5]);
    for (const module of modules) {
      const questions = filterStudyQuestions(String(module.number), '');
      expect(questions.map(item => item.topic)).toEqual(module.pages.map(item => item.title));
      expect(studyPrompts[module.number - 1]).toHaveLength(module.pages.length);
    }
  });
  it('offers exactly the requested 2-mark and 8-mark categories', () => {
    expect(questionMarkOptions).toEqual([2, 8]);
  });
  it('restricts results to the selected module and searched subject', () => {
    expect(filterStudyQuestions('2', 'principal component analysis').map(item => item.id)).toEqual(['M2-Q11']);
    expect(filterStudyQuestions('1', 'principal component analysis')).toEqual([]);
  });
  it('uses the syllabus explanations as suggested viva answers', () => {
    expect(studyQuestions[0]?.answer).toBe(modules[0]?.pages[0]?.summary);
    expect(filterStudyQuestions('5', 'sentiment analysis')[0]?.answer).toBe(modules[4]?.pages[9]?.summary);
  });
});