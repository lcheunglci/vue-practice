<template>
  <v-container fluid style="margin-top: 50px">
    <v-progress-circular v-if="loading" indeterminate color="primary" class="my-5" />

    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-alert v-else-if="!report" type="error" variant="tonal" class="mb-4">
      Report not found.
    </v-alert>

    <template v-else>
      <v-row class="mb-4" align="start" justify="space-between">
        <v-col>
          <template v-if="editingName">
            <div style="max-width: 480px">
              <v-text-field
                v-model="nameDraft"
                prepend-inner-icon="mdi-content-edit"
                density="compact"
                @keydown.enter="saveName"
              />
              <v-row>
                <v-col cols="auto">
                  <v-btn color="success" @click="saveName" :disabled="savingName">Save</v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn variant="text" @click="editingName = false">Cancel</v-btn>
                </v-col>
              </v-row>
            </div>
          </template>
          <template v-else>
            <h1 class="text-h3 mb-1">{{ report.name }}</h1>
          </template>
          <p class="text-caption text-grey-6">
            {{ report.sourceFile }} · {{ report.rows.length }} rows · imported
            {{ formatDate(report.importedAt) }}
          </p>
        </v-col>
        <v-col cols="auto">
          <v-btn variant="text" class="mr-2" @click="toggleEditMode">
            {{ editMode ? 'Done editing' : 'Edit rows' }}
          </v-btn>
          <v-btn variant="text" class="mr-2" @click="startEditingName">Rename</v-btn>
          <v-btn color="error" variant="outlined" @click="deleteReport" :loading="deleting">
            {{ deleting ? 'Deleting…' : 'Delete report' }}
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="report.rows"
        :sort-by="[{ key: sortColumn, order: sortDirection }]"
        class="elevation-1"
        disable-sort
        disable-filtering
      >
        <template #item="{ item: row, index, props }">
          <tr v-bind="props">
            <td>{{ index + 1 }}</td>
            <template v-if="editMode">
              <td><v-text-field v-model="drafts[row.id]!.date" variant="solo" density="compact" hide-details /></td>
              <td><v-text-field v-model="drafts[row.id]!.orderId" variant="solo" density="compact" hide-details /></td>
              <td><v-text-field v-model="drafts[row.id]!.description" variant="solo" density="compact" hide-details /></td>
              <td><v-text-field v-model="drafts[row.id]!.cost" variant="solo" density="compact" hide-details /></td>
            </template>
            <template v-else>
              <td>{{ row.date }}</td>
              <td>{{ row.orderId }}</td>
              <td>{{ row.description }}</td>
              <td>{{ formatCurrency(row.cost) }}</td>
            </template>
            <td class="text-end">
              <template v-if="editMode">
                <v-btn size="small" color="success" class="mr-1" :disabled="!isDirty(row) || savingRowId === row.id" @click="saveRow(row)">
                  {{ savingRowId === row.id ? 'Saving…' : 'Save' }}
                </v-btn>
                <v-btn size="small" variant="text" @click="cancelRow(row)">Cancel</v-btn>
                <v-chip v-if="rowErrors[row.id]" size="x-small" color="error">{{ rowErrors[row.id] }}</v-chip>
              </template>
              <template v-else>
                <v-btn size="small" variant="text" @click="copyRow(row)" :title="copyTitle(row.id)">
                  {{ copiedId === row.id ? 'Copied!' : 'Copy' }}
                </v-btn>
              </template>
            </td>
          </tr>
        </template>

      </v-data-table>

      <v-row v-if="report.rows.length > 0" class="mt-2 justify-end align-center" style="gap: 8px">
        <div class="text-end font-weight-bold">Total {{ formatCurrency(totalCost) }}</div>
      </v-row>

      <v-spacer class="my-4"></v-spacer>
      <v-btn variant="text" @click="goBack">Back</v-btn>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reportService } from '@/services/reportService'
import type { ReportDetail, ReportRow, ReportRowUpdate } from '@/electron.d'

const route = useRoute()
const router = useRouter()

const report = ref<ReportDetail | null>(null)
const loading = ref(false)
const error = ref('')
const editingName = ref(false)
const nameDraft = ref('')
const savingName = ref(false)
const deleting = ref(false)
const sortColumn = ref<keyof ReportRow>('date')
const sortDirection = ref<'asc' | 'desc'>('asc')
const copiedId = ref<number | null>(null)
const editMode = ref(false)
const drafts = ref<Record<number, ReportRowUpdate>>({})
const rowErrors = ref<Record<number, string>>({})
const savingRowId = ref<number | null>(null)

