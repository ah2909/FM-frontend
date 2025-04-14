import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TransactionList } from "@/components/transaction/transaction-list"

export const metadata: Metadata = {
  title: "Transactions",
  description: "Manage your crypto transactions",
}

export default async function TransactionsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Transactions" text="Manage your crypto transactions" showBackButton={false}>
        <Link href="/transactions/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </Link>
      </DashboardHeader>
      <TransactionList />
    </DashboardShell>
  )
}

