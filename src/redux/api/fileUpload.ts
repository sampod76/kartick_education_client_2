import { tagTypes } from '@/redux/tag-types';
import { baseApi } from './baseApi';

const FILE_UPLOAD = '/upload';

export const fileUpload = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // create a new academic department
    addPdf: build.mutation({
      query: (data) => ({
        url: FILE_UPLOAD + '/upload-pdf',
        method: 'POST',
        data,
        contentType: 'multipart/form-data',
      }),
      invalidatesTags: [tagTypes.FileList],
    }),
    addAnyFile: build.mutation({
      query: (data) => ({
        url: FILE_UPLOAD + '/upload-any-files-s3',
        method: 'POST',
        data,
        contentType: 'multipart/form-data',
      }),
      invalidatesTags: [tagTypes.FileList],
    }),
    uploadVimeoVideo: build.mutation({
      query: (data) => ({
        url: FILE_UPLOAD + '/upload-vimeo-video',
        method: 'POST',
        data,
        // contentType: 'multipart/form-data',
      }),
      invalidatesTags: [tagTypes.FileList],
    }),
  }),
});

export const { useAddPdfMutation, useAddAnyFileMutation, useUploadVimeoVideoMutation } =
  fileUpload;
