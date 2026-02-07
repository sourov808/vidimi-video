"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleSelectPlan = async (plan: string) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please login to select a plan");
                router.push("/login");
                return;
            }

            // Define credits based on plan
            let credits = 0;
            if (plan === "pro") credits = 500;
            if (plan === "yearly") credits = 5000;
            if (plan === "free") credits = 50;

            // Update user directly (Manual/Mock Payment)
            const { error } = await supabase
                .from("users")
                .update({
                    plan: plan,
                    creadit: credits // Reset or add credits
                })
                .eq("id", user.id);

            if (error) throw error;

            toast.success(`Successfully activated ${plan} plan!`);
            router.push("/dashboard");

        } catch (error: any) {
            toast.error(error.message || "Failed to upgrade plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-24 mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
                <p className="text-xl text-muted-foreground">Choose the plan that's right for you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Free Plan */}
                <Card className="flex flex-col relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>Perfect for trying out Vidimi</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 200 Credits (Fixed)</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Standard Generation Speed</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 720p Resolution</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" onClick={() => handleSelectPlan("free")} disabled={loading}>
                            Get Started
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="flex flex-col relative border-primary shadow-lg scale-105 z-10">
                    <div className="absolute top-0 right-0 p-3">
                        <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl">Pro</CardTitle>
                        <CardDescription>For serious creators</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-4xl font-bold mb-6">$20<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 500 Credits / Month</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Fast Generation</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 1080p Resolution</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Priority Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleSelectPlan("pro")} disabled={loading}>
                            Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>

                {/* Yearly Plan */}
                <Card className="flex flex-col relative">
                    <div className="absolute top-0 right-0 p-3">
                        <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100">Save 60%</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl">Yearly Pro</CardTitle>
                        <CardDescription>Best value for power users</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-4xl font-bold mb-6">$90<span className="text-lg font-normal text-muted-foreground">/yr</span></div>
                        <p className="text-xs text-muted-foreground mb-4 line-through">$240/year value</p>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> All Pro Features</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 500 Credits / Month</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 2 Months Free</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" onClick={() => handleSelectPlan("yearly")} disabled={loading}>
                            Get Yearly
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
                * Note: Credits are reset monthly for Pro plans. Free plan credits are one-time.
                Terms and conditions apply.
            </div>
        </div>
    );
}
