"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Video, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("users")
                    .select("plan")
                    .eq("id", user.id)
                    .single();

                setUser({ ...user, plan: profile?.plan });
            } else {
                setUser(null);
            }
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from("users")
                    .select("plan")
                    .eq("id", session.user.id)
                    .single();
                setUser({ ...session.user, plan: profile?.plan });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const navLinks = [
        { name: "Features", href: "/#features" },
        { name: "How it Works", href: "/#how-it-works" },
        { name: "Pricing", href: "/pricing" },
    ];

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b"
                    : "bg-transparent"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Video className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight">Vidimi</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <ModeToggle />

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.plan && (
                                    <Badge variant={user.plan === 'pro' || user.plan === 'yearly' ? 'default' : 'secondary'} className={user.plan === 'pro' || user.plan === 'yearly' ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}>
                                        {user.plan === 'yearly' ? 'Pro Yearly' : user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1)}
                                    </Badge>
                                )}
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
                                                <p className="text-sm font-medium leading-none">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
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
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Button asChild size="sm">
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Nav */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-8 mt-10">
                                <Link href="/" className="flex items-center gap-2 mb-4">
                                    <Video className="h-6 w-6 text-primary" />
                                    <span className="text-xl font-bold">Vidimi</span>
                                </Link>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Theme</span>
                                    <ModeToggle />
                                </div>

                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg font-medium hover:text-primary transition-colors py-2"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {user ? (
                                    <div className="flex flex-col gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="text-sm">
                                                <p className="font-medium">{user.email}</p>
                                                {user.plan && (
                                                    <Badge variant={user.plan === 'pro' || user.plan === 'yearly' ? 'default' : 'secondary'} className={user.plan === 'pro' || user.plan === 'yearly' ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}>
                                                        {user.plan === 'yearly' ? 'Pro Yearly' : user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Button asChild className="w-full text-lg h-12">
                                            <Link href="/dashboard">Go to Dashboard</Link>
                                        </Button>
                                        <Button variant="outline" className="w-full text-lg h-12" onClick={handleSignOut}>
                                            Log Out
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 mt-4">
                                        <Link href="/login" className="text-lg font-medium py-2">
                                            Login
                                        </Link>
                                        <Button asChild className="w-full text-lg h-12" size="lg">
                                            <Link href="/signup">Get Started</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
};
