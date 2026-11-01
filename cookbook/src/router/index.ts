import { createRouter, createWebHistory } from 'vue-router';
import RecipeList from '../views/RecipeList.vue';
import RecipeForm from '../views/RecipeForm.vue';
import RecipeDetail from '../views/RecipeDetail.vue';
import TagList from '../views/TagList.vue';
import TagForm from '../views/TagForm.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'home',
      component: RecipeList,
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipeList,
    },
    {
      path: '/recipes/new',
      name: 'new-recipe',
      component: RecipeForm,
    },
    {
      path: '/recipes/:id',
      name: 'recipe',
      component: RecipeDetail,
    },
    {
      path: '/tags',
      name: 'tags',
      component: TagList,
    },
    {
      path: '/tags/new',
      name: 'tag',
      component: TagForm,
    },
  ],
});

export default router;