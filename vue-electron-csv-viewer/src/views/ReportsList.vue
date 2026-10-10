<template>
  <v-container fluid style="margin-top: 50px">
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col>
        <h1 class="text-h3 mb-1">All reports</h1>
        <p class="text-caption text-grey-6">
          Loaded CSV reports stored in the local SQLite database
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn color="error" variant="outlined" class="mr-2" @click="clearAll" :disabled="reports.length === 0">
          Clear all
        </v-btn>
        <v-btn color="primary" @click="addReport">
          Add report
        </v-btn>
      </v-col>
    </v-row>

    <v-progress-circular v-if="loading" indeterminate color="primary" class="my-5" />

    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-alert v-else-if="reports.length === 0" type="info" variant="tonal" class="mb-4">
      No reports yet. Click <strong>Add report</strong> to load a CSV file.
    </v-alert>

    <v-table v-else class="elevation-1">
      <thead>
        <tr>
          <th class="text-start">Name</th>
          <th class="text-start">Source file</th>
          <th class="text-start">Rows</th>
          <th class="text-start">Imported</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report.id">
          <td>{{ report.name }}</td>
          <td class="text-grey-6">{{ report.sourceFile }}</td>
          <td>{{ report.rowCount }}</td>
          <td>{{ formatDate(report.importedAt) }}</td>
          <td class="text-end">
            <v-btn color="primary" variant="outlined" size="small" class="mr-2" @click="viewReport(report.id)">
              View
            </v-btn>
            <v-btn color="error" variant="outlined" size="small" @click="remove(report)">
              Delete
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <AddReportDialog v-model="showAddModal" @imported="onImported" />
    <ConfirmClearDialog
      v-model="showClearModal"
      :report-count="reports.length"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { reportService } from '@/services/reportService'
import type { ReportSummary } from '@/electron.d'
import AddReportDialog from '@/components/AddReportDialog.vue'
import ConfirmClearDialog from '@/components/ConfirmClearDialog.vue'

const router = useRouter()
const reports = ref<ReportSummary[]>([])
const loading = ref(false)
const error = ref('')

const showAddModal = ref(false)
const showClearModal = ref(false)

onMounted(() => {
  refresh()
})

async function refresh() {
  loading.value = true
  error.value = ''
  try {
    reports.value = await reportService.listReports()
  } catch (err) {
    error.value = String(err)
  } finally {
    loading.value = false
  }
}

function addReport() {
  showAddModal.value = true
}

function onImported() {
  showAddModal.value = false
  refresh()
}

function clearAll() {
  if (reports.value.length === 0) return
  showClearModal.value = true
}

async function remove(report: ReportSummary) {
  const confirmed = window.confirm(`Delete "${report.name}" and all of its rows?`)
  if (!confirmed) return
  try {
    await reportService.deleteReport(report.id)
    refresh()
  } catch (err) {
    error.value = String(err)
  }
}

function viewReport(id: number) {
  router.push(`/reports/${id}`)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}
</script>
