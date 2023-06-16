<script setup lang="ts">
import { ref } from 'vue'
import VirtualList from './components/VirtualList.vue'

const list = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i + 1 })))
</script>

<template>
  <VirtualList :data-source="list" :buffer-scale="1">
    <template #default="{ item }">
      <span>{{ item.id }}</span>
    </template>
  </VirtualList>
</template>

<style scoped>

</style>
