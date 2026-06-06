// The alert engine returns errors as { success: false, error: "<message>" } with
// a non-2xx status, so RTK Query surfaces the human-readable message at
// `error.data.error`. Fall back to a caller-supplied default otherwise.
export function getServerError(error: unknown, fallback: string): string {
  const data = (error as { data?: { error?: string } } | undefined)?.data
  if (data?.error && typeof data.error === "string") {
    return data.error
  }
  return fallback
}
