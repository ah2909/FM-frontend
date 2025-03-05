import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TransactionForm } from "@/components/transaction/transaction-form"

export const metadata: Metadata = {
  title: "New Transaction",
  description: "Add a new crypto transaction",
}

export default function NewTransactionPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="New Transaction" text="Add a new crypto transaction">
        <Link href="/transactions">
          <Button variant="outline">Cancel</Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-8">
        <TransactionForm />
      </div>
    </DashboardShell>
  )
}

