<template>
  <div v-if="loading" class="d-flex justify-content-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading…</span>
    </div>
  </div>
  <div v-else-if="error" class="mb-3">
    <div class="alert alert-danger" role="alert">{{ error }}</div>
    <button class="btn btn-outline-secondary" @click="goBack">Back</button>
  </div>
  <div v-else-if="report">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <div v-if="editingName" class="input-group mb-1" style="max-width: 480px">
          <input
            type="text"
            class="form-control"
            v-model="nameDraft"
            @keydown.enter="saveName"
            @keydown.esc="editingName = false"
          />
          <button class="btn btn-success" @click="saveName" :disabled="savingName">
            Save
          </button>
          <button class="btn btn-outline-secondary" @click="editingName = false">Cancel</button>
        </div>
        <div v-else>
          <h1 class="h3 mb-0">{{ report.name }}</h1>
        </div>
        <p class="text-muted mb-0">
          {{ report.sourceFile }} · {{ report.rows.length }} rows · imported
          {{ formatDate(report.importedAt) }}
        </p>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary me-2" @click="toggleEditMode">
          {{ editMode ? 'Done editing' : 'Edit rows' }}
        </button>
        <button class="btn btn-sm btn-outline-secondary me-2" @click="startEditingName">
          Rename
        </button>
        <button class="btn btn-sm btn-outline-danger" @click="deleteReport" :disabled="deleting">
          {{ deleting ? 'Deleting…' : 'Delete report' }}
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" v-for="column in sortableColumns" :key="column.key">
              <button
                type="button"
                class="th-sort"
                @click="onSort(column.key)"
                :aria-sort="
                  sortColumn && sortColumn === column.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                "
              >
                {{ column.label }}
                <span v-if="sortColumn === column.key">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </th>
            <th scope="col" class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in displayedRows" :key="row.id">
            <td>{{ idx + 1 }}</td>
            <template v-if="editMode">
              <td>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  :name="'date-' + row.id"
                  v-model="drafts[row.id]!.date"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  :name="'orderId-' + row.id"
                  v-model="drafts[row.id]!.orderId"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  :name="'description-' + row.id"
                  v-model="drafts[row.id]!.description"
                />
              </td>
              <td class="text-end">
                <input
                  type="number"
                  step="0.01"
                  class="form-control form-control-sm text-end"
                  :name="'cost-' + row.id"
                  v-model="drafts[row.id]!.cost"
                />
              </td>
            </template>
            <template v-else>
              <td>{{ row.date }}</td>
              <td>{{ row.orderId }}</td>
              <td>{{ row.description }}</td>
              <td class="text-end">{{ formatCurrency(row.cost) }}</td>
            </template>
            <td class="text-end">
              <template v-if="editMode">
                <button
                  class="btn btn-sm btn-success me-1"
                  @click="saveRow(row)"
                  :disabled="!isDirty(row) || savingRowId === row.id"
                >
                  {{ savingRowId === row.id ? 'Saving…' : 'Save' }}
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="cancelRow(row)">
                  Cancel
                </button>
                <div v-if="rowErrors[row.id]" class="text-danger small mt-1">
                  {{ rowErrors[row.id] }}
                </div>
              </template>
              <template v-else>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="copyRow(row)"
                  title="Copy row as CSV"
                >
                  {{ copiedId === row.id ? 'Copied!' : 'Copy' }}
                </button>
              </template>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="displayedRows.length > 0">
          <tr>
            <td colspan="5" class="text-end fw-bold">Total</td>
            <td class="text-end fw-bold">{{ formatCurrency(totalCost) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <button class="btn btn-outline-secondary" @click="goBack">Back</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ReportDetail, ReportRow, ReportRowUpdate } from '@/electron.d';
import { reportService } from '@/services/reportService';

const route = useRoute();
const router = useRouter();

const report = ref<ReportDetail | null>(null);
const loading = ref(false);
const error = ref('');
const editingName = ref(false);
const nameDraft = ref('');
const savingName = ref(false);
const deleting = ref(false);
const sortColumn = ref<keyof ReportRow>('date');
const sortDirection = ref<'asc' | 'desc'>('asc');
const copiedId = ref<number | null>(null);
const editMode = ref(false);
const drafts = ref<Record<number, ReportRowUpdate>>({});
const rowErrors = ref<Record<number, string>>({});
const savingRowId = ref<number | null>(null);

const sortableColumns: Array<{ key: keyof ReportRow; label: string }> = [
  { key: 'date', label: 'Date' },
  { key: 'orderId', label: 'Order ID' },
  { key: 'description', label: 'Description' },
  { key: 'cost', label: 'Cost' }
];

onMounted(() => {
  load();
});

async function load() {
  const id = Number(route.params.id);
  loading.value = true;
  error.value = '';
  try {
    report.value = await reportService.getReport(id);
    if (!report.value) {
      throw new Error(`Report ${id} not found`);
    }
  } catch (err) {
    error.value = String(err);
  } finally {
    loading.value = false;
  }
}

function startEditingName() {
  nameDraft.value = report.value?.name ?? '';
  editingName.value = true;
}

async function saveName() {
  if (!report.value || !nameDraft.value.trim()) return;
  savingName.value = true;
  try {
    report.value = await reportService.renameReport(report.value.id, nameDraft.value);
    editingName.value = false;
  } catch (err) {
    error.value = String(err);
  } finally {
    savingName.value = false;
  }
}

async function deleteReport() {
  if (!report.value) return;
  const confirmed = window.confirm(`Delete "${report.value.name}" and all of its rows?`);
  if (!confirmed) return;
  deleting.value = true;
  try {
    await reportService.deleteReport(report.value.id);
    await router.push('/reports');
  } catch (err) {
    error.value = String(err);
  } finally {
    deleting.value = false;
  }
}

const totalCost = computed(() => {
  return report.value?.rows.reduce((sum, row) => sum + (row.cost || 0), 0) ?? 0;
});

function onSort(column: keyof ReportRow) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
}

