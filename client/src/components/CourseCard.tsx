import { Link } from "wouter";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import type { Course } from "@shared/schema";
import { motion } from "framer-motion";

interface CourseCardProps {
  course: Course;
  index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
  return (
    <Link href={`/course/${course.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        {/* Image Container */}
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img 
            src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} // Default education image
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <PlayCircle className="w-8 h-8 text-primary fill-primary/10" />
            </div>
          </div>

          <div className="absolute top-3 left-3">
             <span className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-md shadow-sm border ${
               course.type === 'SPPU' 
                 ? 'bg-blue-500/10 border-blue-200/20 text-blue-100' 
                 : 'bg-amber-500/10 border-amber-200/20 text-amber-100'
             }`}>
               {course.type}
             </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-lg font-bold font-display text-card-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-4 border-t border-border/40">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Modules included</span>
            </div>
            <div className="flex items-center gap-1 text-primary/80">
              <span className="group-hover:translate-x-0.5 transition-transform">Start Learning</span>
              <PlayCircle className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
