<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../composables/api';

const tags = ref<{ id: number; name: string }[]>([]);
const loading = ref(false);

async function loadTags() {
  loading.value = true;
  try {
    tags.value = await api.tags.list();
  } finally {
    loading.value = false;
  }
}

function deleteTag(id: number) {
  if (!confirm('Delete this tag? Recipes using it will lose this tag.')) return;
  api.tags.delete(id).then(() => {
    tags.value = tags.value.filter(t => t.id !== id);
  });
}

function editTag(tag: { id: number; name: string }) {
  const newName = prompt('Rename tag:', tag.name);
  if (!newName || newName === tag.name) return;
  api.tags.update(tag.id, newName).then(() => {
    tag.name = newName;
  });
}

onMounted(loadTags);
</script>

<template>
  <v-container class="py-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-btn to="/tags/new" color="primary">Add Tag</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="loading" cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
      <v-col v-for="tag in tags" :key="tag.id" cols="12" md="6" lg="4">
        <v-card class="d-flex justify-space-between align-center p-4" style="padding-left: 12px;">
          <span style="flex-grow: 1;">{{ tag.name }}</span>
          <div class="d-flex align-center gap-2">
            <v-btn color="primary" variant="outlined" size="small" @click="editTag(tag)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" variant="outlined" size="small" @click="deleteTag(tag.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>