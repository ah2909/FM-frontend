import { baseApi } from "./baseApi";


export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query<any, void>({
            query: () => "user/info",
        }),
    }),
});

export const { useGetUserInfoQuery } = userApi;