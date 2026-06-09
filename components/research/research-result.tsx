"use client";

import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Rocket,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type {
  Confidence,
  CasePoint,
  TokenResearch,
} from "@/lib/store/features/research-slice";

const confidenceStyles: Record<Confidence, string> = {
  high: "bg-green-500/12 text-green-600 dark:text-green-400",
  medium: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  med: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  low: "bg-muted text-muted-foreground",
};

const confidenceLabel: Record<Confidence, string> = {
  high: "high",
  medium: "medium",
  med: "medium",
  low: "low",
};

function ConfidenceBadge({ level }: { level?: Confidence }) {
  if (!level) return null;
  return (
    <Badge
      className={cn(
        "border-none font-bold uppercase tracking-widest text-[9px] py-0.5 px-2",
        confidenceStyles[level] ?? "bg-muted text-muted-foreground"
      )}
    >
      {confidenceLabel[level] ?? level} confidence
    </Badge>
  );
}

function SourcePills({ ids }: { ids?: string[] }) {
  if (!ids?.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {ids.map((id) => (
        <span
          key={id}
          className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wide text-muted-foreground"
        >
          {id}
        </span>
      ))}
    </div>
  );
}

const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
const fmtUsd = (n: number) =>
  `$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}`;

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function CasePanel({
  variant,
  points,
}: {
  variant: "bull" | "bear";
  points: CasePoint[];
}) {
  const isBull = variant === "bull";
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isBull
          ? "border-green-500/20 bg-green-500/[0.04]"
          : "border-red-500/20 bg-red-500/[0.04]"
      )}
    >
      <div className="flex items-center gap-1.5 mb-3">
        {isBull ? (
          <TrendingUp className="size-3.5 text-green-600 dark:text-green-400" />
        ) : (
          <TrendingDown className="size-3.5 text-red-600 dark:text-red-400" />
        )}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          {isBull ? "Bull Case" : "Bear Case"}
        </p>
      </div>
      {points.length === 0 ? (
        <p className="text-xs text-muted-foreground/60 italic">No points flagged.</p>
      ) : (
        <ul className="space-y-3">
          {points.map((p, i) => (
            <li key={i} className="text-xs leading-relaxed">
              <p className="text-foreground/90">{p.point}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <ConfidenceBadge level={p.confidence} />
              </div>
              <SourcePills ids={p.source_ids} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-mono font-bold tabular-nums">{value}</p>
    </div>
  );
}

export function ResearchResult({
  research,
  imgUrl,
}: {
  research: TokenResearch;
  imgUrl?: string;
}) {
  const { outlook, metadata } = research;
  const t = outlook.tokenomics_snapshot;
  const bullCase = outlook.bull_case ?? [];
  const bearCase = outlook.bear_case ?? [];
  const keyRisks = outlook.key_risks ?? [];
  const catalysts = outlook.catalysts_to_watch ?? [];
  const available = outlook.data_coverage?.sources_available ?? [];
  const missing = outlook.data_coverage?.sources_missing ?? [];
  const categories = outlook.categories ?? [];

  return (
    <div className="space-y-4">
      {(metadata.partial || (metadata.errors?.length ?? 0) > 0) && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
          <span>
            Partial result — some data sources failed or were unavailable. Treat with caution.
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={imgUrl} alt={outlook.asset} />
          <AvatarFallback>{outlook.asset.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight">{outlook.asset.toUpperCase()}</span>
            {t && (
              <span className="font-mono text-sm text-muted-foreground">
                {fmtUsd(t.current_price)}
              </span>
            )}
            <Badge className="border-none bg-primary/10 text-primary font-bold uppercase tracking-widest text-[9px] py-0.5 px-2">
              {outlook.chain || "Layer 1"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <Clock className="size-2.5" />
            {relativeTime(metadata.generated_at)}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed text-foreground/90">{outlook.summary}</p>

      {/* Tokenomics snapshot */}
      {t && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Tokenomics
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <StatCell label="Price" value={fmtUsd(t.current_price)} />
            <StatCell label="Market Cap" value={`$${fmtCompact(t.market_cap)}`} />
            <StatCell label="FDV" value={`$${fmtCompact(t.fdv)}`} />
            <StatCell label="Circulating" value={`${Math.round(t.circulating_pct * 100)}%`} />
            <StatCell label="FDV / MC" value={`${t.fdv_to_mc.toFixed(2)}x`} />
            <StatCell label="Supply" value={fmtCompact(t.circulating_supply)} />
          </div>
          {t.emission_note && t.emission_note !== "..." && (
            <p className="mt-2 text-[11px] text-muted-foreground/70">{t.emission_note}</p>
          )}
        </div>
      )}

      {/* Bull / Bear */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CasePanel variant="bull" points={bullCase} />
        <CasePanel variant="bear" points={bearCase} />
      </div>

      {/* Key risks */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Key Risks
          </p>
        </div>
        {keyRisks.length === 0 ? (
          <p className="text-xs text-muted-foreground/60 italic">No risks flagged.</p>
        ) : (
          <ul className="space-y-3">
            {keyRisks.map((r, i) => (
              <li key={i} className="text-xs leading-relaxed">
                <p className="text-foreground/90">{r.risk}</p>
                <SourcePills ids={r.source_ids} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Catalysts */}
      <div className="flex items-start gap-2 text-xs">
        <Rocket className="size-3.5 mt-0.5 text-primary shrink-0" />
        <div>
          <span className="font-black uppercase tracking-[0.15em] text-muted-foreground text-[10px]">
            Catalysts —{" "}
          </span>
          {catalysts.length === 0 ? (
            <span className="text-muted-foreground/60 italic">none flagged</span>
          ) : (
            <ul className="mt-1 space-y-1">
              {catalysts.map((c, i) => (
                <li key={i} className="text-foreground/90">
                  • {c.catalyst ?? c.point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Categories
          </p>
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 8).map((c) => (
              <span
                key={c}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {c}
              </span>
            ))}
            {categories.length > 8 && (
              <span className="px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                +{categories.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Coverage footer */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-3 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="font-black uppercase tracking-[0.15em] text-muted-foreground">
            Sources
          </span>
          {available.map((s) => (
            <span key={s} className="flex items-center gap-1 text-foreground/80">
              <span className="size-1.5 rounded-full bg-green-500" /> {s}
            </span>
          ))}
        </div>
        {missing.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="font-black uppercase tracking-[0.15em] text-muted-foreground">
              Missing
            </span>
            {missing.map((s) => (
              <span key={s} className="flex items-center gap-1 text-muted-foreground/50">
                <span className="size-1.5 rounded-full border border-muted-foreground/40" /> {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
