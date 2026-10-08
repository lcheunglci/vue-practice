import { createRouter, createWebHashHistory } from 'vue-router'
import ReportsList from '@/views/ReportsList.vue'
import ReportDetail from '@/views/ReportDetail.vue'
import ExportView from '@/views/ExportView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/reports' },
    { path: '/reports', name: 'reports', component: ReportsList },
    { path: '/reports/:id', name: 'report-detail', component: ReportDetail, props: true },
    { path: '/export', name: 'export', component: ExportView }
  ],
})

export default router
