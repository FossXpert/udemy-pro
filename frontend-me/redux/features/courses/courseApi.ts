import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        createCourse : builder.mutation({
            query : (data) => ({
                url : 'course/createcourse',
                body : (data),
                method : 'POST',
                credentials : 'include' as const
            })
        }),
        getallcourse : builder.query({
            query : () => ({
                url: 'course/getallcourse',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getallcourses : builder.query({
            query : () => ({
                url: 'course/getallcourses',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        deleteSingleCourse : builder.mutation({
            query : (id) => ({
                url : `course/deletecoursebyid/${id}`,
                method : 'DELETE',
                credentials : 'include' as const
            })
        }),
        editSingleCourse : builder.mutation({
            query : ({id,data}) => ({
                url : `course/updatecourse/${id}`,
                body : (data),
                method : 'PUT',
                credentials : 'include' as const
            })
        }),
        getSingleCourse: builder.query({
            query : ({id}) => ({
                url : `course/get-single-course/${id}`,
                method : 'GET',
                credentials : 'include' as const
            })
        }),
        deleteBoughtCourseById : builder.mutation({
            query : (id) => ({
                url : `user/deleteboughtcoursebyid`,
                method : 'POST',
                body: {
                    _id: id
                },
                credentials : 'include' as const
            })
        })
    })
})

export const {useGetSingleCourseQuery,useEditSingleCourseMutation,useCreateCourseMutation,useGetallcourseQuery,useDeleteSingleCourseMutation,useGetallcoursesQuery,useDeleteBoughtCourseByIdMutation} = courseApi;