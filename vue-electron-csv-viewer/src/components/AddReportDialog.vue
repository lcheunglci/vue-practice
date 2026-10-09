<template>
  <v-dialog v-model="modelValue" max-width="900px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Add report</span>
        <v-btn icon="mdi-close" variant="text" @click="close" size="small" />
      </v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

        <v-form>
          <v-text-field
            label="CSV file"
            v-model="selectedFile"
            readonly
            prepend-inner-icon="mdi-file-document"
            :placeholder="selectedFile ? selectedFile : 'No file selected'"
            class="mb-2"
          >
            <template #append>
              <v-btn icon="mdi-folder-open" variant="text" @click="pickFile" :loading="picking" />
            </template>
          </v-text-field>

          <v-text-field
            id="report-name"
            label="Custom name (optional)"
            v-model="name"
            placeholder="Defaults to the file name"
            class="mb-4"
          />
        </v-form>

        <div class="form-text">
          Expected columns: <code>date</code> (string), <code>orderId</code> (number),
          <code>description</code> (string), <code>cost</code> (number).
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="importReport" :loading="importing" :disabled="!selectedFile || importing">
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { reportService } from '@/services/reportService'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
  }>(),
  {
    modelValue: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'imported', report: unknown): void
}>()

const modelValue = computed({
  get: () => props.modelValue ?? false,
  set: (value: boolean) => emit('update:modelValue', value)
})

const name = ref('')
const selectedFile = ref('')
const picking = ref(false)
const importing = ref(false)
const error = ref('')

watch(
  () => modelValue.value,
  (open) => {
    if (open) {
      name.value = ''
      selectedFile.value = ''
      picking.value = false
      importing.value = false
      error.value = ''
    }
  }
)

function close() {
  modelValue.value = false
  emit('close')
}

async function pickFile() {
  picking.value = true
  error.value = ''
  try {
    const result = await reportService.openCsvDialog()
    if (!result.canceled) {
      selectedFile.value = result.filePath
    }
  } catch (err) {
    error.value = String(err)
  } finally {
    picking.value = false
  }
}

async function importReport() {
  if (!selectedFile.value) return
  importing.value = true
  error.value = ''
  try {
    const report = await reportService.importReport(selectedFile.value, name.value)
    emit('imported', report)
    close()
  } catch (err) {
    error.value = String(err)
  } finally {
    importing.value = false
  }
}
</script>