const displayedRows = computed(() => {
  const source = report.value?.rows ?? [];
  const direction = sortDirection.value === 'asc' ? 1 : -1;
  return [...source].sort((a, b) => {
    const left = a[sortColumn.value];
    const right = b[sortColumn.value];
    if (sortColumn.value === 'date' || sortColumn.value === 'description') {
      return String(left).localeCompare(String(right)) * direction;
    }
    return (Number(left) - Number(right)) * direction;
  });
});

async function copyRow(row: ReportRow) {
  const csv = [
    csvField(row.date),
    csvField(row.orderId),
    csvField(row.description),
    csvField(row.cost)
  ].join(',');

  try {
    await navigator.clipboard.writeText(csv);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = csv;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  copiedId.value = row.id;
  setTimeout(() => {
    if (copiedId.value === row.id) {
      copiedId.value = null;
    }
  }, 1500);
}

function csvField(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toggleEditMode() {
  drafts.value = {};
  rowErrors.value = {};
  if (editMode.value) {
    editMode.value = false;
    return;
  }
  editMode.value = true;
  for (const row of report.value?.rows ?? []) {
    drafts.value[row.id] = toDraft(row);
  }
}

function isDirty(row: ReportRow): boolean {
  const draft = drafts.value[row.id];
  if (!draft) return false;
  const original = toDraft(row);
  return (
    draft.date !== original.date ||
    Number(draft.orderId) !== Number(original.orderId) ||
    draft.description !== original.description ||
    Number(draft.cost) !== Number(original.cost)
  );
}

async function saveRow(row: ReportRow) {
  const draft = drafts.value[row.id];
  if (!draft) return;

  const error = validateDraft(draft);
  if (error) {
    rowErrors.value[row.id] = error;
    return;
  }

  savingRowId.value = row.id;
  try {
    const updated = await reportService.updateRow(row.id, {
      date: draft.date.trim(),
      orderId: Number(draft.orderId),
      description: draft.description,
      cost: Number(draft.cost)
    });
    if (updated && report.value) {
      const index = report.value.rows.findIndex((r) => r.id === row.id);
      if (index > -1) {
        report.value.rows[index] = updated;
      }
      drafts.value[row.id] = toDraft(updated);
    }
    rowErrors.value[row.id] = '';
  } catch (err) {
    rowErrors.value[row.id] = String(err);
  } finally {
    savingRowId.value = null;
  }
}

function cancelRow(row: ReportRow) {
  drafts.value[row.id] = toDraft(row);
  rowErrors.value[row.id] = '';
}

function toDraft(row: ReportRow): ReportRowUpdate {
  return {
    date: row.date,
    orderId: row.orderId,
    description: row.description,
    cost: row.cost
  };
}

function validateDraft(draft: ReportRowUpdate): string {
  if (!draft.date.trim()) {
    return 'Date is required';
  }
  const orderId = Number(draft.orderId);
  if (String(draft.orderId).trim() === '' || !Number.isInteger(orderId)) {
    return 'Order ID must be a whole number';
  }
  const cost = Number(draft.cost);
  if (String(draft.cost).trim() === '' || !Number.isFinite(cost)) {
    return 'Cost must be a number';
  }
  return '';
}

function goBack() {
  router.back();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(
      value || 0
    );
  } catch {
    return String(value || 0);
  }
}
</script>
