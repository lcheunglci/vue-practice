<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { api, type RecipePayload, type Tag } from '../composables/api';

const router = useRouter();
const route = useRoute();
const isNew = computed(() => router.currentRoute.value.params.id === undefined);

const form = reactive<RecipePayload>({
  title: '',
  description: '',
  ingredients: [],
  instructions: '',
  prepTime: null,
  cookTime: null,
  servings: null,
});

const tags = ref<Tag[]>([]);
const selectedTags = ref<number[]>([]);
const loading = ref(false);

async function loadTags() {
  loading.value = true;
  try {
    tags.value = await api.tags.list();
  } finally {
    loading.value = false;
  }
}

async function submit() {
  loading.value = true;
  try {
    const payload = {
      ...form,
      ingredients: typeof form.ingredients === 'string' ? form.ingredients.split(/\n|,/).filter(Boolean) : form.ingredients,
      tags: selectedTags.value,
    };
    if (isNew.value) {
      await api.recipes.create(payload);
    } else {
      const id = Number(route.params.id);
      await api.recipes.update(id, payload);
    }
    router.push('/recipes');
  } finally {
    loading.value = false;
  }
}

watch(() => isNew.value, (newVal) => {
  if (newVal) {
    form.title = '';
    form.description = '';
    form.ingredients = '';
    form.instructions = '';
    form.prepTime = null;
    form.cookTime = null;
    form.servings = null;
  }
});

watch(() => route.params.id, async (newId) => {
  if (!isNew.value && newId) {
    try {
      const r = await api.recipes.get(Number(newId));
      form.title = r.title || '';
      form.description = r.description || '';
      form.ingredients = Array.isArray(r.ingredients) ? r.ingredients.join('\n') : (r.ingredients || '');
      form.instructions = r.instructions || '';
      form.prepTime = r.prepTime !== null ? r.prepTime : null;
      form.cookTime = r.cookTime !== null ? r.cookTime : null;
      form.servings = r.servings !== null ? r.servings : null;
    } catch (e) {
      console.error('Failed to load recipe', e);
    }
  }
});

onMounted(async () => {
  await loadTags();
  if (!isNew.value) {
    try {
      const r = await api.recipes.get(Number(route.params.id));
      form.title = r.title || '';
      form.description = r.description || '';
      form.ingredients = Array.isArray(r.ingredients) ? r.ingredients.join('\n') : (r.ingredients || '');
      form.instructions = r.instructions || '';
      form.prepTime = r.prepTime !== null ? r.prepTime : null;
      form.cookTime = r.cookTime !== null ? r.cookTime : null;
      form.servings = r.servings !== null ? r.servings : null;
    } catch (e) {
      console.error('Failed to load recipe', e);
    }
  }
});
</script>

<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="6">
        <v-btn to="/recipes" variant="text">Back to Recipes</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <v-form @submit.prevent="submit" :loading="loading">
          <v-text-field v-model="form.title" label="Recipe Title" required />
          <v-textarea v-model="form.description" label="Description" rows="3" variant="outlined" />
          
          <v-textarea v-model="form.ingredients" label="Ingredients (one per line or comma separated)" rows="3" variant="outlined" />
          <v-select
            v-model="selectedTags"
            :items="tags"
            item-title="name"
            item-value="id"
            label="Tags (select categories)"
            multiple
            chips
            clearable
            variant="outlined"
          />
          
          <v-text-field 
            v-model="form.instructions" 
            label="Instructions" 
            required 
            rows="5" 
            variant="outlined"
          />
          
          <v-row class="g-2">
            <v-col cols="4" class="d-flex">
              <v-text-field 
                v-model="form.prepTime" 
                label="Prep Time (minutes)" 
                type="number" 
                variant="outlined"
              />
            </v-col>
            <v-col cols="4" class="d-flex">
              <v-text-field 
                v-model="form.cookTime" 
                label="Cook Time (minutes)" 
                type="number" 
                variant="outlined"
              />
            </v-col>
            <v-col cols="4" class="d-flex">
              <v-text-field 
                v-model="form.servings" 
                label="Servings" 
                type="number" 
                variant="outlined"
              />
            </v-col>
          </v-row>
          
          <v-btn 
            type="submit" 
            color="primary" 
            class="mt-4" 
            :loading="loading" 
          >
            {{ isNew ? 'Save Recipe' : 'Update Recipe' }}
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>