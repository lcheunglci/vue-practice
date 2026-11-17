<template>
  <v-dialog v-model="modelValue" max-width="420" class="confirm-dialog">
    <v-card>
      <v-card-title>Delete report</v-card-title>
      <v-card-text>
        Delete <strong>{{ reportName }}</strong> and all its rows? This cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="error" variant="outlined" @click="confirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  reportName: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const modelValue = computed({
  get: () => props.modelValue ?? false,
  set: (v) => emit('update:modelValue', v)
})

function close() {
  modelValue.value = false
}

function confirm() {
  emit('confirm')
  close()
}
</script>