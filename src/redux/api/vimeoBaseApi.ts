// src/redux/api/vimeoApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export type VimeoVideo = {
  uri: string;
  name: string;
  link: string;
  pictures?: {
    sizes: {
      width: number;
      height: number;
      link: string;
    }[];
  };
};

type VimeoResponse = {
  data: VimeoVideo[];
  total: number;
};

export const vimeoBaseApi = createApi({
  reducerPath: 'vimeoBaseApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/vimeo' }),
  endpoints: (builder) => ({
    searchVideosByName: builder.query<VimeoResponse, string>({
      query: (videoName) => ({
        url: 'search',
        params: { query: videoName },
      }),
    }),
  }),
});

export const { useSearchVideosByNameQuery } = vimeoBaseApi;
