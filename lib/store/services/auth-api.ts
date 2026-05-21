import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getAccessToken } from "@/lib/token-store"

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  fullname: string
  email: string
  password: string
}

interface AuthResponse {
  user_id?: number
  access_token: string
  message: string
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/auth",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getAccessToken()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<{ message: string }, RegisterRequest>({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
    googleVerify: builder.mutation<AuthResponse, { idToken: string }>({
      query: (body) => ({
        url: "auth/google/verify",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleVerifyMutation,
} = authApi
