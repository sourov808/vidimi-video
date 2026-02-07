import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Video } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
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
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <LoginForm />
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <div className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-zinc-900 flex items-center justify-center text-zinc-800">
                    {/* Dynamic generated image placeholder or abstract art */}
                    <div className="text-4xl font-bold opacity-20">Artistic Visuals</div>
                </div>
            </div>
        </div>
    );
}
