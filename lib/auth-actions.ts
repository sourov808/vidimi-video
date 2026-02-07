"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: error.message };
    }

    // Sync usage data or update last login
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { error: dbError } = await supabase.from("users").upsert({
            id: user.id,
            email: user.email,
        });

        if (dbError) {
            console.error("Error upserting user in db:", dbError);
        }
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                username: formData.get("username") as string,
            }
        }
    };

    const { data: authData, error } = await supabase.auth.signUp(data);

    if (error) {
        return { error: error.message };
    }

    // Attempt to insert user into public.users table immediately
    // Note: If email confirmation is enabled, getUser might be null or metadata limited
    // But usually auth.signUp returns the user object in data.user inside result.
    // For now we will rely on a secure client check or just the metadata.

    // However, since we can't easily get the user ID if session isn't established immediately (depending on config)
    // We will try to get it from login helper if auto-confirm is on, or wait for webhook.
    // Assuming development mode/auto-confirm:

    // Re-auth or just assume success flow:
    // Ideally we use a Service Role for this, but standard flow:

    // For this prototype, we'll assume we can write to 'users' if authenticated or public.
    // NOTE: This often fails if RLS is strict and user isn't "logged in" fully yet.
    // Better pattern: Let a postgres trigger handle 'auth.users' -> 'public.users'.
    // BUT user asked to do it "after login or sign up", so doing it here in code:

    if (authData.user) {
        const { error: dbError } = await supabase.from("users").insert({
            id: authData.user.id,
            email: data.email,
            username: data.options.data.username,
        });

        if (dbError) {
            console.error("Error creating user in db:", dbError);
            // Optional: return error or just log it. 
            // Often we don't want to block sign up if profile creation fails, 
            // but for this app it might be important.
        }
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
