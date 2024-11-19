import { ENUM_STATUS, ENUM_YN } from '@/constants/globalEnums';
import { instance as axiosInstance } from '@/helpers/axios/axiosInstance';
import { getBaseUrl } from '@/helpers/config/envConfig';
import { IUserRef } from '@/types/userTypes';
import { createSlice } from '@reduxjs/toolkit';

interface IBlock {
  isBlock: ENUM_YN;
  lastBlockDate?: Date;
  reason?: string;
  blocker?: IUserRef;
}

interface ILastMessage {
  message?: string;
  messageId?: string;
  createdAt?: Date | string;
}

interface IFriendShip {
  _id: string;
  sender: IUserRef & { details: Record<string, any> };
  receiver: IUserRef & { details: Record<string, any> };
  gigId?: string;
  orderId?: string;
  block?: IBlock;
  lastMessageDetails?: ILastMessage;
  requestAccept: ENUM_YN;
  isDelete: ENUM_YN;
  status: ENUM_STATUS;
}

interface IFriendSipAndOtherInfo {
  friendshipData: IFriendShip;
  page?: number;
}

const initialFriendshipList: {
  //friendShipId:{friendshipData:IFriendShip,page:number}
  // [{"66d4406a9c0f7bdd939310fa":{friendshipData:{IFriendShip},page:1}}]
  friendshipsList: Array<Record<string, IFriendSipAndOtherInfo>>;
} = {
  friendshipsList: [],
};

const friendShipListSlice = createSlice({
  name: 'friendshipList',
  initialState: initialFriendshipList,
  reducers: {
    addSingleFriendship: (
      state,
      action: { payload: { singleFriendShipData: IFriendShip } },
    ) => {
      const { singleFriendShipData } = action.payload;
      console.log('🚀 ~ singleFriendShipData:', singleFriendShipData);
      const index = state.friendshipsList.findIndex(
        (frined) => frined[singleFriendShipData._id],
      );
      if (index > 0) {
        state.friendshipsList.splice(index, 1);
        state.friendshipsList.unshift({
          [singleFriendShipData._id]: {
            friendshipData: singleFriendShipData,
            page: 1,
          },
        });
      } else if (index === 0) {
      } else {
        state.friendshipsList.unshift({
          [singleFriendShipData._id]: {
            friendshipData: singleFriendShipData,
            page: 1,
          },
        });
      }
    },
    addAllFriendship: (state, action: { payload: IFriendShip[] }) => {
      state.friendshipsList = action.payload.map((friendship) => ({
        [friendship._id]: { friendshipData: friendship, page: 1 },
      }));
    },
    removeFriendship: (state, action) => {
      const { friendShipId } = action.payload;
      const index = state.friendshipsList.findIndex(
        (singleFriendShipData) => singleFriendShipData[friendShipId],
      );
      if (index > -1) {
        state.friendshipsList.splice(index, 1);
      }
    },
    sortAscAndAddFriendships: (
      state,
      action: { payload: { friendShipId: string; message?: string } },
    ) => {
      const { friendShipId, message } = action.payload;
      // console.log('🚀 ~ friendShipId:', friendShipId);
      const index = state.friendshipsList.findIndex(
        (friendship) => friendship[friendShipId],
      );

      if (message) {
        if (index > 0) {
          const [singleFriendShipData] = state.friendshipsList.splice(index, 1);
          const friendship = singleFriendShipData[friendShipId];

          if (friendship) {
            // Ensure friendshipData is initialized
            if (!friendship.friendshipData) {
              friendship.friendshipData = {} as any;
            }

            // Ensure lastMessageDetails is initialized
            if (!friendship.friendshipData.lastMessageDetails) {
              friendship.friendshipData.lastMessageDetails = { message: '' };
            }

            // Set the message
            friendship.friendshipData.lastMessageDetails.message = message;

            // Unshift the updated friendship
            state.friendshipsList.unshift(singleFriendShipData);

            // Send update request to server
            axiosInstance({
              url: getBaseUrl() + '/friend-ship/list-sort/' + friendShipId,
              method: 'PATCH',
              data: {
                updatedAt: new Date(),
              },
            }).then((json) => console.log(json));
          }
        } else if (index === 0) {
          const friendship = state.friendshipsList[index];
          const friendshipData = friendship[friendShipId];

          if (friendshipData) {
            // Ensure lastMessageDetails is initialized
            if (!friendshipData.friendshipData.lastMessageDetails) {
              friendshipData.friendshipData.lastMessageDetails = {
                message: '',
              };
            }

            // Set the message
            friendshipData.friendshipData.lastMessageDetails.message = message;
          }
        }
      } else {
        if (index > 0) {
          const [friendship] = state.friendshipsList.splice(index, 1);
          state.friendshipsList.unshift(friendship);
          axiosInstance({
            url: getBaseUrl() + '/friend-ship/list-sort/' + friendShipId,
            method: 'PATCH',
            data: {
              updatedAt: new Date(),
            },
          }).then((json) => console.log(json));
        }
      }
    },
  },
});

export const {
  addSingleFriendship,
  removeFriendship,
  addAllFriendship,
  sortAscAndAddFriendships,
} = friendShipListSlice.actions;

export default friendShipListSlice.reducer;

/* 
Memory Efficiency: removeFriendship directly mutates the original array by removing the item in place using splice, which can be more memory-efficient. It doesn’t create a new array, which is beneficial for large data sets.

Single Removal: findIndex followed by splice stops once it finds the first matching item. This can be slightly faster than filter, which iterates through the entire list even if the match is found early in the array.

Lower Overhead: removeFriendship2 involves creating a new array and copying all elements except the one to be removed, which incurs additional overhead. With large lists, this can add up and potentially slow things down.

*/

