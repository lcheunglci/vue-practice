<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, type Recipe } from '../composables/api';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const recipe = ref<Recipe | null>(null);
const loading = ref(false);

async function loadRecipe() {
  loading.value = true;
  try {
    recipe.value = await api.recipes.get(Number(route.params.id));
  } finally {
    loading.value = false;
  }
}

const showDeleteDialog = ref(false);
const { showToast } = useToast();

function deleteRecipe() {
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  showDeleteDialog.value = false;
  try {
    await api.recipes.delete(Number(route.params.id));
    router.push('/recipes');
    showToast('Recipe deleted successfully', 'success');
  } catch (e) {
    showToast('Error deleting recipe', 'error');
  }
}

onMounted(loadRecipe);
watch(() => route.params.id, loadRecipe);
</script>

<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="8" class="float-right">
        <v-btn to="/recipes" variant="outlined" class="mb-4">Back to Recipes</v-btn>
        <v-btn color="error" variant="text" class="mx-2" @click="deleteRecipe">Delete</v-btn>
        <v-btn color="primary" :to="`/recipes/edit/${route.params.id}`" variant="text">Edit</v-btn>
      </v-col>
    </v-row>

    <v-row v-if="!loading && recipe" class="mb-6">
      <v-col cols="12">
        <h1 class="headline mb-2">{{ recipe.title }}</h1>
        <p v-if="recipe.description" class="text-body-2 mb-4">{{ recipe.description }}</p>
        
        <v-card class="mb-4">
          <v-card-title>Ingredients</v-card-title>
          <v-card-text>
            <ul>
              <li v-for="ing in recipe.ingredients || []" :key="ing">{{ ing }}</li>
            </ul>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Instructions</v-card-title>
          <v-card-text>
            <div v-html="recipe.instructions"></div>
          </v-card-text>
        </v-card>

        <v-row class="mt-4">
          <v-col cols="3">
            <div class="text-body-2">Prep Time</div>
            <div class="text-h6">{{ recipe.prepTime }} min</div>
          </v-col>
          <v-col cols="3">
            <div class="text-body-2">Cook Time</div>
            <div class="text-h6">{{ recipe.cookTime }} min</div>
          </v-col>
          <v-col cols="3">
            <div class="text-body-2">Servings</div>
            <div class="text-h6">{{ recipe.servings }}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
<v-dialog v-model="showDeleteDialog" max-width="400" class="mx-4">
  <v-card>
    <v-card-title>Delete Recipe</v-card-title>
    <v-card-text>Are you sure you want to delete this recipe? This action cannot be undone.</v-card-text>
    <v-card-actions>
      <v-btn variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
      <v-btn color="error" @click="confirmDelete">Delete</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>