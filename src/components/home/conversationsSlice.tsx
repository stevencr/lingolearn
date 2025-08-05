import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {IConversationState} from '../../types/types';
import axios from 'axios';
import {AI_API_URL} from '@env';
import {samplePhrases} from '../settings/languages';
import {ApiMessageResponse, ApiAssessmentResponse} from '../../types/types';
import {
  extractJsonFromResponse,
  getRandomElement,
  parseOllamaResponse,
} from '../../utils/common';
import {
  DEBUG_ASSESSMENT_MULTIPLIER,
  DEBUG_ERROR_PROBS,
  DEBUG_MESSAGE_DELAY,
  DEBUG_MISTAKES_PROBS,
} from '../../constants/const';
import {ResponseParserFactory} from '../../utils/responseParserFactory';
const initialState: IConversationState = {
  status: 'idle',
  messages: [],
  error: null,
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    markAsPlayed(state, action) {
      const {id} = action.payload;
      const itemToUpdate = state.messages.find(item => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.played = true;
      }
    },
    addUserMessage(state, action) {
      const {id, message} = action.payload;
      state.messages.push({
        id,
        targetLang: message,
        isBot: false,
        played: false,
      });
    },
    clearAllMessages() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAIMessageAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAIMessageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getAIMessageAsync.fulfilled, (state, action) => {
        const {id, targetLang, sourceLang} = action.payload;
        const itemToUpdate = state.messages.find(item => item.id === id);
        if (itemToUpdate) {
          itemToUpdate.targetLang = targetLang;
          itemToUpdate.sourceLang = sourceLang;
          state.status = 'succeeded';
        } else {
          console.log('Could not find message...', id);
        }
      })
      .addCase(getAIAssessmentAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAIAssessmentAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log('assessment failed', action.error.message);
      })
      .addCase(getAIAssessmentAsync.fulfilled, (state, action) => {
        const {id, rating, mistakes} = action.payload;
        const itemToUpdate = state.messages.find(item => item.id === id);
        if (itemToUpdate) {
          itemToUpdate.errors = mistakes;
          itemToUpdate.rating = rating;
          state.status = 'succeeded';
        } else {
          console.log('Could not find message for assessment...', id);
        }
      });
  },
});

function filterPhrasesByLanguage(languageName: string): string[] {
  return samplePhrases.filter(phrase => phrase.name === languageName)[0]
    .samplePhrases;
}

const createMockMessageResponse = (
  id: string,
  targetLang: string,
): ApiMessageResponse => {
  const text: string = getRandomElement(filterPhrasesByLanguage(targetLang));
  return {id, targetLang: text, sourceLang: text};
};

const createMockAssessmentResponse = (id: string): ApiAssessmentResponse => {
  if (Math.random() < DEBUG_MISTAKES_PROBS) {
    return {
      id,
      rating: 3,
      mistakes: [
        'Oops, there were some mistakes',
        'You cannot say it like that',
        'You have spelt it wrong',
      ],
    };
  }
  return {
    id,
    rating: 5,
    mistakes: [],
  };
};

const getAIAssessmentDebug = async (
  id: string,
): Promise<ApiAssessmentResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //TODO reducer should be predicatable, move this to the payload as a debugOption
      if (Math.random() <= DEBUG_ERROR_PROBS) {
        reject(new Error('Assessment error in debug mode'));
      } else {
        resolve(createMockAssessmentResponse(id));
      }
    }, Math.random() * DEBUG_ASSESSMENT_MULTIPLIER);
  });
};

const getAIAssessmentFromApi = async (
  id: string,
  prompt: string,
  selectedModel: string, // Add this parameter
): Promise<ApiAssessmentResponse> => {
  // Get the endpoint for the selected model
  const endpoint = ResponseParserFactory.getEndpointForModel(selectedModel);

  // Prepare request body based on model type
  const requestBody = selectedModel.includes('gpt')
    ? {prompt} // OpenAI format
    : {model: selectedModel, prompt, stream: false}; // Ollama format

  const response = await axios.post(endpoint, requestBody, {
    headers: {'Content-Type': 'application/json'},
  });

  // Use the factory for assessment responses too
  const parser = ResponseParserFactory.createParser(selectedModel);
  const parsedData = parser.parse(response.data);

  return {
    ...parsedData,
    id,
  };
};

const getAIMessageDebug = async (
  id: string,
  targetLang: string,
): Promise<ApiMessageResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //TODO reducer should be predicatable, move this to the payload as a debugOption
      if (Math.random() <= DEBUG_ERROR_PROBS) {
        reject(new Error('Message error in debug mode'));
      } else {
        resolve(createMockMessageResponse(id, targetLang));
      }
    }, DEBUG_MESSAGE_DELAY);
  });
};

const getAIMessageFromApi = async (
  id: string,
  prompt: string,
  selectedModel: string,
): Promise<ApiMessageResponse> => {
  // Get the endpoint for the selected model
  const endpoint = ResponseParserFactory.getEndpointForModel(selectedModel);

  // Prepare request body based on model type
  const requestBody = selectedModel.includes('gpt')
    ? {prompt} // OpenAI format
    : {model: selectedModel, prompt, stream: false}; // Ollama format

  const response = await axios.post(endpoint, requestBody, {
    headers: {'Content-Type': 'application/json'},
  });

  console.log(`${selectedModel} response:`, response.data);

  // Use the factory to get the appropriate parser
  const parser = ResponseParserFactory.createParser(selectedModel);
  const parsedData = parser.parse(response.data);

  if (parsedData) {
    return {
      ...parsedData,
      id,
    };
  }

  console.log('No valid data found in the response.');
  return {
    targetLang: 'An error occurred',
    sourceLang: '',
    id,
  };
};

export const getAIMessageAsync = createAsyncThunk(
  'conversations/getAIMessage',
  async (payload: {
    id: string;
    prompt: string;
    targetLang: string;
    debugMode: boolean;
    selectedModel: string;
  }): Promise<ApiMessageResponse> => {
    const {id, prompt, targetLang, debugMode, selectedModel} = payload;

    return debugMode
      ? getAIMessageDebug(id, targetLang)
      : getAIMessageFromApi(id, prompt, selectedModel);
  },
);

export const getAIAssessmentAsync = createAsyncThunk(
  'conversations/getAIAssessment',
  async (payload: {
    id: string;
    prompt: string;
    targetLang: string;
    debugMode: boolean;
    selectedModel: string;
  }): Promise<ApiAssessmentResponse> => {
    const {id, prompt, debugMode, selectedModel} = payload;
    return debugMode
      ? getAIAssessmentDebug(id)
      : getAIAssessmentFromApi(id, prompt, selectedModel);
  },
);

export const {addMessage, addUserMessage, clearAllMessages, markAsPlayed} =
  conversationsSlice.actions;

export const selectAllConversations = (state: IConversationState) =>
  state.messages;

export default conversationsSlice.reducer;
