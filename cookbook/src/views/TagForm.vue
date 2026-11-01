<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../composables/api';

const router = useRouter();
const name = ref('');
const loading = ref(false);

async function submit() {
  loading.value = true;
  try {
    await api.tags.create(name.value);
    router.push('/tags');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="4" class="float-right">
        <v-form @submit.prevent="submit" :loading="loading">
          <v-text-field v-model="name" label="Tag Name" required variant="outlined" />
          <v-btn type="submit" color="primary" class="mt-4" :loading="loading">
            Add Tag
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>