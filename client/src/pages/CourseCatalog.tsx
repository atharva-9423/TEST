import { useRoute } from "wouter";
import { useCourses } from "@/hooks/use-courses";
import { CourseCard } from "@/components/CourseCard";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function CourseCatalog() {
  const [match, params] = useRoute("/mode/:type");
  const mode = params?.type as "SPPU" | "Autonomy";
  const { data: courses, isLoading } = useCourses();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const filteredCourses = courses?.filter(c => 
    c.type === mode && 
    c.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen py-12">
      <div className="container-width">
        
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">{mode} Curriculum</div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                Available Courses
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Select a course to begin streaming. Complete videos sequentially to unlock the next chapter.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, idx) => (
              <CourseCard key={course.id} course={course} index={idx} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No courses found</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              We couldn't find any courses matching "{search}" in {mode} mode.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
