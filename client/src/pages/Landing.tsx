import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, School } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16 px-4">
      <div className="container-width max-w-5xl w-full text-center space-y-16">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-semibold mb-4 border border-primary/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Start your journey today
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight leading-tight">
            Education tailored to <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">your path.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose your learning mode. Whether you follow the SPPU curriculum or an Autonomous path, we have the resources you need to excel.
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          {/* SPPU Card */}
          <Link href="/mode/SPPU">
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-left shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 space-y-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-6">
                  <School className="w-6 h-6" />
                </div>
                
                <h3 className="text-2xl font-bold font-display text-foreground">SPPU Mode</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Structured curriculum following the Savitribai Phule Pune University syllabus. Free access to comprehensive study materials.
                </p>
                
                <div className="pt-4 flex items-center text-primary font-semibold text-sm">
                  Access Free Content <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Autonomy Card */}
          <Link href="/mode/Autonomy">
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-left shadow-lg hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 h-full flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 space-y-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6" />
                </div>
                
                <h3 className="text-2xl font-bold font-display text-foreground">Autonomy Mode</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Specialized autonomous curriculum designed for advanced learning. Premium content with deep dive video lectures.
                </p>
                
                <div className="pt-4 flex items-center text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  Explore Premium <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
