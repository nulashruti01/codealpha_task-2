'use client';

import { useEffect, useState } from 'react';
import { getWorkspaceList, getWorkspaceSummary } from '../../lib/api';
import { clearFirstLogin, getTrialStatus, hasFirstLogin } from '../../lib/auth';

interface WorkspaceSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  teamMembers: number;
  tasksDueToday: number;
  overdueTasks: number;
  productivityScore: number;
  sprintProgress: string;
  velocity: number;
  completionTrend: { label: string; value: number }[];
  workloadBreakdown: { label: string; value: number }[];
}

export default function DashboardHomePage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [summary, setSummary] = useState<WorkspaceSummary | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [trialStatus, setTrialStatus] = useState({ isTrial: false, daysLeft: 0 });

  useEffect(() => {
    const status = getTrialStatus();
    setTrialStatus(status);
    setShowWelcome(hasFirstLogin() || status.isTrial);

    async function loadWorkspace() {
      try {
        const response = await getWorkspaceList();
        const workspaceData = response.data.map((item: any) => item.workspace);
        setWorkspaces(workspaceData);
        if (workspaceData.length) {
          setSelectedWorkspaceId(workspaceData[0].id);
        }
      } catch (err) {
        setError('Unable to load workspaces. Please sign in.');
      }
    }

    loadWorkspace();
  }, []);

  useEffect(() => {
    async function loadSummary() {
      if (!selectedWorkspaceId) return;
      setLoading(true);
      try {
        const response = await getWorkspaceSummary(selectedWorkspaceId);
        setSummary(response.data);
      } catch (err) {
        setError('Unable to load workspace summary.');
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [selectedWorkspaceId]);

  function handleContinue() {
    clearFirstLogin();
    setShowWelcome(false);
  }

  if (showWelcome) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[2rem] bg-slate-900/95 p-10 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex rounded-full bg-indigo-500/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.32em] text-indigo-300">
                  {trialStatus.isTrial ? '3-day trial active' : 'Welcome aboard'}
                </span>
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {trialStatus.isTrial
                    ? 'Explore your trial executive dashboard'
                    : 'Your executive workspace is ready'}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  {trialStatus.isTrial
                    ? `You have ${trialStatus.daysLeft} day${trialStatus.daysLeft === 1 ? '' : 's'} left in your trial. Start by reviewing workspace health, team velocity, and project progress.`
                    : 'Check your first workspace summary, open reports, and get a real-time view of team performance in one place.'}
                </p>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Continue to dashboard
                </button>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/40">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">First interface</p>
                <div className="mt-8 grid gap-4">
                  <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-indigo-400">Total projects</p>
                        <h2 className="mt-3 text-3xl font-semibold text-white">24</h2>
                      </div>
                      <div className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live</div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Active projects', value: '16' },
                      { label: 'Tasks due today', value: '18' },
                      { label: 'Team members', value: '32' },
                      { label: 'Overdue tasks', value: '7' },
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
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-slate-900/90 p-8 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-indigo-300">Executive workspace</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Real-time leadership analytics for every workspace.</h1>
              <p className="mt-4 max-w-2xl text-slate-300">Monitor project velocity, team workload, sprint health, and delivery risk from one powerful dashboard.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/95 px-5 py-4 text-sm ring-1 ring-white/10">
              <p className="text-slate-400">Workspace</p>
              <select
                value={selectedWorkspaceId ?? ''}
                onChange={(event) => setSelectedWorkspaceId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
              >
                {workspaces.length === 0 ? <option value="">No workspace available</option> : null}
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            { label: 'Active projects', value: summary?.activeProjects ?? '—' },
            { label: 'Completed projects', value: summary?.completedProjects ?? '—' },
            { label: 'Delayed projects', value: summary?.delayedProjects ?? '—' },
            { label: 'Team members', value: summary?.teamMembers ?? '—' },
            { label: 'Due today', value: summary?.tasksDueToday ?? '—' },
            { label: 'Overdue tasks', value: summary?.overdueTasks ?? '—' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/10 text-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Productivity score</p>
                <h2 className="mt-2 text-3xl font-semibold">{summary ? `${summary.productivityScore}%` : '—'}</h2>
              </div>
              <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">Executive health</span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sprint velocity</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{summary ? summary.velocity : '—'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sprint progress</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{summary?.sprintProgress ?? '—'}</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Completion trend</p>
                <div className="mt-4 flex items-end gap-2">
                  {(summary?.completionTrend ?? []).map((item) => (
                    <div key={item.label} className="flex-1 rounded-full bg-indigo-500/10 text-center text-[0.6rem] text-slate-600" style={{ height: `${item.value * 3}px` }}>
                      <span className="block pt-2">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-8 ring-1 ring-white/10 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Workload distribution</p>
            <div className="mt-6 space-y-4">
              {(summary?.workloadBreakdown ?? []).map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {error && <p className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p>}
      </div>
    </main>
  );
}
