<template>
  <h1 class="h3 mb-3">Export</h1>

  <div
    v-if="message"
    :class="isError ? 'alert alert-danger' : 'alert alert-success'"
    role="alert"
  >
    {{ message }}
  </div>

  <div class="card">
    <div class="card-body">
      <div v-if="loading" class="text-muted">Loading reports…</div>
      <div v-else-if="reports.length === 0" class="alert alert-info mb-0" role="alert">
        No reports yet. Go to <strong>All reports</strong> and add a CSV first.
      </div>
      <div v-else>
        <div class="mb-3">
          <label class="form-label" for="export-report">Report</label>
          <select id="export-report" class="form-select" v-model="selectedReportId">
            <option v-for="report in reports" :key="report.id" :value="report.id">
              {{ report.name }} ({{ report.rowCount }} rows)
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Format</label>
          <div class="form-check" v-for="fmt in formats" :key="fmt.value">
            <input
              class="form-check-input"
              type="radio"
              :name="'exportFormat'"
              :id="'fmt-' + fmt.value"
              :value="fmt.value"
              v-model="format"
            />
            <label class="form-check-label" :for="'fmt-' + fmt.value">
              {{ fmt.label }}
            </label>
          </div>
        </div>

        <button class="btn btn-primary" @click="exportReport" :disabled="exporting">
          {{ exporting ? 'Exporting…' : 'Export' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ExportFormat, ReportSummary } from '@/electron.d';
import { reportService } from '@/services/reportService';

const reports = ref<ReportSummary[]>([]);
const selectedReportId = ref<number>(0);
const format = ref<ExportFormat>('xlsx');
const exporting = ref(false);
const loading = ref(false);
const message = ref('');
const isError = ref(false);

const formats: Array<{ value: ExportFormat; label: string }> = [
  { value: 'json', label: 'JSON' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'ods', label: 'LibreOffice (.ods)' }
];

onMounted(() => {
  loadReports();
});

async function loadReports() {
  loading.value = true;
  try {
    reports.value = await reportService.listReports();
    if (reports.value && reports.value.length > 0 && reports.value[0]) {
      selectedReportId.value = reports.value[0].id;
    }
  } catch (err) {
    showError(String(err));
  } finally {
    loading.value = false;
  }
}

async function exportReport() {
  if (!selectedReportId.value) return;
  exporting.value = true;
  message.value = '';
  try {
    const result = await reportService.exportReport(selectedReportId.value, format.value);
    if (result.canceled) {
      showInfo('Export cancelled.');
    } else if (result.ok && result.filePath) {
      showInfo(`Saved to ${result.filePath}`);
    } else {
      showError(result.message ?? 'Export failed');
    }
  } catch (err) {
    showError(String(err));
  } finally {
    exporting.value = false;
  }
}

function showError(msg: string) {
  isError.value = true;
  message.value = msg;
}

function showInfo(msg: string) {
  isError.value = false;
  message.value = msg;
}
</script>
