import React from 'react';
import { QuizData } from '@/components/quiz/types';

export interface Reading {
  citation: string | React.ReactElement;
  url?: string;
}

export interface ScheduleQuiz {
  quizName: string;
  url: string;
}

export interface Activity {
  title: string;
  url?: string;
  draft?: number;
  excluded?: number;
}

export interface DiscussionQuestion {
  question: string | React.ReactElement;
}

export interface Quiz {
  title: string;
  slug: string;
  quizData?: QuizData;
  draft?: number;
}

export interface Assignment {
  titleShort: string;
  title: string;
  url?: string;
  draft?: number;
}

export interface MeetingData {
  date: string;
  topic: string;
  description?: string | React.ReactElement;
  activities?: Activity[];
  quizzes?: Quiz[];
  scheduleQuizzes?: ScheduleQuiz[]; // Quizzes from schedule.tsx with quizName and url
  readings?: Reading[];
  optionalReadings?: Reading[];
  holiday?: boolean;
  discussionQuestions?: DiscussionQuestion[];
  assigned?: Assignment | string | (Assignment | string)[];
  due?: Assignment | string | (Assignment | string)[];
}