/* 
import { ENUM_STATUS, ENUM_YN } from '@/constants/globalEnums';
import { instance as axiosInstance } from '@/helpers/axios/axiosInstance';
import { getBaseUrl } from '@/helpers/config/envConfig';
import { IUserRef } from '@/types/userTypes';
import { createSlice } from '@reduxjs/toolkit';

interface IBlock {
  isBlock: ENUM_YN;
  lastBlockDate?: Date;
  reason?: string;
  blocker?: IUserRef;
}

interface ILastMessage {
  message?: string;
  messageId?: string;
  createdAt?: Date | string;
}

interface IFriendShip {
  _id: string;
  sender: IUserRef & { details: Record<string, any> };
  receiver: IUserRef & { details: Record<string, any> };
  gigId?: string;
  orderId?: string;
  block?: IBlock;
  lastMessageDetails?: ILastMessage;
  requestAccept: ENUM_YN;
  isDelete: ENUM_YN;
  status: ENUM_STATUS;
}

interface IFriendSipAndOtherInfo {
  friendshipData: IFriendShip;
  page?: number;
}

const initialFriendshipList: {
  //friendShipId:{friendshipData:IFriendShip,page:number}
  // [{"66d4406a9c0f7bdd939310fa":{friendshipData:{IFriendShip},page:1}}]
  friendshipsList: Array<Record<string, IFriendSipAndOtherInfo>>;
} = {
  friendshipsList: [],
};

const friendShipListSlice = createSlice({
  name: 'friendshipList',
  initialState: initialFriendshipList,
  reducers: {
    addSingleFriendship: (
      state,
      action: { payload: { singleFriendShipData: IFriendShip } },
    ) => {
      const { singleFriendShipData } = action.payload;
      console.log('🚀 ~ singleFriendShipData:', singleFriendShipData);
      const index = state.friendshipsList.findIndex(
        (frined) => frined[singleFriendShipData._id],
      );
      if (index > 0) {
        state.friendshipsList.splice(index, 1);
        state.friendshipsList.unshift({
          [singleFriendShipData._id]: {
            friendshipData: singleFriendShipData,
            page: 1,
          },
        });
      } else if (index === 0) {
      } else {
        state.friendshipsList.unshift({
          [singleFriendShipData._id]: {
            friendshipData: singleFriendShipData,
            page: 1,
          },
        });
      }
    },
    addAllFriendship: (state, action: { payload: IFriendShip[] }) => {
      state.friendshipsList = action.payload.map((friendship) => ({
        [friendship._id]: { friendshipData: friendship, page: 1 },
      }));
    },
    removeFriendship: (state, action) => {
      const { friendShipId } = action.payload;
      const index = state.friendshipsList.findIndex(
        (singleFriendShipData) => singleFriendShipData[friendShipId],
      );
      if (index > -1) {
        state.friendshipsList.splice(index, 1);
      }
    },
    sortAscAndAddFriendships: (
      state,
      action: { payload: { friendShipId: string; message?: string } },
    ) => {
      const { friendShipId, message } = action.payload;
      // console.log('🚀 ~ friendShipId:', friendShipId);
      const index = state.friendshipsList.findIndex(
        (friendship) => friendship[friendShipId],
      );

      if (message) {
        if (index > 0) {
          const [singleFriendShipData] = state.friendshipsList.splice(index, 1);
          if (
            !singleFriendShipData[friendShipId].friendshipData
              .lastMessageDetails
          ) {
            singleFriendShipData[
              friendShipId
            ].friendshipData.lastMessageDetails = {
              message: '',
            };
          }
          singleFriendShipData[
            friendShipId
          ].friendshipData.lastMessageDetails.message = message;
          state.friendshipsList.unshift(singleFriendShipData);
          axiosInstance({
            url: getBaseUrl() + '/friend-ship/list-sort/' + friendShipId,
            method: 'PATCH',
            data: {
              updatedAt: new Date(),
            },
          }).then((json) => console.log(json));
        } else if (index === 0) {
          const friendship = state.friendshipsList[index];
          if (!friendship[friendShipId]?.friendshipData?.lastMessageDetails) {
            friendship[friendShipId].friendshipData.lastMessageDetails = {
              message: '',
            };
          }
          friendship[friendShipId].friendshipData.lastMessageDetails.message =
            message;
        }
      } else {
        if (index > 0) {
          const [friendship] = state.friendshipsList.splice(index, 1);
          state.friendshipsList.unshift(friendship);
          axiosInstance({
            url: getBaseUrl() + '/friend-ship/list-sort/' + friendShipId,
            method: 'PATCH',
            data: {
              updatedAt: new Date(),
            },
          }).then((json) => console.log(json));
        }
      }
    },
  },
});

export const {
  addSingleFriendship,
  removeFriendship,
  addAllFriendship,
  sortAscAndAddFriendships,
} = friendShipListSlice.actions;

export default friendShipListSlice.reducer;

/* 
Memory Efficiency: removeFriendship directly mutates the original array by removing the item in place using splice, which can be more memory-efficient. It doesn’t create a new array, which is beneficial for large data sets.

Single Removal: findIndex followed by splice stops once it finds the first matching item. This can be slightly faster than filter, which iterates through the entire list even if the match is found early in the array.

Lower Overhead: removeFriendship2 involves creating a new array and copying all elements except the one to be removed, which incurs additional overhead. With large lists, this can add up and potentially slow things down.

*/
