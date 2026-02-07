import { GenerationForm } from "@/components/dashboard/GenerationForm";
import { RecentGenerations } from "@/components/dashboard/RecentGenerations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <section>
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 lg:p-8">
                        <GenerationForm />
                    </div>
                </section>

                <Separator />

                <section>
                    <RecentGenerations />
                </section>
            </div>
        </div>
    );
}
