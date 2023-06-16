<script setup lang="ts">
import { ref } from 'vue'

const list = ref(Array.from({ length: 100 }, (_, i) => ({ id: i + 1, value: `数据${i + 1}` })))
</script>

<template>
  <VirtualScrollList v-slot="{ item }" :data-source="list">
    <span>{{ item.value }}</span>
  </VirtualScrollList>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
}
#app {
  height: 100%;
}
</style>
