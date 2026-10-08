<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Clear all reports</h4>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" role="alert">
            <strong>Warning — this cannot be undone.</strong>
            You are about to permanently delete all
            <strong>{{ reportCount }}</strong> report{{ reportCount === 1 ? '' : 's' }}
            and every associated row from the local database. There is no undo.
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="approve-irreversible"
              v-model="agreed"
            />
            <label class="form-check-label" for="approve-irreversible">
              I understand this action is irreversible and permanently deletes the data
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="confirm" :disabled="!agreed">
            Delete all
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  reportCount: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirmed'): void;
}>();

const agreed = ref(false);

function confirm() {
  emit('confirmed');
}
</script>
