'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProject } from '../../../../lib/api';

interface Props {
  params: {
    id: string;
  };
}

const views = ['Kanban', 'List', 'Calendar', 'Timeline', 'Gantt', 'Table'] as const;

type ViewKey = (typeof views)[number];

export default function ProjectDetailPage({ params }: Props) {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>('Kanban');

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await getProject(params.id);
        setProject(response.data);
      } catch (err) {
        setError('Unable to load project details.');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [params.id]);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-black/20 ring-1 ring-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Project workspace</p>
            <h1 className="mt-3 text-3xl font-bold">{project?.title ?? `Project ${params.id}`}</h1>
            <p className="mt-2 text-slate-300">{project?.description ?? 'Manage progress, assignments, and timeline for this project.'}</p>
          </div>
          <Link href="/dashboard/projects" className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
            Back to projects
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-sm shadow-slate-200">Loading project board...</div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-100 p-8 text-rose-800 shadow-sm shadow-rose-200">{error}</div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] bg-white p-8 text-slate-900 shadow-sm shadow-slate-200">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Status</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{project?.status}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Priority</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{project?.priority}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Timeline</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{project?.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'} – {project?.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'TBD'}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Budget</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{project?.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Client</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{project?.client ?? 'No client set'}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Team members</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{project?.workspace?.members?.length ?? 0}</p>
                </div>
              </div>
              {project?.tags?.length ? (
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-indigo-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-sm shadow-black/20">
              <div className="flex flex-wrap items-center gap-2">
                {views.map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setActiveView(view)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeView === view ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-300 hover:bg-white/15'}`}
                  >
                    {view}
                  </button>
                ))}
              </div>
              <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 ring-1 ring-white/10">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Current view</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">{activeView}</h2>
                <p className="mt-2 text-sm text-slate-400">Switch instantly between Kanban, List, Calendar, Timeline, Gantt, and Table views for this project.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-black/30 ring-1 ring-white/10">
            {activeView === 'Kanban' && (
              <div className="grid gap-6 lg:grid-cols-3">
                {project?.boards?.map((board: any) => (
                  <div key={board.id} className="rounded-[1.75rem] bg-slate-950 p-6">
                    <h3 className="text-lg font-semibold text-white">{board.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{board.tasks.length} tasks</p>
                    <div className="mt-6 space-y-4">
                      {board.tasks.map((task: any) => (
                        <div key={task.id} className="rounded-3xl bg-slate-800 p-4 text-sm text-slate-200">
                          <p className="font-semibold">{task.title}</p>
                          <p className="mt-1 text-slate-400">{task.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeView === 'List' && (
              <div className="space-y-4">
                {project?.boards?.flatMap((board: any) => board.tasks).map((task: any) => (
                  <div key={task.id} className="rounded-[1.5rem] border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-200">{task.status}</span>
                    </div>
                    <p className="mt-2 text-slate-400">{task.description ?? 'No description available.'}</p>
                  </div>
                ))}
              </div>
            )}
            {activeView === 'Calendar' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {project?.boards?.flatMap((board: any) => board.tasks).map((task: any) => (
                  <div key={task.id} className="rounded-[1.5rem] bg-slate-950 p-5">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{task.status}</p>
                    <h3 className="mt-2 font-semibold text-white">{task.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}</p>
                  </div>
                ))}
              </div>
            )}
            {activeView === 'Timeline' && (
              <div className="space-y-4">
                {project?.boards?.flatMap((board: any) => board.tasks).map((task: any) => (
                  <div key={task.id} className="rounded-[1.5rem] bg-slate-950 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <span className="text-sm text-slate-400">{task.status}</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: '65%' }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Start TBD'} – {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'End TBD'}</p>
                  </div>
                ))}
              </div>
            )}
            {activeView === 'Gantt' && (
              <div className="space-y-4">
                {project?.boards?.flatMap((board: any) => board.tasks).map((task: any) => (
                  <div key={task.id} className="rounded-[1.5rem] bg-slate-950 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <span className="text-sm text-slate-400">{task.status}</span>
                    </div>
                    <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${Math.min(100, (task.storyPoints ?? 1) * 10)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeView === 'Table' && (
              <div className="overflow-auto rounded-[1.5rem] bg-slate-950 p-4">
                <table className="min-w-full text-left text-sm text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="px-4 py-3">Task</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project?.boards?.flatMap((board: any) => board.tasks).map((task: any) => (
                      <tr key={task.id} className="border-b border-slate-800">
                        <td className="px-4 py-4 text-white">{task.title}</td>
                        <td className="px-4 py-4">{task.status}</td>
                        <td className="px-4 py-4">{task.priority}</td>
                        <td className="px-4 py-4">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
