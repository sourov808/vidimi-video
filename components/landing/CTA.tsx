"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export const CTA = () => {
    return (
        <section className="py-24 px-4 md:px-6">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl bg-primary px-6 py-24 text-center text-primary-foreground shadow-2xl sm:px-16"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Ready to start creating?
                        </h2>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                            Join thousands of creators who are already using Vidimi to produce stunning AI-generated videos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold dark:bg-black dark:text-white" asChild>
                                <Link href="/signup">
                                    Get Started for Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                View Pricing
                            </Button>
                        </div>
                        <p className="text-sm text-primary-foreground/60 mt-4">
                            No credit card required · 14-day free trial · Cancel anytime
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
