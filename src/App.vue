<script setup lang="ts">
import { ref } from 'vue'
import VirtualList from './components/VirtualList.vue'

const list = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i + 1 })))
</script>

<template>
  <VirtualList :dataSource="list" :bufferScale="1">
    <template v-slot="{item}">
      <span >{{ item.id }}</span>
    </template>
  </VirtualList>
</template>

<style scoped>

</style>
