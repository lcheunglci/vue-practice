<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add report</h4>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

          <div class="mb-3">
            <label class="form-label">CSV file</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                readonly
                :value="selectedFile || 'No file selected'"
                placeholder="Pick a CSV file"
              />
              <button class="btn btn-outline-secondary" @click="pickFile" :disabled="picking">
                {{ picking ? 'Picking…' : 'Choose file' }}
              </button>
            </div>
            <div class="form-text">
              Expected columns: <code>date</code> (string), <code>orderId</code> (number),
              <code>description</code> (string), <code>cost</code> (number).
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="report-name">Custom name (optional)</label>
            <input
              id="report-name"
              type="text"
              class="form-control"
              v-model="name"
              placeholder="Defaults to the file name"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="importReport"
            :disabled="!selectedFile || importing"
          >
            {{ importing ? 'Importing…' : 'Import' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { reportService } from '@/services/reportService';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'imported', report: unknown): void;
}>();

const name = ref('');
const selectedFile = ref('');
const picking = ref(false);
const importing = ref(false);
const error = ref('');

async function pickFile() {
  picking.value = true;
  error.value = '';
  try {
    const result = await reportService.openCsvDialog();
    if (!result.canceled) {
      selectedFile.value = result.filePath;
    }
  } catch (err) {
    error.value = String(err);
  } finally {
    picking.value = false;
  }
}

async function importReport() {
  if (!selectedFile.value) return;
  importing.value = true;
  error.value = '';
  try {
    const report = await reportService.importReport(selectedFile.value, name.value);
    emit('imported', report);
  } catch (err) {
    error.value = String(err);
  } finally {
    importing.value = false;
  }
}
</script>
