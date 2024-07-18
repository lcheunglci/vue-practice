<template>
  <div>
    <h1>{{ part.title }}</h1>
    <div>
      {{ part.description }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {usePartsStore} from '../stores/partsStore';

const partsStore = usePartsStore();

const props = definedProps(['partType', 'id']);

const part = computed(() => {
  return partsStore.parts[props.partType].find((part) => part.id === +props.id);
});
</script>
