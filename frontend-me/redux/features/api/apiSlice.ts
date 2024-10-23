// Here we are creating RTK Query dont' confuse it with reducers in authSlice

require('dotenv').config();
import { createApi ,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl : process.env.NEXT_PUBLIC_SERVER_URI
    }),
    endpoints:(builder) =>({
        loadUser : builder.query({
            query : () => ({
                url : 'user/me',
                method : 'GET',
                credentials : 'include' as const
            }),
            async onQueryStarted(args,{dispatch,queryFulfilled}){
                try {
                    const {data} = await queryFulfilled;
                    dispatch(userLoggedIn({
                        user : data.user,
                    }))
                } catch (error) {
                    
                }
            }
        })
    })
})


export const {useLoadUserQuery} = apiSlice;