import { tagTypes } from '@/redux/tag-types';

import { baseApi } from '../baseApi';
import { IMeta } from '@/types/common';

const URL = '/chat-messages';

export const ChatMessageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllChatMessage: build.query({
      query: (arg) => {
        return {
          url: URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.ChatMessage],
    }),
    // get single academic department
    getSingleChatMessage: build.query({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.ChatMessage],
    }),
    // create a new academic department
    addChatMessage: build.mutation({
      query: (data) => ({
        url: URL,
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.ChatMessage],
    }),
    // update ac department
    updateChatMessage: build.mutation({
      query: (data) => ({
        url: `${URL}/${data.id}`,
        method: 'PATCH',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.ChatMessage],
    }),

    // delete ac department
    deleteChatMessage: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.ChatMessage],
    }),
  }),
});

export const {
  useAddChatMessageMutation,
  useDeleteChatMessageMutation,
  useGetAllChatMessageQuery,
  useGetSingleChatMessageQuery,
  useUpdateChatMessageMutation,
} = ChatMessageApi;
