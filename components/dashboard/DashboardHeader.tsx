"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { ModeToggle } from "@/components/mode-toggle";

interface DashboardHeaderProps {
    user: any;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold md:text-lg">
                <Video className="h-6 w-6 text-primary" />
                <span className="">Vidimi</span>
            </Link>

            <div className="flex items-center gap-2 ml-4">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/pricing">Pricing</Link>
                </Button>
                <ModeToggle />
            </div>



            <div className="ml-auto flex items-center gap-4">
                {user && (
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium hidden md:block text-right">
                            <p>{user.email}</p>
                            <p className="text-xs text-muted-foreground">Credits: {user.credits}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.email || "User"} />
                                        <AvatarFallback>{user.email?.[0].toUpperCase() || <User className="h-4 w-4" />}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">My Account</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </header>
    );
};
