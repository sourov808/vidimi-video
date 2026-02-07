"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Wand2, ShieldCheck, Layers, MonitorPlay, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Instant Generation",
        description: "Create videos in seconds with our lightning-fast AI engine. No waiting hours for renders.",
        icon: Zap,
    },
    {
        title: "Magic Editing",
        description: "Edit your videos with natural language commands. Change styles, remove objects, and more.",
        icon: Wand2,
    },
    {
        title: "Enterprise Security",
        description: "Your data is safe with us. Enterprise-grade encryption and privacy controls built-in.",
        icon: ShieldCheck,
    },
    {
        title: "Multi-Asset Library",
        description: "Access millions of stock photos, videos, and music tracks to enhance your creations.",
        icon: Layers,
    },
    {
        title: "4K Export",
        description: "Export your videos in stunning 4K resolution. Perfect for all social media platforms.",
        icon: MonitorPlay,
    },
    {
        title: "Collaborative Work",
        description: "Work with your team in real-time. Share projects and get feedback instantly.",
        icon: Users,
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export const Features = () => {
    return (
        <section id="features" className="py-24 bg-muted/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Everything you need to create viral videos
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Powerful features designed for creators, marketers, and businesses.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={item}>
                            <Card className="h-full border-0 shadow-lg bg-background/60 backdrop-blur hover:bg-background transition-colors duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
