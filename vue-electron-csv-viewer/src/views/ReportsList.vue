<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <div>
      <h1 class="h3 mb-0">All reports</h1>
      <p class="text-muted mb-0">Loaded CSV reports stored in the local SQLite database</p>
    </div>
    <div>
      <button class="btn btn-outline-danger me-2" @click="clearAll" :disabled="reports.length === 0">
        Clear all
      </button>
      <button class="btn btn-primary" @click="addReport">
        Add report
      </button>
    </div>
  </div>

  <div v-if="loading" class="d-flex justify-content-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading…</span>
    </div>
  </div>
  <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
  <div v-else-if="reports.length === 0" class="alert alert-info" role="alert">
    No reports yet. Click <strong>Add report</strong> to load a CSV file.
  </div>
  <div v-else class="table-responsive">
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th>Name</th>
          <th>Source file</th>
          <th>Rows</th>
          <th>Imported</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report.id">
          <td>{{ report.name }}</td>
          <td class="text-muted">{{ report.sourceFile }}</td>
          <td>{{ report.rowCount }}</td>
          <td>{{ formatDate(report.importedAt) }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-2" @click="viewReport(report.id)">
              View
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="remove(report)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <AddReportModal v-if="showAddModal" @close="onAddModalClose" @imported="onImported" />
  <ConfirmClearAllModal
    v-if="showClearModal"
    :reportCount="reports.length"
    @close="onClearModalClose"
    @confirmed="onClearConfirmed"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { reportService } from '@/services/reportService';
import type { ReportSummary } from '@/electron.d';
import AddReportModal from '@/components/AddReportModal.vue';
import ConfirmClearAllModal from '@/components/ConfirmClearAllModal.vue';

const router = useRouter();
const reports = ref<ReportSummary[]>([]);
const loading = ref(false);
const error = ref('');

const showAddModal = ref(false);
const showClearModal = ref(false);

onMounted(() => {
  refresh();
});

async function refresh() {
  loading.value = true;
  error.value = '';
  try {
    reports.value = await reportService.listReports();
  } catch (err) {
    error.value = String(err);
  } finally {
    loading.value = false;
  }
}

function addReport() {
  showAddModal.value = true;
}

function onAddModalClose() {
  showAddModal.value = false;
}

async function onImported() {
  showAddModal.value = false;
  await refresh();
}

function clearAll() {
  if (reports.value.length === 0) return;
  showClearModal.value = true;
}

function onClearModalClose() {
  showClearModal.value = false;
}

async function onClearConfirmed() {
  showClearModal.value = false;
  try {
    await reportService.clearAllReports();
    await refresh();
  } catch (err) {
    error.value = String(err);
  }
}

async function remove(report: ReportSummary) {
  const confirmed = window.confirm(`Delete "${report.name}" and all of its rows?`);
  if (!confirmed) return;
  try {
    await reportService.deleteReport(report.id);
    await refresh();
  } catch (err) {
    error.value = String(err);
  }
}

function viewReport(id: number) {
  router.push(`/reports/${id}`);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
</script>
