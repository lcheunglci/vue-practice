<template>
  <v-container fluid style="margin-top: 50px">
    <h2 class="text-h3 mb-3">Export</h2>

    <v-alert v-if="message" :type="isError ? 'error' : 'success'" variant="tonal" class="mb-4">
      {{ message }}
    </v-alert>

    <v-card>
      <v-card-text>
        <v-progress-circular v-if="loading" indeterminate color="primary" />

        <v-alert v-else-if="reports.length === 0" type="info" variant="tonal" class="mb-0">
          No reports yet. Go to <strong>All reports</strong> and add a CSV first.
        </v-alert>

        <v-form v-else>
          <v-select
            v-model="selectedReportId"
            :items="reports"
            item-title="name"
            item-value="id"
            label="Report"
            variant="outlined"
            density="compact"
          >
            <template #item="{ item }">
              <span>{{ item.raw.name }} ({{ item.raw.rowCount }} rows)</span>
            </template>
          </v-select>

          <v-select
            v-model="format"
            :items="formats"
            item-title="label"
            item-value="value"
            label="Format"
            variant="outlined"
            density="compact"
            class="mt-2"
          />

          <v-btn color="primary" class="mt-2" @click="exportReport" :loading="exporting">
            {{ exporting ? 'Exporting…' : 'Export' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ExportFormat, ReportSummary } from '@/electron.d'
import { reportService } from '@/services/reportService'

const reports = ref<ReportSummary[]>([])
const selectedReportId = ref<number>(0)
const format = ref<ExportFormat>('xlsx')
const exporting = ref(false)
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const formats: Array<{ value: ExportFormat; label: string }> = [
  { value: 'json', label: 'JSON' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'ods', label: 'LibreOffice (.ods)' }
]

onMounted(() => {
  loadReports()
})

async function loadReports() {
  loading.value = true
  try {
    reports.value = await reportService.listReports()
    if (reports.value && reports.value.length > 0 && reports.value[0]) {
      selectedReportId.value = reports.value[0].id
    }
  } catch (err) {
    showError(String(err))
    window.reportApi?.logError?.('error', String(err), { component: 'ExportView.vue', action: 'loadReports' })
  } finally {
    loading.value = false
  }
}

async function exportReport() {
  if (!selectedReportId.value) return
  exporting.value = true
  message.value = ''
  try {
    const result = await reportService.exportReport(selectedReportId.value, format.value)
    if (result.canceled) {
      showInfo('Export cancelled.')
    } else if (result.ok && result.filePath) {
      showInfo(`Saved to ${result.filePath}`)
    } else {
      showError(result.message ?? 'Export failed')
    }
  } catch (err) {
    showError(String(err))
  } finally {
    exporting.value = false
  }
}

function showError(msg: string) {
  isError.value = true
  message.value = msg
}

function showInfo(msg: string) {
  isError.value = false
  message.value = msg
}
</script>