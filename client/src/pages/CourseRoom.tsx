import { useRoute, Link } from "wouter";
import { useCourse } from "@/hooks/use-courses";
import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { Loader2, Lock, PlayCircle, CheckCircle2, ChevronLeft, FileText } from "lucide-react";
import ReactPlayer from "react-player";
import { useState, useMemo, useEffect } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourseRoom() {
  const [match, params] = useRoute("/course/:id");
  const courseId = params ? parseInt(params.id) : 0;
  
  const { data: course, isLoading: isCourseLoading } = useCourse(courseId);
  const { data: progress, isLoading: isProgressLoading } = useProgress();
  const updateProgress = useUpdateProgress();

  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Determine unlocked state based on progress
  const videoState = useMemo(() => {
    if (!course?.videos || !progress) return new Map();

    const state = new Map<number, { isLocked: boolean; isCompleted: boolean }>();
    const sortedVideos = [...course.videos].sort((a, b) => a.order - b.order);

    // First video is always unlocked
    let previousCompleted = true;

    sortedVideos.forEach((video) => {
      const userProg = progress.find(p => p.videoId === video.id && p.userId === 1); // Mock userId 1
      const isCompleted = !!userProg?.isCompleted;
      
      state.set(video.id, {
        isLocked: !previousCompleted,
        isCompleted
      });

      previousCompleted = isCompleted;
    });

    return state;
  }, [course, progress]);

  // Set initial video
  useEffect(() => {
    if (course?.videos && activeVideoId === null && videoState.size > 0) {
      const sorted = [...course.videos].sort((a, b) => a.order - b.order);
      // Find first unlocked but not completed video, or just the first one
      const nextUp = sorted.find(v => !videoState.get(v.id)?.isCompleted && !videoState.get(v.id)?.isLocked);
      setActiveVideoId(nextUp ? nextUp.id : sorted[0].id);
    }
  }, [course, videoState, activeVideoId]);

  const activeVideo = course?.videos.find(v => v.id === activeVideoId);

  const handleVideoComplete = () => {
    if (!activeVideo) return;
    updateProgress.mutate({
      userId: 1, // Mock user
      videoId: activeVideo.id,
      isCompleted: true,
      lastPosition: 0
    });
  };

  if (isCourseLoading || isProgressLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Dark Header for Cinema Mode */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 bg-zinc-900/50 backdrop-blur-sm shrink-0 z-10">
        <Link href={`/mode/${course.type}`} className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Courses
        </Link>
        <div className="mx-4 h-4 w-px bg-white/10" />
        <h1 className="text-base font-semibold text-white/90 truncate">{course.title}</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Player Area */}
        <div className="flex-1 bg-black relative flex flex-col">
          <div className="flex-1 relative flex items-center justify-center bg-zinc-950">
            {activeVideo ? (
              <div className="w-full h-full max-h-[calc(100vh-8rem)] aspect-video">
                 <ReactPlayer
                  url={activeVideo.url}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  controls
                  onEnded={handleVideoComplete}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{ backgroundColor: '#000' }}
                />
              </div>
            ) : (
              <div className="text-zinc-500 flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin mb-4 opacity-20" />
                <p>Loading Player...</p>
              </div>
            )}
          </div>
          
          {/* Mobile Info (visible on mobile below video) */}
          <div className="p-4 lg:hidden bg-zinc-900 border-t border-white/10">
             <h2 className="text-lg font-bold">{activeVideo?.title}</h2>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-zinc-900 border-l border-white/10 flex flex-col h-full shrink-0">
          <Tabs defaultValue="content" className="flex-1 flex flex-col">
            <div className="px-4 pt-4 shrink-0">
               <TabsList className="w-full grid grid-cols-2 bg-zinc-800 text-zinc-400">
                <TabsTrigger value="content" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Content</TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Notes</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="content" className="flex-1 overflow-hidden mt-2 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">Course Videos</div>
                  {course.videos.sort((a,b) => a.order - b.order).map((video) => {
                    const status = videoState.get(video.id);
                    const isActive = activeVideoId === video.id;
                    const isLocked = status?.isLocked;
                    const isCompleted = status?.isCompleted;

                    return (
                      <button
                        key={video.id}
                        disabled={isLocked}
                        onClick={() => setActiveVideoId(video.id)}
                        className={clsx(
                          "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 border border-transparent",
                          isActive ? "bg-primary/20 border-primary/30" : "hover:bg-white/5",
                          isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                        )}
                      >
                        <div className={clsx(
                          "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                          isCompleted ? "text-green-400" : (isActive ? "text-primary" : "text-zinc-500"),
                          isLocked && "text-zinc-700"
                        )}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 fill-green-400/20" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <PlayCircle className={clsx("w-5 h-5", isActive && "fill-primary/20")} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={clsx(
                            "text-sm font-medium leading-snug",
                            isActive ? "text-primary-foreground" : "text-zinc-300",
                            isCompleted && "text-zinc-400 line-through decoration-zinc-600"
                          )}>
                            {video.title}
                          </h4>
                          <span className="text-xs text-zinc-500 mt-1 block">{video.duration}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 overflow-hidden mt-2 p-0">
               <ScrollArea className="h-full">
                 <div className="p-4 space-y-4">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 px-2">Study Materials</div>
                   {course.notes?.length > 0 ? (
                     course.notes.map(note => (
                       <div key={note.id} className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                         <div className="flex items-center gap-3 mb-2 text-zinc-200 font-medium">
                           <FileText className="w-4 h-4 text-primary" />
                           {note.title}
                         </div>
                         <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                           {note.content}
                         </p>
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-10 text-zinc-500 text-sm">
                       No notes available for this course.
                     </div>
                   )}
                 </div>
               </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
