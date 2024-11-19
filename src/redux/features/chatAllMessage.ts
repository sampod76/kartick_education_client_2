import { ENUM_STATUS, ENUM_YN } from '@/constants/globalEnums';
import { IUserRef } from '@/types/userTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFileAfterUpload } from '../../types/globalType';

// Chat message interface
export interface IChatMessage {
  _id: string;
  sender: IUserRef;
  receiver: IUserRef;
  message: string;
  friendShipId: string;
  uuid?: string;
  files?: IFileAfterUpload[];
  isSeen: ENUM_YN;
  status: ENUM_STATUS;
  createTime?: Date | string;
  isDelete: ENUM_YN;
  isOnline: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Define the initial state as an object with `friendShipId` keys containing arrays of `IChatMessage`
//friendShipId:[{allmessage}]
// "66f2b257f007ee7d3f4c7576":[messageObject]
const initialAllChatAllMessageList: {
  [key: string]: { allMessage: IChatMessage[]; page: number };
} = {};

// Slice
const allChatMessageListSlice = createSlice({
  name: 'chatAllMessage',
  initialState: initialAllChatAllMessageList,
  reducers: {
    setSingleMessage: (
      state,
      action: PayloadAction<{ friendShipId: string; message: IChatMessage }>,
    ) => {
      const { friendShipId, message } = action.payload;
      if (!state[friendShipId]) {
        state[friendShipId] = { allMessage: [], page: 1 }; // Initialize as an empty array
      }
      state[friendShipId].allMessage.push(message); // Add the new message to the array
    },
    setLastPositionAllMessages: (
      state,
      action: PayloadAction<{
        friendShipId: string;
        messages: IChatMessage[];
        page?: number;
      }>,
    ) => {
      const { friendShipId, messages, page } = action.payload;

      if (!state[friendShipId]) {
        state[friendShipId] = { allMessage: [], page: 1 }; // Initialize as an empty array
      }

      state[friendShipId].allMessage.push(...messages);
      if (page) {
        state[friendShipId].page = page;
      }
      // Append messages at the end
    },
    setFastPositionMultipleMessages: (
      state,
      action: PayloadAction<{
        friendShipId: string;
        messages: IChatMessage[];
        page?: number;
      }>,
    ) => {
      const { friendShipId, messages, page } = action.payload;
      // console.log('🚀 ~ friendShipId:', friendShipId);
      if (!state[friendShipId]) {
        state[friendShipId] = { allMessage: [], page: 1 }; // Initialize as an empty array
      }
      state[friendShipId].allMessage.push(...messages);
      if (page) {
        state[friendShipId].page = page;
      }
    },
  },
});

// Export actions and reducer
export const {
  setSingleMessage,
  setFastPositionMultipleMessages,
  setLastPositionAllMessages,
} = allChatMessageListSlice.actions;
export default allChatMessageListSlice.reducer;
