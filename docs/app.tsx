import {createRoot} from "react-dom/client";
import {Switch, Route} from "wouter";
import {MDXProvider} from "@mdx-js/react";
import {Layout} from "./layout/Layout";
import {lazy, Suspense, type ComponentType} from "react";
import {VersionBadge} from "./components/VersionBadge";

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

const mdxComponents = {VersionBadge};

function App() {
  return (
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
  );
}

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
