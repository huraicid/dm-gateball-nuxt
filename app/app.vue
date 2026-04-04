<template>
  <div>
    <header class="app-header">
      <span class="app-title">DM Gateball</span>
      <nav>
        <a href="https://github.com/huraicid/dm-gateball-nuxt" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </nav>
    </header>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <footer class="app-footer">
      &copy; 2026 huraicid. All rights reserved.
    </footer>
  </div>
</template>

<style>
:root {
  --bg: #ffffff;
  --bg-surface: #f3f4f6;
  --bg-surface-alt: #f9fafb;
  --border: #d1d5db;
  --border-header: #e5e7eb;
  --text: #111827;
  --text-muted: #6b7280;
  --text-secondary: #374151;
  --input-bg: #ffffff;

  --cell-favorable-bg: #dcfce7;
  --cell-favorable-text: #166534;
  --cell-unfavorable-bg: #fee2e2;
  --cell-unfavorable-text: #991b1b;
  --cell-even-bg: #fef9c3;
  --cell-even-text: #854d0e;
  --cell-neutral-bg: #f3f4f6;
  --cell-neutral-text: #9ca3af;

  --success-bg: #d1fae5;
  --success-text: #065f46;
  --winner-btn-bg: #ffffff;
  --winner-btn-selected-bg: #eff6ff;
  --winner-btn-selected-border: #2563eb;
  --winner-btn-selected-text: #1d4ed8;
  --submit-btn-bg: #2563eb;
  --submit-btn-disabled-bg: #9ca3af;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111827;
    --bg-surface: #1f2937;
    --bg-surface-alt: #374151;
    --border: #374151;
    --border-header: #374151;
    --text: #f9fafb;
    --text-muted: #9ca3af;
    --text-secondary: #d1d5db;
    --input-bg: #1f2937;

    --cell-favorable-bg: #14532d;
    --cell-favorable-text: #86efac;
    --cell-unfavorable-bg: #7f1d1d;
    --cell-unfavorable-text: #fca5a5;
    --cell-even-bg: #713f12;
    --cell-even-text: #fde68a;
    --cell-neutral-bg: #1f2937;
    --cell-neutral-text: #6b7280;

    --success-bg: #064e3b;
    --success-text: #6ee7b7;
    --winner-btn-bg: #1f2937;
    --winner-btn-selected-bg: #1e3a8a;
    --winner-btn-selected-border: #3b82f6;
    --winner-btn-selected-text: #93c5fd;
    --submit-btn-bg: #2563eb;
    --submit-btn-disabled-bg: #4b5563;
  }
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Noto Sans JP', sans-serif;
}
</style>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-header);
}

.app-title {
  font-weight: 700;
  font-size: 1.125rem;
}

.app-header nav a {
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-decoration: none;
}

.app-header nav a:hover {
  text-decoration: underline;
}

.app-footer {
  text-align: center;
  padding: 1.5rem 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
