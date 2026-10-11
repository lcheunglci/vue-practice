<script setup lang="ts">
import ReminderView from './reminder-view.vue'
import BudgetView from './budget-view.vue'
import 'vuetify/styles'

</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>CC Reminder & Budget App</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="mt-6">
        <ReminderView />
        <BudgetView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Add any custom styles here */
</style>
