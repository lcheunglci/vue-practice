<template>
  <div>
    <div class="header">
      <span v-if="open" @click="open = !open">&#x25B2; Collapse</span>
      <span v-if="!open" @click="open =!open">&#x25BC; Expand</span>
      <slot v-if="open">

      </slot>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const open = ref(true);
</script>

<style scoped>
.header {
  background-color: #bbb;
  padding: 3px;
  cursor: pointer;
  font-size: 22px;
}
</style>