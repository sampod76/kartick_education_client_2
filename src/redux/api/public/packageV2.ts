import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';

const URL = '/packages-v2';

export const packagesV2V2Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all academic departments
    getAllPackagesV2: build.query({
      query: (arg: Record<string, any>) => {
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
      providesTags: [tagTypes.PackagesV2],
    }),

    // get single academic department
    getSinglePackagesV2: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.PackagesV2],
    }),
    // create a new academic department
    addPackagesV2: build.mutation({
      query: (data) => {
        //
        return {
          url: URL,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [tagTypes.PackagesV2],
    }),
    // update ac department
    updatePackagesV2: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: 'PATCH',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.PackagesV2],
    }),

    // delete ac department
    deletePackagesV2: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.PackagesV2],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddPackagesV2Mutation,
  useDeletePackagesV2Mutation,
  useGetAllPackagesV2Query,
  useGetSinglePackagesV2Query,
  useUpdatePackagesV2Mutation,
} = packagesV2V2Api;
