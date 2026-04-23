import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PasscodeLock from "./components/PasscodeLock";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Attributes from "./pages/Attributes";
import UBOProfiles from "./pages/UBOProfiles";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/properties"} component={Properties} />
      <Route path={"/attributes"} component={Attributes} />
      <Route path={"/profiles"} component={UBOProfiles} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <PasscodeLock>
            <Router />
          </PasscodeLock>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
export default App;
