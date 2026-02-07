import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { Video } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignupPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <div className="flex justify-center mb-4">
                            <Video className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information below to create your account
                        </p>
                    </div>
                    <SignupForm />
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <div className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-zinc-900 flex items-center justify-center text-zinc-800">
                    {/* Dynamic generated image placeholder or abstract art */}
                    <div className="text-4xl font-bold opacity-20">Express Your Creativity</div>
                </div>
            </div>
        </div>
    );
}
