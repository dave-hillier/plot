import type {AnchorHTMLAttributes} from "react";
import {Link, useLocation} from "wouter";

// Markdown links in the docs use source-relative .md hrefs (e.g.
// "../marks/rect.md#rect"). Mapped over MDX's anchor element, this resolves
// them against the current route, strips the extension, and navigates through
// the router so the base path is honored on GitHub Pages. External and
// same-page hash links pass through untouched.
export function DocLink({href = "", children, ...rest}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [location] = useLocation();
  if (/^[a-z][\w+.-]*:/.test(href) || href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  const [path, hash] = href.split("#");
  let target = path.replace(/\.mdx?$/, "");
  if (!target.startsWith("/")) {
    const dir = location.slice(0, location.lastIndexOf("/") + 1) || "/";
    target = new URL(target === "" ? "." : target, `https://resolve${dir}`).pathname;
  }
  if (target !== "/") target = target.replace(/\/$/, "");
  return (
    <Link href={target + (hash ? `#${hash}` : "")} {...rest}>
      {children}
    </Link>
  );
}
