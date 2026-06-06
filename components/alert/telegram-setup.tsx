"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { RefreshCw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRegisterTelegramBotMutation } from "@/lib/store/services/alert-api"
import { getServerError } from "./utils"

const formSchema = z.object({
  telegram_bot_token: z.string().min(1, { message: "Bot token is required" }),
  telegram_chat_id: z
    .string()
    .min(1, { message: "Chat ID is required" })
    .regex(/^\d+$/, { message: "Chat ID must be a number" }),
})

type FormValues = z.infer<typeof formSchema>

export function TelegramSetup() {
  const [registerBot, { isLoading }] = useRegisterTelegramBotMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { telegram_bot_token: "", telegram_chat_id: "" },
  })

  async function onSubmit(values: FormValues) {
    try {
      toast.loading("Verifying your Telegram bot...", { id: "telegram-setup" })
      await registerBot({
        telegram_bot_token: values.telegram_bot_token,
        telegram_chat_id: Number(values.telegram_chat_id),
      }).unwrap()
      toast.success("Telegram bot connected — you can now create alerts", {
        id: "telegram-setup",
      })
      form.reset()
    } catch (error) {
      toast.error(getServerError(error, "Could not connect your Telegram bot"), {
        id: "telegram-setup",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="telegram_bot_token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot token</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder="123456789:ABCdef..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Create a bot with{" "}
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @BotFather
                </a>{" "}
                and paste the token it gives you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telegram_chat_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat ID</FormLabel>
              <FormControl>
                <Input inputMode="numeric" placeholder="5211597445" {...field} />
              </FormControl>
              <FormDescription>
                Message{" "}
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @userinfobot
                </a>{" "}
                to get your numeric chat ID. Don&apos;t forget to send{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">/start</code> to
                your own bot first.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Connect Telegram Bot
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
