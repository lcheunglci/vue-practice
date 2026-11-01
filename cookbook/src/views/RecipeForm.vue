<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { api, type RecipePayload, type Tag } from '../composables/api';

const router = useRouter();
const route = useRoute();
const isNew = computed(() => router.currentRoute.value.params.id === undefined);

const form = ref<RecipePayload>({
  title: '',
  description: '',
  ingredients: [],
  instructions: '',
  prepTime: null,
  cookTime: null,
  servings: null,
});

// If editing, set initial form values
if (!isNew) {
  const route = useRoute();
  const recipeId = Number(route.params.id);
  api.recipes.get(recipeId).then(r => {
    form.value = {
      title: r.title,
      description: r.description || '',
      ingredients: r.ingredients || [],
      instructions: r.instructions,
      prepTime: r.prepTime || null,
      cookTime: r.cookTime || null,
      servings: r.servings || null,
    };
  });
}

const tags = ref<Tag[]>([]);
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
    await api.recipes.create(form.value);
    router.push('/recipes');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadTags();
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
        <v-form @submit.prevent="submit" :loading="loading" v-if="form && form.value">
          <v-text-field v-model="form.value.title" label="Recipe Title" required />
          <v-textarea v-model="form.value.description" label="Description" rows="3" variant="outlined" />
          
          <v-select 
            v-model="form.value.ingredients" 
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
            v-model="form.value.instructions" 
            label="Instructions" 
            required 
            rows="5" 
            variant="outlined"
          />
          
          <v-row class="g-2">
            <v-col cols="4" class="d-flex">
              <v-text-field 
                v-model="form.value.prepTime" 
                label="Prep Time (minutes)" 
                type="number" 
                variant="outlined"
              />
            </v-col>
            <v-col cols="4" class="d-flex">
              <v-text-field 
                v-model="form.value.cookTime" 
                label="Cook Time (minutes)" 
                type="number" 
                variant="outlined"
              />
            </v-col>
            <v-col cols="4" class="d-flex">
              <v-text-field 
                v-model="form.value.servings" 
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