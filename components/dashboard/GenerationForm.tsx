"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { generateVideo } from "@/actions/generate-video";

export const GenerationForm = () => {
    const [prompt, setPrompt] = useState("");
    const [videoType, setVideoType] = useState("explainer");
    const [style, setStyle] = useState("realistic");
    const [quality, setQuality] = useState("standard");
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!prompt) return;

        setIsGenerating(true);

        try {
            const result = await generateVideo({
                prompt,
                videoType,
                style,
                quality,
                aspectRatio
            });

            if (!result.success) {
                if (result.code === "NO_PLAN") {
                    toast.error("Please select a plan to continue.");
                    router.push("/pricing");
                } else if (result.code === "INSUFFICIENT_CREDITS") {
                    toast.error(result.error);
                } else {
                    toast.error(result.error || "Generation failed");
                }
                return;
            }

            toast.success(result.message);
            router.refresh();

        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-lg font-semibold mb-2">Create New Video</h2>
                <p className="text-sm text-muted-foreground">Describe your vision and let AI handle the rest.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Prompt</Label>
                    <Textarea
                        id="prompt"
                        placeholder="A futuristic city with flying cars at sunset..."
                        className="h-32 resize-none text-lg"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Video Type</Label>
                        <Select value={videoType} onValueChange={setVideoType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="explainer">Explainer</SelectItem>
                                <SelectItem value="social">Social Media</SelectItem>
                                <SelectItem value="cinematic">Cinematic</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="presentation">Presentation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Style</Label>
                        <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="realistic">Realistic</SelectItem>
                                <SelectItem value="animation">3D Animation</SelectItem>
                                <SelectItem value="anime">Anime</SelectItem>
                                <SelectItem value="sketch">Sketch</SelectItem>
                                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Aspect Ratio</Label>
                        <Select value={aspectRatio} onValueChange={setAspectRatio}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select ratio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Quality</Label>
                        <Select value={quality} onValueChange={setQuality}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Standard (720p)</SelectItem>
                                <SelectItem value="high">High (1080p)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    size="lg"
                    className="w-full h-12 text-lg"
                    onClick={handleGenerate}
                    disabled={!prompt || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Video
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
