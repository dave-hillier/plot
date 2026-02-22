import {type ReactNode} from "react";
import {Sidebar} from "./Sidebar";

export function Layout({children}: {children: ReactNode}) {
  return (
    <div className="doc-layout">
      <Sidebar />
      <main className="doc-content">
        {children}
      </main>
    </div>
  );
}
