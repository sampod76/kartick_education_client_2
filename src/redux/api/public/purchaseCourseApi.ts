import { tagTypes } from '@/redux/tag-types';
import { IMeta } from '@/types';
import { baseApi } from '../baseApi';

const PURCHASE_COURSE_URL = '/purchase_courses';

export const purchaseCoursesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCheckPurchasesCourse: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}`,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.userPurchaseCourse],
    }),
    addSpatialConsiderCourse: build.mutation({
      query: (data: Record<string, any>) => {
        return {
          url: `${PURCHASE_COURSE_URL}` + '/spatial-consider-course',
          method: 'PUT',
          data,
        };
      },
      invalidatesTags: [tagTypes.student],
    }),

    // update ac department
  }),
  overrideExisting: true,
});

export const { useGetCheckPurchasesCourseQuery, useAddSpatialConsiderCourseMutation } =
  purchaseCoursesApi;
