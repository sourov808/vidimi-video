"use client";

import { motion } from "framer-motion";
import { MessageSquare, Wand2, Download, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Describe your vision",
        description: "Simply type what you want to see. Our AI understands complex scenes, styles, and moods from natural language.",
        icon: MessageSquare,
    },
    {
        number: "02",
        title: "AI Magic Happens",
        description: "Our advanced models generate your video frame by frame, ensuring high coherence and visual fidelity.",
        icon: Wand2,
    },
    {
        number: "03",
        title: "Download & Share",
        description: "Export your masterpiece in 4K resolution. Use it for ads, social media, or just for fun.",
        icon: Download,
    },
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        From idea to video in minutes
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        No technical skills required. Just your imagination.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-muted/0 via-muted to-muted/0 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 relative z-10">
                                <step.icon className="h-10 w-10 text-primary" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                    {step.number}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-sm">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="md:hidden mt-8 text-muted-foreground/30">
                                    <ArrowRight className="h-8 w-8 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
