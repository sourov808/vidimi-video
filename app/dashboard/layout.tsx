import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: userProfile } = await supabase
        .from("users")
        .select("creadit")
        .eq("id", user.id)
        .single();

    // Extend user object or pass separately. Let's extend user metadata for easy access in component
    // or just pass as a separate prop. Separate prop is cleaner typings-wise but DashboardHeader expects `user`.
    // Let's just create a combined object or pass it.
    // Actually, DashboardHeader takes `user: any`. We can just merge it.
    const userWithCredits = {
        ...user,
        credits: userProfile?.creadit ?? 0
    };

    return (
        <div className="flex min-h-screen flex-col bg-muted/40 font-sans">
            <DashboardHeader user={userWithCredits} />
            <main className="flex-1">
                <div className="container mx-auto p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
