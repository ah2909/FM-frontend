import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"

// Create a mutex to prevent multiple refresh calls
const mutex = new Mutex()

// Base query with auth header
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers: any) => {
        headers.set(
            "Authorization",
            `Bearer ${localStorage.getItem("token")}`
        );
        return headers;
    },
})

const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  // Wait if another query is already refreshing the token
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 403) {
    // Check if mutex is locked (another query is already refreshing)
    if (!mutex.isLocked()) {
        const release = await mutex.acquire()

        try {
            const refreshResult = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/refresh`,
                {
                    method: "POST",
                    credentials: 'include',
                },
            )
            if (!refreshResult.ok) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                throw new Error("Refresh JWT failed");
            }
            const res: any = await refreshResult.json();
            localStorage.setItem("token", res.access_token)

            // Retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } catch (error) {
            console.error("Refresh error:", error)
        }
        finally {
            // Release the mutex so other queries can execute
            release()
        }
    } else {
        // If mutex is locked, wait for it to be released and try again
        await mutex.waitForUnlock()
        result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

// Create the base API with the enhanced query
export const baseApi = createApi({
    reducerPath: "portApi",
    baseQuery: baseQueryWithRefresh,
    endpoints: () => ({}),
    tagTypes: ["Exchange", "Portfolio", "Asset"], // Add your tag types here
})
