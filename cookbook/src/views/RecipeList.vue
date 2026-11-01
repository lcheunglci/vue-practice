<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../composables/api';

const recipes = ref<{ id: number; title: string; description: string | null; ingredients: string[]; instructions: string; prepTime: number | null; cookTime: number | null; servings: number | null; tags: number[] }[]>([]);
const tags = ref<{ id: number; name: string }[]>([]);
const search = ref('');
const selectedTags = ref<number[]>([]);
const ingredientFilter = ref('');
const loading = ref(false);
const router = useRouter();

async function loadTags() {
  try {
    tags.value = await api.tags.list();
  } catch (e) {
    console.error(e);
  }
}

async function loadRecipes() {
  loading.value = true;
  try {
    recipes.value = await api.recipes.list({
      tagIds: selectedTags.value,
      ingredient: ingredientFilter.value,
      search: search.value,
    });
    // Normalize tags to display in card
    for (const recipe of recipes.value) {
      recipe._displayTags = (recipe.tags || []).map((tid: number) => tags.value.find(t => t.id === tid)?.name || '').filter(Boolean) || [];
    }
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadTags();
  await loadRecipes();
});

function formatIngredients(ingredients: string[]): string {
  return ingredients.join(', ');
}
</script>

<template>
  <v-container class="py-6">
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search recipes"
          prepend-icon="mdi-magnify"
          variant="outlined"
          clearable
          @update:model-value="loadRecipes"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedTags"
          :items="tags"
          item-title="name"
          item-value="id"
          label="Filter by tag"
          multiple
          chips
          clearable
          variant="outlined"
          @update:model-value="loadRecipes"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="ingredientFilter"
          label="Ingredient contains"
          prepend-icon="mdi-carrot"
          variant="outlined"
          clearable
          @update:model-value="loadRecipes"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="loading" cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
      <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" sm="6" md="4">
        <v-card elevation="2" class="h-100" @click="() => router.push(`/recipes/${recipe.id}`)" style="cursor: pointer;">
          <v-card-title>{{ recipe.title }}</v-card-title>
          <v-card-subtitle class="text-caption">{{ formatIngredients(recipe.ingredients || []) }}</v-card-subtitle>
          <v-card-text>
            <p v-if="recipe.description" class="text-body-2">{{ recipe.description }}</p>
            <div class="d-flex gap-2 mt-2 flex-wrap">
              <v-chip
                v-for="tagName in recipe._displayTags"
                :key="tagName"
                size="small"
                variant="outlined"
                color="primary"
              >
                {{ tagName }}
              </v-chip>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="text" :to="`/recipes/${recipe.id}`">View</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>