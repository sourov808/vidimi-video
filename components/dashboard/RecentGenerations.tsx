"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Film, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GeneratedVideo {
    id: string;
    prompt: string;
    video_type: string;
    style: string;
    aspect_ratio: string;
    result_text: string;
    created_at: string;
}

export function RecentGenerations() {
    const [videos, setVideos] = useState<GeneratedVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);

    const fetchGenerations = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("generated_videos")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setVideos(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchGenerations();

        // Subscribe to new generations for real-time updates
        const channel = supabase
            .channel('public:generated_videos')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'generated_videos' }, (payload) => {
                setVideos((prev) => [payload.new as GeneratedVideo, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
                <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No videos generated yet</h3>
                <p className="text-sm text-muted-foreground mt-2">Start creating to see your history here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Recent Generations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <Card key={video.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-2">
                                <Badge variant="outline" className="capitalize">{video.video_type || "Video"}</Badge>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <CardTitle className="text-base line-clamp-2 leading-tight mt-2" title={video.prompt}>
                                {video.prompt}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 pb-3">
                            <div className="flex gap-2 text-xs text-muted-foreground flex-wrap">
                                <Badge variant="secondary" className="text-xs font-normal bg-muted">{video.style}</Badge>
                                <Badge variant="secondary" className="text-xs font-normal bg-muted">{video.aspect_ratio}</Badge>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="w-full gap-2" size="sm">
                                        <Eye className="h-4 w-4" /> View Script
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">Generated Script</DialogTitle>
                                        <DialogDescription className="line-clamp-1">{video.prompt}</DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="flex-1 rounded-md border p-4 bg-muted/30 mt-4">
                                        <div className="whitespace-pre-wrap font-mono text-sm">
                                            {video.result_text || "No content generated."}
                                        </div>
                                    </ScrollArea>
                                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-4 border-t">
                                        <div className="flex gap-4">
                                            <span>Style: {video.style}</span>
                                            <span>Ratio: {video.aspect_ratio}</span>
                                        </div>
                                        <span>Generated {new Date(video.created_at).toLocaleString()}</span>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
