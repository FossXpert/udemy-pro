import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (courseId) => ({
                url: 'order/createorder',
                method: 'POST',
                body: {
                    courseId: courseId,
                },
                credentials: 'include' as const
            })
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: 'order/getallorder',
                method: 'POST',
                credentials: 'include' as const
            })
        }),
    })
})


export const { useCreateOrderMutation, useGetAllOrdersQuery } = orderApi;