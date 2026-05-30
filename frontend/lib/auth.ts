export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('flowboard_token');
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('flowboard_token', token);
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('flowboard_token');
}

export function markFirstLogin() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('flowboard_first_login', 'true');
}

export function hasFirstLogin() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('flowboard_first_login') === 'true';
}

export function clearFirstLogin() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('flowboard_first_login');
}

export function startTrial() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('flowboard_trial', 'true');
  localStorage.setItem('flowboard_trial_started_at', new Date().toISOString());
}

export function getTrialStatus() {
  if (typeof window === 'undefined') return { isTrial: false, daysLeft: 0 };

  const active = localStorage.getItem('flowboard_trial') === 'true';
  const startedAt = localStorage.getItem('flowboard_trial_started_at');
  if (!active || !startedAt) {
    return { isTrial: false, daysLeft: 0 };
  }

  const started = new Date(startedAt).getTime();
  const elapsedDays = Math.floor((new Date().getTime() - started) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 3 - elapsedDays);

  return { isTrial: daysLeft > 0, daysLeft };
}
