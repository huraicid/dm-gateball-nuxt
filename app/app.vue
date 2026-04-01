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

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.app-title {
  font-weight: 700;
  font-size: 1.125rem;
}

.app-header nav a {
  color: #374151;
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
  color: #6b7280;
}
</style>
