"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Video, LayoutDashboard, Clapperboard, Settings, LogOut } from "lucide-react";

const sidebarLinks = [
    { name: "Generate", href: "/dashboard", icon: Clapperboard },
    { name: "Library", href: "/dashboard/library", icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Video className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Vidimi</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-6 px-4">
                <nav className="flex flex-col gap-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Log out
                </Button>
            </div>
        </aside>
    );
};
