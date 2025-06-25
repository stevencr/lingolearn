export interface ConversationProps {
  isBot: boolean;
  msg: string;
  isCorrect?: boolean;
  err: string;
}

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface IConversationState {
  status: StatusType;
  error: string | null | undefined;
  messages: IMessage[];
}
export interface IMessage {
  id: string;
  targetLang: string;
  sourceLang?: string | null;
  isBot: boolean;
  rating?: number;
  errors?: string[];
  played: boolean;
}

export interface IAssessment {
  rating: number;
  mistakes: string[];
}

export interface ApiMessageResponse {
  id: string;
  targetLang: string;
  sourceLang: string;
}

export interface ApiAssessmentResponse {
  id: string;
  rating: number;
  mistakes: string[];
}

interface ApiStoryQuestionOption {
  option: string;
  isCorrect: boolean;
}
export interface ApiStoryResponse {
  story: string;
  questionOptions: {
    options: ApiStoryQuestionOption[];
  };
}
