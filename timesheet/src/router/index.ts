import { createRouter, createWebHistory } from 'vue-router'

import TimesheetView from '../views/TimesheetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/timesheet' },
    { path: '/timesheet', component: TimesheetView },
  ],
})

export default router