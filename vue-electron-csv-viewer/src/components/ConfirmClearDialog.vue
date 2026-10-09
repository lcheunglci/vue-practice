<template>
  <v-dialog v-model="modelValue" max-width="500px">
    <v-card>
      <v-card-title>Clear all reports</v-card-title>

      <v-card-text>
        <v-alert type="error" variant="tonal" class="mb-4">
          <strong>Warning — this cannot be undone.</strong>
          You are about to permanently delete all
          <strong>{{ reportCount }}</strong> report{{ reportCount === 1 ? '' : 's' }}
          and every associated row from the local database. There is no undo.
        </v-alert>

        <v-form class="mt-4">
          <v-checkbox
            id="approve-irreversible"
            v-model="agreed"
            label="I understand this action is irreversible and permanently deletes the data"
            class="mb-4"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="error" @click="confirm" :disabled="!agreed">
          Delete all
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    reportCount: number
  }>(),
  {
    modelValue: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'confirmed'): void
}>()

const modelValue = computed({
  get: () => props.modelValue ?? false,
  set: (value: boolean) => emit('update:modelValue', value)
})

const agreed = ref(false)

const reportCount = computed(() => props.reportCount)

function close() {
  modelValue.value = false
  agreed.value = false
  emit('close')
}

function confirm() {
  emit('confirmed')
  close()
}
</script>