import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"
import { getAccessToken, setAccessToken } from "@/lib/token-store"
import { authService } from "@/lib/services/auth"

// A single mutex shared across every slice that refreshes the token, so that
// concurrent 401s (e.g. one from the main backend and one from the alert
// engine) don't fire overlapping /auth/refresh calls and invalidate each other.
export const mutex = new Mutex()

const prepareHeaders = (headers: any) => {
    const token = getAccessToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
}

// Builds a base query for the given origin/prefix that, on 401, performs a
// mutex-guarded token refresh and retries the original request once.
export const makeBaseQueryWithRefresh = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({ baseUrl, prepareHeaders })

  return async (args: any, api: any, extraOptions: any) => {
    // Wait if another query is already refreshing the token
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)

    // If we get 401, we try to refresh
    if (result.error && result.error.status === 401) {
      // Check if mutex is locked (another query is already refreshing)
      if (!mutex.isLocked()) {
          const release = await mutex.acquire()

          try {
              const refreshResult = await authService.refresh()

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
}

// Create the base API with the enhanced query
export const baseApi = createApi({
    reducerPath: "portApi",
    baseQuery: makeBaseQueryWithRefresh("/api"),
    endpoints: () => ({}),
    tagTypes: ["Exchange", "Portfolio", "Asset"], // Add your tag types here
})
