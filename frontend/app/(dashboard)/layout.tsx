import Link from 'next/link';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold text-white">
            FlowBoard
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <Link href="/dashboard" className="rounded-full px-4 py-2 transition hover:bg-slate-800/80 hover:text-white">
              Executive
            </Link>
            <Link href="/dashboard/projects" className="rounded-full px-4 py-2 transition hover:bg-slate-800/80 hover:text-white">
              Projects
            </Link>
            <Link href="/login" className="rounded-full bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-400">
              Sign out
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
