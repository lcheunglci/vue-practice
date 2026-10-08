<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="app-shell">
    <nav class="sidebar bg-dark text-white d-flex flex-column">
      <div class="sidebar-brand px-3 py-3">
        <h1 class="h5 mb-1">Reports Insight</h1>
        <span class="small text-secondary">Electron + Vue</span>
      </div>
      <ul class="nav nav-pills flex-column px-2">
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            to="/reports"
            :class="{ active: $route.path.startsWith('/reports') }"
          >
            All reports
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/export" active-class="active">
            Export
          </RouterLink>
        </li>
      </ul>
    </nav>

    <main class="content flex-grow-1 p-4 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:host {
  display: block;
  height: 100vh;
}

.app-shell {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.sidebar .nav-link {
  color: var(--bs-secondary);
  border-radius: 0.375rem;
}

.sidebar .nav-link:hover {
  color: var(--bs-white);
}

.sidebar .nav-link.active {
  background-color: var(--bs-primary);
  color: var(--bs-white);
}
</style>
