"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Share2, Download, Eye, EyeOff, Link2, Copy, Check, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useEnableShareMutation,
  useDisableShareMutation,
} from "@/lib/store/services/portfolio-api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Token } from "@/components/portfolio/portfolio-tokens"

interface ShareCardDialogProps {
  tokens: Token[]
  totalValue: number
  portfolioId?: number
  shareToken?: string | null
}

const W = 1200
const H = 630

const COIN_COLORS = ["#f7931a", "#627eea", "#26a17b", "#e84142", "#8247e5", "#00d4ff"]

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function ShareCardDialog({ tokens, totalValue, portfolioId, shareToken }: ShareCardDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [open, setOpen] = useState(false)
  const [hideAmounts, setHideAmounts] = useState(false)
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState<string | null>(shareToken ?? null)
  const [enableShare, { isLoading: isEnabling }] = useEnableShareMutation()
  const [disableShare, { isLoading: isDisabling }] = useDisableShareMutation()

  useEffect(() => setToken(shareToken ?? null), [shareToken])

  const publicUrl = token && typeof window !== "undefined" ? `${window.location.origin}/p/${token}` : null

  const handleEnableLink = async () => {
    if (!portfolioId) return
    try {
      const res = await enableShare({ portfolio_id: portfolioId, share_amounts: !hideAmounts }).unwrap()
      setToken(res.data?.share_token ?? null)
      toast.success("Public link created")
    } catch {
      toast.error("Could not create public link")
    }
  }

  const handleDisableLink = async () => {
    if (!portfolioId) return
    try {
      await disableShare(portfolioId).unwrap()
      setToken(null)
      toast.success("Public link disabled — the old URL no longer works")
    } catch {
      toast.error("Could not disable public link")
    }
  }

  const handleCopy = async () => {
    if (!publicUrl) return
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const fontFamily = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif"
    const font = (weight: number, size: number) => `${weight} ${size}px ${fontFamily}`

    // Derived stats
    let change24h = 0
    let costBasis = 0
    tokens.forEach((t) => {
      const pct = Number(t.percentChange) || 0
      const value = Number(t.value) || 0
      change24h += value - value / (1 + pct / 100)
      costBasis += (Number(t.avg_price) || 0) * (Number(t.amount) || 0)
    })
    const prevValue = totalValue - change24h
    const change24hPct = prevValue !== 0 ? (change24h / prevValue) * 100 : 0
    const pnl = totalValue - costBasis
    const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0
    const top3 = [...tokens].sort((a, b) => b.value - a.value).slice(0, 3)

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, "#0a0e1c")
    bg.addColorStop(1, "#0f1730")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Radial glow, top right
    const glow = ctx.createRadialGradient(W - 180, 120, 0, W - 180, 120, 520)
    glow.addColorStop(0, "rgba(59, 130, 246, 0.22)")
    glow.addColorStop(1, "rgba(59, 130, 246, 0)")
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)

    // Dot grid texture
    ctx.fillStyle = "rgba(148, 163, 184, 0.08)"
    for (let x = 40; x < W; x += 44) {
      for (let y = 40; y < H; y += 44) {
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // ── Brand ──
    const logo = ctx.createLinearGradient(64, 56, 116, 108)
    logo.addColorStop(0, "#3b82f6")
    logo.addColorStop(1, "#1d4ed8")
    roundRect(ctx, 64, 56, 52, 52, 14)
    ctx.fillStyle = logo
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.font = font(800, 30)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("₿", 90, 84)

    ctx.textAlign = "left"
    ctx.fillStyle = "#f1f5f9"
    ctx.font = font(800, 30)
    ctx.fillText("CryptoFolio", 132, 76)
    ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
    ctx.font = font(600, 14)
    ctx.fillText("PORTFOLIO HUB", 133, 102)

    // Date, top right
    ctx.textAlign = "right"
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)"
    ctx.font = font(600, 16)
    ctx.fillText(
      new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      W - 64,
      84
    )

    // ── Portfolio value ──
    ctx.textAlign = "left"
    ctx.fillStyle = "rgba(148, 163, 184, 0.9)"
    ctx.font = font(700, 18)
    ctx.fillText("P O R T F O L I O   V A L U E", 64, 208)

    ctx.fillStyle = "#f8fafc"
    ctx.font = font(800, 84)
    const valueText = hideAmounts
      ? "$ • • • • •"
      : `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ctx.fillText(valueText, 60, 282)

    // ── Change chips ──
    const chip = (x: number, label: string, pct: number, showAmount: number | null) => {
      const up = pct >= 0
      const color = up ? "#34d399" : "#f87171"
      const bgColor = up ? "rgba(52, 211, 153, 0.14)" : "rgba(248, 113, 113, 0.14)"
      const amountPart = showAmount != null && !hideAmounts
        ? ` (${up ? "+" : "-"}$${Math.abs(showAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })})`
        : ""
      const text = `${up ? "▲" : "▼"} ${up ? "+" : ""}${pct.toFixed(2)}%${amountPart}`
      ctx.font = font(700, 20)
      const tw = ctx.measureText(text).width
      const lw = ctx.measureText(label).width
      roundRect(ctx, x, 330, tw + 40, 44, 22)
      ctx.fillStyle = bgColor
      ctx.fill()
      ctx.fillStyle = color
      ctx.fillText(text, x + 20, 353)
      ctx.fillStyle = "rgba(148, 163, 184, 0.7)"
      ctx.font = font(600, 14)
      ctx.fillText(label, x + 20, 398)
      return x + Math.max(tw + 40, lw) + 32
    }
    const nextX = chip(64, "LAST 24 HOURS", change24hPct, change24h)
    chip(nextX, "ALL-TIME P&L", pnlPct, pnl)

    // ── Top holdings panel ──
    const panelX = 64
    const panelY = 440
    const panelW = W - 128
    roundRect(ctx, panelX, panelY, panelW, 130, 20)
    ctx.fillStyle = "rgba(30, 41, 59, 0.55)"
    ctx.fill()
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = "rgba(148, 163, 184, 0.9)"
    ctx.font = font(700, 14)
    ctx.fillText("T O P   H O L D I N G S", panelX + 28, panelY + 32)

    const colW = (panelW - 56) / 3
    top3.forEach((t, i) => {
      const x = panelX + 28 + i * colW
      const y = panelY + 58
      const alloc = totalValue > 0 ? (t.value / totalValue) * 100 : 0

      // coin circle with initials
      ctx.beginPath()
      ctx.arc(x + 20, y + 16, 20, 0, Math.PI * 2)
      ctx.fillStyle = COIN_COLORS[i % COIN_COLORS.length]
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.font = font(800, 14)
      ctx.textAlign = "center"
      ctx.fillText(t.symbol.toUpperCase().slice(0, 2), x + 20, y + 17)

      ctx.textAlign = "left"
      ctx.fillStyle = "#f1f5f9"
      ctx.font = font(800, 20)
      ctx.fillText(t.symbol.toUpperCase(), x + 52, y + 8)
      ctx.fillStyle = "rgba(148, 163, 184, 0.85)"
      ctx.font = font(600, 15)
      ctx.fillText(`${alloc.toFixed(1)}%`, x + 52, y + 30)

      // allocation bar
      const barW = colW - 80
      roundRect(ctx, x + 52, y + 42, barW, 6, 3)
      ctx.fillStyle = "rgba(148, 163, 184, 0.2)"
      ctx.fill()
      roundRect(ctx, x + 52, y + 42, Math.max(barW * (alloc / 100), 6), 6, 3)
      ctx.fillStyle = COIN_COLORS[i % COIN_COLORS.length]
      ctx.fill()
    })

    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
  }, [tokens, totalValue, hideAmounts])

  useEffect(() => {
    if (open) {
      // let the dialog mount the canvas first
      requestAnimationFrame(draw)
    }
  }, [open, draw])

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => canvasRef.current?.toBlob(resolve, "image/png") ?? resolve(null))

  const handleDownload = async () => {
    const blob = await toBlob()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cryptofolio-${new Date().toISOString().slice(0, 10)}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const blob = await toBlob()
    if (!blob) return
    const file = new File([blob], "cryptofolio.png", { type: "image/png" })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "My CryptoFolio Portfolio" })
      } catch {
        // user dismissed the share sheet
      }
    } else {
      await handleDownload()
      toast.info("Sharing not supported here — image downloaded instead")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share your portfolio</DialogTitle>
          <DialogDescription>
            A snapshot card of your performance — amounts can be hidden before sharing.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl overflow-hidden border border-border/50 shadow-lg">
          <canvas ref={canvasRef} width={W} height={H} className="w-full h-auto block" />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => setHideAmounts((v) => !v)}
          >
            {hideAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {hideAmounts ? "Show amounts" : "Hide amounts"}
          </Button>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Public live link */}
        {portfolioId && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Public live link</p>
            </div>
            {token ? (
              <>
                <div className="flex gap-2">
                  <Input readOnly value={publicUrl ?? ""} className="text-xs font-mono h-9" />
                  <Button variant="outline" size="sm" className="gap-1.5 h-9 flex-shrink-0" onClick={handleCopy}>
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Anyone with this link sees a live, read-only view of your allocation.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-500 hover:text-red-600 flex-shrink-0"
                    onClick={handleDisableLink}
                    disabled={isDisabling}
                  >
                    {isDisabling && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                    Disable
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Create a read-only page of your portfolio.{" "}
                  {hideAmounts ? "Amounts will be hidden — only percentages." : "Dollar amounts will be visible."}
                </p>
                <Button size="sm" className="gap-1.5 flex-shrink-0" onClick={handleEnableLink} disabled={isEnabling}>
                  {isEnabling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                  Create link
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
