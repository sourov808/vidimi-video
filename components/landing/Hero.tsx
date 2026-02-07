"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container relative mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-8"
                >
                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">New</Badge>
                    <span className="text-muted-foreground">AI Video Generation v2.0 is here</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
                >
                    Turn prompt to <br className="hidden sm:block" />
                    <span className="text-primary">Stunning Video</span> in seconds.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10"
                >
                    Vidimi unlocks your creativity with the power of generative AI.
                    Create marketing videos, social clips, and more just by typing.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                >
                    <Button size="lg" className="h-12 px-8 rounded-full text-base group" asChild>
                        <Link href="/signup">
                            Start Generating Free
                            <Sparkles className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base group">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Watch Demo
                    </Button>
                </motion.div>

                {/* Hero Visual */}
                <motion.div
                    ref={containerRef}
                    style={{ y }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative mx-auto max-w-5xl rounded-xl border bg-background/50 shadow-2xl overflow-hidden aspect-video group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Placeholder for Video UI */}
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/5 dark:bg-zinc-900/50">
                        <div className="text-center">
                            <PlayCircle className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                            <p className="text-sm font-medium text-muted-foreground">AI Generated Result Preview</p>
                        </div>
                    </div>

                    {/* UI Mockup Details */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t flex items-center gap-4">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-primary rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">00:12 / 00:18</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
