import { apiSlice } from "../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: (id) => ({
                url: 'cart/addtocart',
                method: 'POST',
                body: {
                    _id: id
                },
                credentials: 'include' as const
            })
        }),
        removeFromCart: builder.mutation({
            query: (id) => ({
                url: 'cart/removefromcart',
                method: 'POST',
                body: {
                    _id: id
                },
                credentials: 'include' as const
            })
        }),
        getCartStatus: builder.query({
            query: () => ({
                url: 'cart/getcartstatus',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        
    })
})

export const { useAddToCartMutation,useRemoveFromCartMutation,useGetCartStatusQuery } = cartApi;