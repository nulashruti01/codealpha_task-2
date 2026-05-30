'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTrial } from '../../lib/auth';

export default function TrialPage() {
  const router = useRouter();

  function handleStartTrial() {
    startTrial();
    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">
              No account needed
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Try FlowBoard free for 3 days.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Explore projects, boards, and task workflows with a preview account. No sign-up required — just click below to view the experience.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live demo board</p>
              <div className="mt-8 grid gap-4 text-sm">
                <div className="rounded-3xl bg-slate-900 p-6">
                  <div className="mb-4 flex justify-between text-slate-200">
                    <span>Release plan</span>
                    <span>8 tasks</span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-3xl bg-slate-800 p-4">
                      <p className="font-semibold">Design review</p>
                      <p className="text-slate-400">Create interactive prototypes for the new funnel.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-800 p-4">
                      <p className="font-semibold">Sprint planning</p>
                      <p className="text-slate-400">Align the team on goals and deliverables.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-100 p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Start your demo</h2>
                  <p className="mt-2 text-slate-600">
                    View a preview of FlowBoard without creating an account. The trial experience includes sample projects, boards, and tasks.
                  </p>
                </div>
                <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">3-day free trial</p>
                    <p className="mt-2 text-sm text-slate-600">Experience the product before you sign up.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">No account required</p>
                    <p className="mt-2 text-sm text-slate-600">Browse a demo workspace instantly.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleStartTrial}
                  className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Start 3-day trial
                </button>
                <Link href="/register" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Create real account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
