import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h2 className="ml-3 text-2xl font-bold">Loading</h2>
    </div>
  )
}
