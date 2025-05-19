import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Wallet, LineChart, TrendingUp } from "lucide-react"

export default async function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex-1">
        <div className="container max-w-6xl py-8 md:py-16">
          <Card className="border-none shadow-lg">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Welcome to Your Crypto Journey</h1>
                    <p className="text-muted-foreground md:text-lg">
                      Track, analyze, and optimize your cryptocurrency investments in one place.
                    </p>
                  </div>

                  <div className="my-8 rounded-lg bg-amber-50 p-4 dark:bg-amber-950/50">
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                        <Wallet className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Create your first portfolio</h3>
                        <p className="text-sm text-muted-foreground">
                          You need to create a portfolio to start tracking your crypto assets.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-medium">Why create a portfolio?</h2>
                      <ul className="space-y-3">
                        {[
                          { icon: BarChart3, text: "Track all your crypto assets in one place" },
                          { icon: LineChart, text: "Monitor performance with real-time data" },
                          { icon: TrendingUp, text: "Analyze your investment strategy" },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="rounded-full bg-slate-100 p-1.5 dark:bg-slate-800">
                              <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            </div>
                            <span className="text-sm">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild size="lg" className="gap-2">
                      <Link href="/portfolios/new">
                        Create Portfolio
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="relative hidden md:block">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 dark:from-emerald-500/10 dark:to-blue-500/10" />
                  <div className="relative h-full p-6 md:p-10">
                    <div className="flex h-full items-center justify-center">
                      <img
                        src="/placeholder.svg?height=400&width=400"
                        alt="Crypto portfolio illustration"
                        className="max-w-full rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
