import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { vimeoBaseApi } from './api/vimeoBaseApi';
import { reducer } from './rootReducer';

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(vimeoBaseApi.middleware),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
