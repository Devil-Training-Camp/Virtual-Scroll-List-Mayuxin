<script setup lang="ts">
import { computed, defineProps, onMounted, ref, toRefs, withDefaults } from 'vue'

const props = withDefaults(defineProps<{ data: number[]; itemHeight?: number }>(), {
  data: () => [],
  itemHeight: 100,
})
const { data, itemHeight } = toRefs(props)

const containerRef = ref<HTMLDivElement>()
// 滚动容器的高度
const containerHeight = ref(0)
// 虚拟列表的偏移量
const startOffset = ref(0)
// 渲染数据的开始索引
const startIndex = ref(0)
// 渲染数据的结束索引
const endIndex = ref(0)

// 占位容器的高度
const placeholderHeight = computed(() => data.value.length * itemHeight.value)
// 滚动容器可视区域渲染的个数
const visibleCount = computed(() => Math.ceil(containerHeight.value / itemHeight.value) + 1)
// 通过translate对虚拟列表进行偏移
const getTransform = computed(() => `translate3d(0, ${startOffset.value}px, 0)`)
// 需要渲染的数据
const visibleData = computed(() => data.value.slice(startIndex.value, Math.min(endIndex.value, data.value.length)))

onMounted(() => {
  // 获取滚动容器的高度
  containerHeight.value = containerRef.value!.clientHeight
  endIndex.value = startIndex.value + visibleCount.value
})

// 监听滚动事件 计算当前要渲染的区间和虚拟列表要偏移的距离
function onScroll() {
  const scrollTop = containerRef.value!.scrollTop
  startIndex.value = Math.floor(scrollTop / itemHeight.value)
  endIndex.value = startIndex.value + visibleCount.value
  startOffset.value = scrollTop - (scrollTop % itemHeight.value)
}
</script>

<template>
  <div ref="containerRef" class="infinite-list-container" @scroll="onScroll">
    <div class="infinite-list-phantom" :style="{ height: `${placeholderHeight}px` }" />
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div v-for="item in visibleData" :key="item" class="infinite-list-item">
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
  line-height: v-bind(`${itemHeight}px`);
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
