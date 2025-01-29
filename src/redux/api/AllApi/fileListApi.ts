import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { IFileAfterUpload } from '@/types/globalType';
import { IUserRef } from '@/types/userTypes';
import { baseApi } from '../baseApi';

const APP_URL = '/file-list';
type AttachFIle = IFileAfterUpload & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: string;
  category: boolean;
  author: IUserRef;
};
export const allFileListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllFileListes: build.query({
      query: (arg) => {
        return {
          url: APP_URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: AttachFIle[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.FileList],
    }),

    getSingleFileList: build.query({
      query: (id: string) => {
        return {
          url: `${APP_URL}/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.FileList],
    }),

    addMultipleFileList: build.mutation({
      query: (data: { files: IFileAfterUpload[] }) => {
        return {
          url: APP_URL,
          method: 'POST',
          data: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: [tagTypes.FileList],
    }),

    updateFileList: build.mutation({
      query: ({ data, id }: { data: Record<string, any>; id: string }) => {
        return {
          url: `${APP_URL}/${id}`,
          method: 'PATCH',
          data: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: [tagTypes.FileList],
    }),

    deleteFileList: build.mutation({
      query: (id: string) => ({
        url: `${APP_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.FileList],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddMultipleFileListMutation,
  useDeleteFileListMutation,
  useGetAllFileListesQuery,
  useGetSingleFileListQuery,
  useUpdateFileListMutation,
  //
} = allFileListApi;