const headers = [
  { title: '#', key: '#', sortable: false },
  { title: 'Date', key: 'date', sortable: false },
  { title: 'Order ID', key: 'orderId', sortable: false },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Cost', key: 'cost', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]

onMounted(() => {
  load()
})

async function load() {
  const id = Number(route.params.id)
  loading.value = true
  error.value = ''
  try {
    report.value = await reportService.getReport(id)
    if (!report.value) {
      throw new Error(`Report ${id} not found`)
    }
  } catch (err) {
    error.value = String(err)
  } finally {
    loading.value = false
  }
}

function startEditingName() {
  nameDraft.value = report.value?.name ?? ''
  editingName.value = true
}

async function saveName() {
  if (!report.value || !nameDraft.value.trim()) return
  savingName.value = true
  try {
    report.value = await reportService.renameReport(report.value.id, nameDraft.value)
    editingName.value = false
  } catch (err) {
    error.value = String(err)
  } finally {
    savingName.value = false
  }
}

async function deleteReport() {
  if (!report.value) return
  const confirmed = window.confirm(`Delete "${report.value.name}" and all of its rows?`)
  if (!confirmed) return
  deleting.value = true
  try {
    await reportService.deleteReport(report.value.id)
    router.push('/reports')
  } catch (err) {
    error.value = String(err)
  } finally {
    deleting.value = false
  }
}

const totalCost = computed(() => {
  return report.value?.rows.reduce((sum, row) => sum + (row.cost || 0), 0) ?? 0
})

function toggleEditMode() {
  drafts.value = {}
  Object.keys(rowErrors.value).forEach(key => delete rowErrors.value[Number(key)])
  if (editMode.value) {
    editMode.value = false
    return
  }
  editMode.value = true
  for (const row of report.value?.rows ?? []) {
    drafts.value[row.id] = toDraft(row)
  }
}

function isDirty(row: ReportRow): boolean {
  const draft = drafts.value[row.id]
  if (!draft) return false
  const original = toDraft(row)
  return (
    draft.date !== original.date ||
    Number(draft.orderId) !== Number(original.orderId) ||
    draft.description !== original.description ||
    Number(draft.cost) !== Number(original.cost)
  )
}

async function saveRow(row: ReportRow) {
  const draft = drafts.value[row.id]
  if (!draft) return

  const error = validateDraft(draft)
  if (error) {
    rowErrors.value[row.id] = error
    return
  }

  savingRowId.value = row.id
  try {
    const updated = await reportService.updateRow(row.id, {
      date: draft.date.trim(),
      orderId: Number(draft.orderId),
      description: draft.description,
      cost: Number(draft.cost)
    })
    if (updated && report.value) {
      const index = report.value.rows.findIndex((r) => r.id === row.id)
      if (index > -1) {
        report.value.rows[index] = updated
      }
      drafts.value[row.id] = toDraft(updated)
    }
    delete rowErrors.value[row.id]
  } catch (err) {
    rowErrors.value[row.id] = String(err)
  } finally {
    savingRowId.value = null
  }
}

function cancelRow(row: ReportRow) {
  drafts.value[row.id] = toDraft(row)
  delete rowErrors.value[row.id]
}

function toDraft(row: ReportRow): ReportRowUpdate {
  return {
    date: row.date,
    orderId: row.orderId,
    description: row.description,
    cost: row.cost
  }
}

function validateDraft(draft: ReportRowUpdate): string {
  if (!draft.date.trim()) {
    return 'Date is required'
  }
  const orderId = Number(draft.orderId)
  if (String(draft.orderId).trim() === '' || !Number.isInteger(orderId)) {
    return 'Order ID must be a whole number'
  }
  const cost = Number(draft.cost)
  if (String(draft.cost).trim() === '' || !Number.isFinite(cost)) {
    return 'Cost must be a number'
  }
  return ''
}

async function copyRow(row: ReportRow) {
  const csv = [
    csvField(row.date),
    csvField(row.orderId),
    csvField(row.description),
    csvField(row.cost)
  ].join(',')

  try {
    await navigator.clipboard.writeText(csv)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = csv
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  copiedId.value = row.id
  setTimeout(() => {
    if (copiedId.value === row.id) {
      copiedId.value = null
    }
  }, 1500)
}

function copyTitle(rowId: number) {
  return copiedId.value === rowId ? 'Copied!' : 'Copy row as CSV'
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value || 0)
  } catch {
    return String(value || 0)
  }
}

function csvField(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function goBack() {
  router.back()
}
</script>
