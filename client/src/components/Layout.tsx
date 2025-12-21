import { Link, useLocation } from "wouter";
import { GraduationCap, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);

  // Simple dark mode toggle logic
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const isCourseRoom = location.includes("/course/");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container-width flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground/90">
              Edu<span className="text-primary">Flow</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {!isCourseRoom && (
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <Link href="/mode/SPPU" className="hover:text-primary transition-colors">SPPU</Link>
                <Link href="/mode/Autonomy" className="hover:text-primary transition-colors">Autonomy</Link>
              </div>
            )}
            
            <div className="flex items-center gap-2 pl-4 border-l border-border/50">
               <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      {!isCourseRoom && (
        <footer className="border-t border-border/40 py-8 bg-muted/20">
          <div className="container-width text-center">
            <p className="text-sm text-muted-foreground font-medium">
              © 2024 EduFlow Learning Platform. Focus on what matters.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
