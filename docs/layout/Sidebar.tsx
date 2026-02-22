import {useState} from "react";
import {Link, useLocation} from "wouter";
import {sidebar, type SidebarItem} from "../sidebar";

function SidebarSection({item}: {item: SidebarItem}) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(item.collapsed ?? false);

  if (!item.items) {
    return (
      <li>
        <Link
          href={item.link!}
          className={`sidebar-link${location === item.link ? " active" : ""}`}
        >
          {item.text}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        className="sidebar-group-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
      >
        {item.text}
        <span className="sidebar-chevron" aria-hidden="true">
          {collapsed ? "\u25B6" : "\u25BC"}
        </span>
      </button>
      {!collapsed && (
        <ul role="list">
          {item.items.map((child) => (
            <SidebarItem key={child.link ?? child.text} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarItem({item}: {item: SidebarItem}) {
  const [location] = useLocation();

  if (item.items) {
    return <SidebarSection item={item} />;
  }

  if (item.link?.startsWith("http")) {
    return (
      <li>
        <a href={item.link} className="sidebar-link" target="_blank" rel="noopener noreferrer">
          {item.text}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.link!}
        className={`sidebar-link${location === item.link ? " active" : ""}`}
      >
        {item.text}
      </Link>
    </li>
  );
}

export function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Documentation">
      <header className="sidebar-header">
        <Link href="/">
          <strong>Replot</strong>
        </Link>
      </header>
      <ul role="list">
        {sidebar.map((item) => (
          <SidebarSection key={item.text} item={item} />
        ))}
      </ul>
    </nav>
  );
}
