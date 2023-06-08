<script setup lang="ts">
import { ref } from 'vue'
import VirtualList from './components/VirtualList.vue'

const list = ref(Array.from({ length: 10000 }, (_, i) => i + 1))
</script>

<template>
  <VirtualList :list="list" />
</template>

<style scoped>

</style>
