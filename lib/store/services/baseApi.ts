import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"
import { getAccessToken, setAccessToken } from "@/lib/token-store"

// Create a mutex to prevent multiple refresh calls
const mutex = new Mutex()

// Base query with auth header
const baseQuery = fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers: any) => {
        const token = getAccessToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
})

const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  // Wait if another query is already refreshing the token
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  // According to the new requirements, if we get 401, we try to refresh
  if (result.error && result.error.status === 401) {
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
                setAccessToken(null);
                // Clear session and redirect only if it's a hard failure
                if (typeof window !== 'undefined') {
                    window.location.href = "/login";
                }
                throw new Error("Refresh JWT failed");
            }
            
            const res: any = await refreshResult.json();
            // Store new access token in memory
            setAccessToken(res.access_token);

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
