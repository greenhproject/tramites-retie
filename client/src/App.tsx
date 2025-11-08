import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import ProjectDetail from "./pages/ProjectDetail";
import Users from "./pages/Users";
import Tramites from "./pages/Tramites";
import TramiteTypes from "./pages/TramiteTypes";
import Notifications from "./pages/Notifications";
import Configuration from "./pages/Configuration";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/proyectos" component={Projects} />
      <Route path="/proyectos/nuevo" component={NewProject} />
      <Route path="/proyectos/:id" component={ProjectDetail} />
      <Route path="/usuarios" component={Users} />
      <Route path="/tramites" component={Tramites} />
      <Route path="/notificaciones" component={Notifications} />
      <Route path="/configuracion" component={Configuration} />
      <Route path="/configuracion/tramites" component={TramiteTypes} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
