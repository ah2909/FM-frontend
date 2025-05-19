"use client"

import { Check, Laptop, LogOut, Moon, Settings, Sun, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useGetUserInfoQuery } from "@/lib/store/services/user-api"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const { data, isLoading } = useGetUserInfoQuery();

  return (
    <DropdownMenu>
      <div className="flex items-center gap-2">
        {!isLoading && data?.user && (
          <div className="hidden md:flex items-center gap-2 mr-2 text-sm">
            <Avatar className="h-8 w-8">
              {data.user.avatar_url ? (
                <AvatarImage src={data.user.avatar_url || "/placeholder.svg"} alt={data.user.name} />
              ) : (
                <AvatarFallback>
                  {data.user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="font-medium hidden lg:inline">{data.user.name}</span>
          </div>
        )}
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative overflow-hidden transition-all duration-300 hover:bg-muted"
          >
            <Sun
              className={cn(
                "h-[1.2rem] w-[1.2rem] transition-all duration-300",
                theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
              )}
            />
            <Moon
              className={cn(
                "absolute h-[1.2rem] w-[1.2rem] transition-all duration-300",
                theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
              )}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-56">
        {!isLoading && data?.user && (
          <>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex md:hidden items-center gap-2">
                <Avatar className="h-8 w-8">
                  {data.user.avatar_url ? (
                    <AvatarImage src={data.user.avatar_url || "/placeholder.svg"} alt={data.user.name} />
                  ) : (
                    <AvatarFallback>
                      {data.user.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{data.user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{data.user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center">
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </div>
          {theme === "light" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </div>
          {theme === "dark" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        {!isLoading && data?.user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center cursor-pointer text-red-500 focus:text-red-500" onClick={async () => {
                localStorage.removeItem('token');
                await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/logout`, {credentials: 'include'});
                window.location.href = '/login';
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
