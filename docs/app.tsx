import {createRoot} from "react-dom/client";
import {Switch, Route, Router, useLocation} from "wouter";
import {MDXProvider} from "@mdx-js/react";
import {Layout} from "./layout/Layout";
import {lazy, Suspense, useEffect, type ComponentType} from "react";
import {VersionBadge} from "./components/VersionBadge";
import {PlotExample} from "./components/PlotExample";
import {DocLink} from "./components/DocLink";
import {CodeBlock} from "./components/CodeBlock";

// Dynamically import all MDX pages using Vite glob
const pages = import.meta.glob<{default: ComponentType}>("./**/*.mdx");

// Build a route map: "/getting-started" → lazy(() => import("./getting-started.mdx"))
const routes: {path: string; Component: React.LazyExoticComponent<ComponentType>}[] = [];

for (const [filePath, importFn] of Object.entries(pages)) {
  // Convert "./getting-started.mdx" → "/getting-started"
  // Convert "./marks/dot.mdx" → "/marks/dot"
  let routePath = filePath
    .replace(/^\.\//, "/")
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "");

  if (routePath === "") routePath = "/";

  routes.push({
    path: routePath,
    Component: lazy(importFn)
  });
}

// Sort so more specific routes come first
routes.sort((a, b) => b.path.length - a.path.length);

const mdxComponents = {VersionBadge, PlotExample, a: DocLink, pre: CodeBlock};

// The site is served under a subpath on GitHub Pages; Vite injects the base.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

// Lazy routes mount after navigation, so scroll to the hash target once it
// exists (bounded retries), or to the top for hash-less navigations.
function ScrollManager() {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let raf = 0;
    const attempt = () => {
      const el = document.getElementById(decodeURIComponent(hash));
      if (el) el.scrollIntoView();
      else if (tries++ < 40) raf = requestAnimationFrame(attempt);
    };
    attempt();
    return () => cancelAnimationFrame(raf);
  }, [location]);
  return null;
}

function App() {
  return (
    <Router base={routerBase}>
      <ScrollManager />
      <MDXProvider components={mdxComponents}>
        <Layout>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              {routes.map(({path, Component}) => (
                <Route key={path} path={path}>
                  <Component />
                </Route>
              ))}
              <Route>
                <p>Page not found.</p>
              </Route>
            </Switch>
          </Suspense>
        </Layout>
      </MDXProvider>
    </Router>
  );
}

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
