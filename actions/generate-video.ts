"use server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/utils/supabase/server";

export type GenerationResult =
    | { success: true; message: string; remainingCredits: number }
    | { success: false; error: string; code?: string };

export interface GenerateVideoOptions {
    prompt: string;
    videoType: string;
    style: string;
    quality: string;
    aspectRatio: string;
}



export async function generateVideo(options: GenerateVideoOptions): Promise<GenerationResult> {
    const { prompt, videoType, style, quality, aspectRatio } = options;
    const supabase = await createClient();

    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Authentication required" };
    }

    // 2. Fetch User Profile (Role, Plan, Credits)
    const { data: profile, error } = await supabase
        .from("users")
        .select("role, plan, creadit")
        .eq("id", user.id)
        .single();

    if (error || !profile) {
        return { success: false, error: "User profile not found" };
    }

    const { role, plan, creadit } = profile;

    // 3. Check Plan
    if (!plan) {
        return { success: false, error: "No active plan selected", code: "NO_PLAN" };
    }

    // 4. Role & Credit Check
    const COST_PER_GENERATION = 50;

    // Admin passes free
    const isAdmin = role === "admin";
    if (!isAdmin && creadit < COST_PER_GENERATION) {
        return { success: false, error: `Insufficient credits. Need ${COST_PER_GENERATION}, have ${creadit}.`, code: "INSUFFICIENT_CREDITS" };
    }

    // 5. Gemini API Call
    let videoUri = "";
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return { success: false, error: "API Key missing" };
        }

        // 2. INITIALIZE NEW CLIENT
        const client = new GoogleGenAI({ apiKey });

        const expandedPrompt = `
            Create a detailed video: "${prompt}". 
            Style: ${style}, Aspect Ratio: ${aspectRatio}, Quality: ${quality}.
        `;

        // 3. USE generateVideos INSTEAD OF generateContent
        // Note: This starts a "Long Running Operation"
        let operation = await client.models.generateVideos({
            model: "veo-3.1-generate-preview",
            prompt: expandedPrompt,
        });


        // 4. POLL FOR COMPLETION
        // Video takes 1-3 minutes. In a "use server" action, you might want to 
        // return the operation ID to the frontend instead of waiting here to avoid timeouts.
        while (!operation.done) {
            if (!operation.name) {
                throw new Error("Operation name is missing, cannot poll for status.");
            }
            console.log("Generating video...");
            await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10s
            operation = await client.operations.get({ name: operation.name });
        }

        // 5. GET THE RESULT
        const generatedVideo = operation.response?.generatedVideos?.[0];
        if (generatedVideo?.video?.uri) {
            videoUri = generatedVideo.video.uri;
        }

    } catch (apiError: any) {
        console.error("Gemini API Error:", apiError);
        return { success: false, error: apiError.message || "Failed to generate video." };
    }

    // 6. Deduct Credits (if not admin)
    let newCreditBalance = creadit;
    if (!isAdmin) {
        newCreditBalance = creadit - COST_PER_GENERATION;
        const { error: updateError } = await supabase
            .from("users")
            .update({ creadit: newCreditBalance })
            .eq("id", user.id);

        if (updateError) {
            return { success: false, error: "Failed to process credits" };
        }
    }

    // 7. Save generation to DB
    const { error: insertError } = await supabase
        .from("generated_videos")
        .insert({
            user_id: user.id,
            prompt,
            video_type: videoType,
            style,
            aspect_ratio: aspectRatio,
            result_text: videoUri
        });

    if (insertError) {
        console.error("Failed to save generation:", insertError);
    }

    // 8. Return Success
    return {
        success: true,
        message: isAdmin
            ? "Admin generation successful (Gemini Script Saved)"
            : "Generation started! Credits deducted.",
        remainingCredits: newCreditBalance
    };
}
