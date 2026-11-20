<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="about">
    <h1>About Stock Tracker</h1>
    <p>This app allows you to track product availability and prices across your favorite e-commerce stores.</p>
    <ul>
      <li>Add products with URLs and target prices</li>
      <li>Track in-stock status and discounts</li>
      <li>Persisted locally via localStorage</li>
      <li>Refresh prices manually or on app start</li>
    </ul>
  </div>
</template>