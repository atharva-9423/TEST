import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Landing from "@/pages/Landing";
import CourseCatalog from "@/pages/CourseCatalog";
import CourseRoom from "@/pages/CourseRoom";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      
      {/* Course Catalog wrapped in main layout */}
      <Route path="/mode/:type">
        <Layout>
          <CourseCatalog />
        </Layout>
      </Route>

      {/* Course Room is full screen, manages its own layout structure */}
      <Route path="/course/:id" component={CourseRoom} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
           {/* Note: Layout wraps everything to provide context/theme, 
               but router handles specific page rendering including those that might hide nav/footer */}
           {/* Wait, the Router component above applies Layout manually to some routes. 
               Let's refactor slightly to be cleaner. 
               The Layout component handles route checking internally to show/hide nav elements.
               So wrapping the whole router in Layout is fine if Layout is smart.
           */}
           {/* Actually, let's remove the Layout from here and let the Router manage it 
               or let the pages manage it. 
               Better pattern: Layout inside App, wrapping Router. 
               Layout detects path to conditionally render header/footer. 
           */}
        </Layout>
        
        {/* Correction: The Router function defined above returns <Switch>...
            I should wrap the Router in Layout if I want Layout to persist.
            But CourseRoom needs full screen. Layout component has logic `isCourseRoom`.
            So I will wrap Router with Layout.
        */}
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
