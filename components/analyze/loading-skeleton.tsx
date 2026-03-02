"use client";

import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  text: string;
}

export const LoadingSkeleton = ({ text }: LoadingSkeletonProps) => (
  <BaseShell>
    <BaseHeader heading="Portfolio Analysis" text={text} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="lg:col-span-1 h-[400px] rounded-3xl" />
      <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
    </div>
  </BaseShell>
);
