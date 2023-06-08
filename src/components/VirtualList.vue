<script setup lang="ts">
import { computed, defineProps, onMounted, ref, withDefaults } from 'vue'

const props = withDefaults(defineProps<{ list: number[]; itemHeight: number }>(), {
  list: () => [],
  itemHeight: 100,
})

const container = ref<HTMLDivElement>()
const screenHeight = ref(0)
const startOffset = ref(0)
const startIndex = ref(0)
const endIndex = ref(0)

const listHeight = computed(() => props.list.length * props.itemHeight)
const visibleCount = computed(() => Math.ceil(screenHeight.value / props.itemHeight))
const getTransform = computed(() => `translate3d(0, ${startOffset.value}px, 0)`)
const visibleData = computed(() => props.list.slice(startIndex.value, Math.min(endIndex.value, props.list.length)))

onMounted(() => {
  screenHeight.value = container.value!.clientHeight
  endIndex.value = startIndex.value + visibleCount.value
})

function scroll() {
  const scrollTop = container.value!.scrollTop
  startIndex.value = Math.floor(scrollTop / props.itemHeight)
  endIndex.value = startIndex.value + visibleCount.value
  startOffset.value = scrollTop - (scrollTop % props.itemHeight)
}
</script>

<template>
  <div ref="container" class="infinite-list-container" @scroll="scroll">
    <div class="infinite-list-phantom" :style="{ height: `${listHeight}px` }" />
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div v-for="item in visibleData" :key="item" class="infinite-list-item" :style="{ lineHeight: `${props.itemHeight}px` }">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
