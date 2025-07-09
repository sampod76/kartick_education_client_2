import { baseApi } from './api/baseApi';
import { vimeoBaseApi } from './api/vimeoBaseApi';
import bannerCourseSlice from './features/bannerCourseSlice';
import cartSlice from './features/cartSlice';
import allChatMessageListReducer from './features/chatAllMessage';
import friendShipListReducer from './features/chatListSlice';
import modalSlice from './features/modalState';
import quizSlice from './features/quizSlice';
import userRoleSlice from './features/user/userRoleSlice';
export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  [vimeoBaseApi.reducerPath]: vimeoBaseApi.reducer,
  userInfo: userRoleSlice,
  quiz: quizSlice,
  cart: cartSlice,
  modal: modalSlice,
  bannerSearch: bannerCourseSlice,
  friendship: friendShipListReducer,
  allChatMessages: allChatMessageListReducer,
};
