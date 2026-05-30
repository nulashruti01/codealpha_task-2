import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-14">
      <div className="mx-auto max-w-7xl space-y-12">
        <section className="rounded-[2rem] bg-slate-900/95 p-10 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-indigo-500/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.32em] text-indigo-300">
                Enterprise project platform
              </span>
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                FlowBoard transforms your teams into a high-performance delivery engine.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Plan work across workspaces, track sprints, automate workflows, and keep every stakeholder aligned with enterprise-grade analytics, access controls, and real-time collaboration.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/trial" className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
                  Start free trial
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Create workspace
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/40">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Executive overview</p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-indigo-400">Project health</p>
                      <h2 className="mt-3 text-3xl font-semibold text-white">92%</h2>
                    </div>
                    <div className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">On track</div>
                  </div>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-11/12 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Active projects', value: '18' },
                    { label: 'Today due', value: '12' },
                    { label: 'Team members', value: '54' },
                    { label: 'Sprint velocity', value: '37' },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/5">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                      <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Platform capabilities</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Everything your enterprise needs</h2>
              </div>
              <span className="text-sm text-slate-500">Secure, scalable, and ready for teams of any size</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                'Workspaces & role-based access',
                'Real-time collaboration',
                'Sprint analytics & velocity',
                'Automation workflows',
                'Client portals & approvals',
                'Billing & subscription management',
              ].map((feature) => (
                <div key={feature} className="rounded-3xl border border-slate-200 p-6">
                  <p className="font-semibold text-slate-900">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Featured analytics</p>
            <div className="mt-7 space-y-6">
              <div className="rounded-3xl bg-slate-950/80 p-6 ring-1 ring-white/10">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Task completion</p>
                  <p className="text-sm text-slate-300">Weekly</p>
                </div>
                <div className="mt-6 flex gap-2">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="flex-1 rounded-full bg-indigo-500/20" style={{ height: `${30 + index * 10}px` }} />
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-6 ring-1 ring-white/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Delivery risk</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-3xl font-semibold text-white">72%</p>
                    <p className="mt-2 text-sm text-slate-400">On track across active projects</p>
                  </div>
                  <div className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-300">Monitor</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
