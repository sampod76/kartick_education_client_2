import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { IFileAfterUpload } from '@/types/globalType';
import { baseApi } from '../baseApi';

const URL = '/page-builder';

export const pageBuilderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllPageBuilder: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: IAllPageBuilder[], meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.PageBuilder],
    }),
    // get single academic department
    getSinglePageBuilder: build.query({
      query: (id: string | string[] | undefined) => {
        //// console.log(id);
        return {
          url: `${URL}/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: IAllPageBuilder) => {
        return {
          data: response,
        };
      },
      providesTags: [tagTypes.PageBuilder],
    }),

    // create a new academic department
    addPageBuilder: build.mutation({
      query: (data) => {
        //// console.log(data, "cacccc");

        return {
          url: URL,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [tagTypes.PageBuilder],
    }),
    // update ac department
    updatePageBuilder: build.mutation({
      query: ({ data, id }) => {
        //// console.log(data, "PageBuilder data");
        return {
          url: `${URL}/${id}`,
          method: 'PATCH',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.PageBuilder],
    }),

    // delete ac department
    deletePageBuilder: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.PageBuilder],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddPageBuilderMutation,
  useDeletePageBuilderMutation,
  useGetAllPageBuilderQuery,
  useGetSinglePageBuilderQuery,
  useUpdatePageBuilderMutation,
} = pageBuilderApi;
export interface IParagraph {
  h1: string;
}
export interface IAllPageBuilder {
  _id: string;
  heading?: string;
  bannerImage?: IFileAfterUpload;
  pageType?: string;
  firstParagraphs?: IParagraph[];
  firstItemTitle?: string;
  firstItems?: IParagraph[];
  secondParagraphs?: IParagraph[];
  thirdParagraphs?: IParagraph[];
  pg1?: string;
  image1?: IFileAfterUpload;
  pg2?: string;
  image2?: IFileAfterUpload;
  pg3?: string;
  image3?: IFileAfterUpload;
  bodyData?: Record<string, any>;
  htmlText?: string;
  status?: string;
  isDelete?: string;
  allBottomLinks?: { title: string; link: string }[];
  actionButton?: {
    link?: string;
    title?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
