"use client";

import { useEffect, useState } from "react";
import { Sparkles, AlertTriangle, RotateCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setResearch, type TokenResearch } from "@/lib/store/features/research-slice";
import { useLazyGetTokenResearchQuery } from "@/lib/store/services/portfolio-api";

import { ResearchLoading } from "./research-loading";
import { ResearchResult } from "./research-result";

// Give up waiting on the `token-research` WS event after this long.
const RESULT_TIMEOUT_MS = 90_000;

// REST trigger returns an ack until the LLM result lands via the `token-research`
// WS event; cached results arrive complete. Only a fully-shaped payload renders.
const isCompleteResearch = (d: any): d is TokenResearch =>
  !!d && typeof d.outlook === "object" && typeof d.outlook.asset === "string";

interface TokenResearchDialogProps {
  symbol: string | null;
  imgUrl?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenResearchDialog({
  symbol,
  imgUrl,
  open,
  onOpenChange,
}: TokenResearchDialogProps) {
  const dispatch = useAppDispatch();
  const key = symbol?.toUpperCase() ?? "";
  const research = useAppSelector((s) => (key ? s.research.byAsset[key] : undefined));
  const [trigger] = useLazyGetTokenResearchQuery();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!open || !symbol || research) return;
    setFailed(false);

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      setFailed(true);
    }, RESULT_TIMEOUT_MS);

    trigger(symbol)
      .unwrap()
      .then((res) => {
        if (isCompleteResearch(res?.data)) dispatch(setResearch(res.data));
      })
      .catch(() => {
        // No WS result is coming if the trigger itself failed.
        if (!timedOut) setFailed(true);
      });

    return () => clearTimeout(timer);
  }, [open, symbol, research, attempt, dispatch, trigger]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            AI Token Research
            <Badge className="ml-auto bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[9px] py-1 px-2">
              Beta
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Independent outlook generated from on-chain and market data — not financial advice.
          </DialogDescription>
        </DialogHeader>

        {research ? (
          <ResearchResult research={research} imgUrl={imgUrl} />
        ) : failed ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertTriangle className="size-8 text-amber-500" />
            <p className="text-sm font-medium">Couldn&apos;t load research for {symbol}</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              The request failed or took too long. Please try again in a moment.
            </p>
            <Button variant="outline" size="sm" onClick={() => setAttempt((a) => a + 1)}>
              <RotateCw className="size-3.5 mr-1.5" /> Retry
            </Button>
          </div>
        ) : (
          <ResearchLoading symbol={symbol ?? ""} />
        )}
      </DialogContent>
    </Dialog>
  );
}
