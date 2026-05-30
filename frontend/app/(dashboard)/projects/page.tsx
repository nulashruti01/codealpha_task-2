'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createProject, getProjects, getWorkspaceList } from '../../../lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [priority, setPriority] = useState('MEDIUM');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [budget, setBudget] = useState('');
  const [client, setClient] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsResponse, workspacesResponse] = await Promise.all([
          getProjects(''),
          getWorkspaceList(),
        ]);
        setProjects(projectsResponse.data);
        const workspaceData = workspacesResponse.data.map((item: any) => item.workspace);
        setWorkspaces(workspaceData);
        setSelectedWorkspaceId(workspaceData[0]?.id ?? '');
      } catch (err) {
        setError('Failed to load projects or workspaces.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleCreateProject() {
    if (!selectedWorkspaceId) {
      setFormError('Please choose a workspace.');
      return;
    }

    setFormError(null);
    setLoading(true);

    try {
      const response = await createProject({
        title,
        description,
        workspaceId: selectedWorkspaceId,
        status,
        priority,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
        budget: budget ? Number(budget) : undefined,
        client,
        tags: tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setProjects([response.data, ...projects]);
      setTitle('');
      setDescription('');
      setStatus('ACTIVE');
      setPriority('MEDIUM');
      setStartDate('');
      setDueDate('');
      setBudget('');
      setClient('');
      setTagsInput('');
      setShowForm(false);
    } catch (err) {
      setFormError('Unable to create project.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-black/20 ring-1 ring-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Project command center</p>
            <h1 className="mt-3 text-3xl font-bold">Active and planned initiatives</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            {showForm ? 'Close form' : 'New project'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-black/20 ring-1 ring-white/10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Workspace</label>
                <select
                  value={selectedWorkspaceId}
                  onChange={(event) => setSelectedWorkspaceId(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                >
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Project name</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                  placeholder="Website redesign"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                  rows={4}
                  placeholder="Launch a modern marketing website with campaign tracking."
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Status</label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                >
                  {['PLANNED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Priority</label>
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                >
                  {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">End date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Budget</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Client</label>
                  <input
                    value={client}
                    onChange={(event) => setClient(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                    placeholder="Acme Corporation"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Tags</label>
                <input
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                  placeholder="design, marketing, launch"
                />
              </div>
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <button
                type="button"
                onClick={handleCreateProject}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Create project
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-sm shadow-slate-200">Loading projects...</div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-100 p-8 text-rose-800 shadow-sm shadow-rose-200">{error}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-white transition hover:-translate-y-1 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{project.description ?? 'No description available.'}</p>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-indigo-200">
                  {project.status.toLowerCase()}
                </span>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-slate-100">Client</p>
                  <p>{project.client ?? 'No client set'}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Progress</p>
                  <p>{project.progress}%</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Budget</p>
                  <p>{project.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Timeline</p>
                  <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'} – {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
              {project.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag: string) => (
                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
