import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import conversationsReducer from '../components/home/conversationsSlice';
import settingsReducer from '../components/settings/settingsSlice';
import {api} from '../components/story/storyApi';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    conversations: conversationsReducer,
    settings: settingsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
