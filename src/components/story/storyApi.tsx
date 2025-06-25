import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {AI_API_URL} from '@env';
import Questions from './Questions';

interface AnswerOption {
  option: string;
  correct: boolean;
}
interface Questions {
  questions: Question[];
}
export interface Question {
  question: string;
  answerOptions: AnswerOption[];
}

export interface Story {
  title: string;
  by: string;
  story: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: AI_API_URL,
  }),
  endpoints: builder => ({
    getStory: builder.query<Story, unknown>({
      query: data => ({
        url: '',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getQuestions: builder.query<Question[], unknown>({
      query: data => ({
        url: '',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: Questions) => {
        return response.questions;
      },
    }),
  }),
});

export const {useGetStoryQuery, useGetQuestionsQuery} = api;
