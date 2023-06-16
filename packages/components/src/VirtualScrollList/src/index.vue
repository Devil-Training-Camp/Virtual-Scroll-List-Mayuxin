<script setup lang="ts" name="VirtualScrollList">
import { computed, defineProps, nextTick, onMounted, onUpdated, ref, toRefs, watch, withDefaults } from 'vue'

interface Props {
  dataSource: Record<string, any>[] // 列表数据
  estimatedItemSize?: number // item预估的高度
  bufferScale?: number // 缓冲区间比例
}

interface ItemPosition {
  index: number
  height: number
  top: number
  bottom: number
}

const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
  estimatedItemSize: 100,
  bufferScale: 1,
})
const { estimatedItemSize, bufferScale } = toRefs(props)

const _dataSource = ref<(Record<string, any> & { _id: number })[]>([])

const containerRef = ref<HTMLDivElement>()
// 滚动容器的高度
const containerHeight = ref(0)
// 虚拟列表的偏移量
const startOffset = ref(0)
// 渲染数据的开始索引
const startIndex = ref(0)
// 渲染数据的结束索引
const endIndex = ref(0)
// item的信息
const positionList = ref<ItemPosition[]>([])
// 占位容器的高度
const placeholderHeight = ref(0)

const itemsRef = ref<HTMLDivElement[]>()

// 滚动容器可视区域渲染的个数
const visibleCount = computed(() => Math.ceil(containerHeight.value / estimatedItemSize.value) + 1)
// 通过translate对虚拟列表进行偏移
const getTransform = computed(() => `translate3d(0, ${startOffset.value}px, 0)`)
// 缓冲区域
const aboveCount = computed(() => Math.min(startIndex.value, visibleCount.value * bufferScale.value))
const belowCount = computed(() => Math.min(_dataSource.value.length - endIndex.value, visibleCount.value * bufferScale.value))
// 需要渲染的数据
const visibleData = computed(() => _dataSource.value.slice(startIndex.value - aboveCount.value, endIndex.value + belowCount.value))

function init() {
  positionList.value = _dataSource.value.map((_, index) => ({
    index,
    height: estimatedItemSize.value,
    top: index * estimatedItemSize.value,
    bottom: (index + 1) * estimatedItemSize.value,
  }))
  placeholderHeight.value = positionList.value[positionList.value.length - 1].bottom
}

watch(props.dataSource, (data) => {
  _dataSource.value = data.map((e, index) => {
    return {
      _id: index,
      ...e,
    }
  })
  init()
}, { immediate: true })

onMounted(() => {
  // 获取滚动容器的高度
  containerHeight.value = containerRef.value!.clientHeight
  endIndex.value = startIndex.value + visibleCount.value
})

onUpdated(async () => {
  await nextTick()
  if (_dataSource.value.length) {
    const itemEles = itemsRef.value!
    ;[...itemEles].forEach((ele) => {
      const i = +ele.getAttribute('tId')!
      const { height } = ele.getBoundingClientRect()
      const oldHeight = positionList.value[i].height
      const dHeight = oldHeight - height
      if (dHeight) {
        positionList.value[i].height = height
        positionList.value[i].bottom = positionList.value[i].bottom - dHeight
        let t = i + 1
        while (t < positionList.value.length) {
          positionList.value[t].top = positionList.value[t - 1].bottom
          positionList.value[t].bottom = positionList.value[t].bottom - dHeight
          t++
        }
      }
    })
    placeholderHeight.value = positionList.value[positionList.value.length - 1].bottom
    setStartOffset()
  }
})

function setStartOffset() {
  if (startIndex.value > 0) {
    const size = positionList.value[startIndex.value].top - positionList.value[startIndex.value - aboveCount.value].top
    startOffset.value = positionList.value[startIndex.value - 1].bottom - size
  }
  else {
    startOffset.value = 0
  }
}

// 二分法查找开始索引
function binarySearch(list: ItemPosition[], value: number) {
  let start = 0
  let end = list.length - 1
  let tempIndex = null
  while (start <= end) {
    const midIndex = Math.floor((start + end) / 2)
    const midValue = list[midIndex].bottom
    if (midValue === value) {
      return midIndex + 1
    }
    else if (midValue < value) {
      start = midIndex + 1
    }
    else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex)
        tempIndex = midIndex

      end = end - 1
    }
  }
  return tempIndex
}

// 监听滚动事件 计算当前要渲染的区间和虚拟列表要偏移的距离
function onScroll() {
  window.requestAnimationFrame(() => {
    const scrollTop = containerRef.value!.scrollTop
    startIndex.value = binarySearch(positionList.value, scrollTop) as number
    endIndex.value = startIndex.value + visibleCount.value
    setStartOffset()
  })
}
</script>

<template>
  <div ref="containerRef" class="infinite-list-container" @scroll="onScroll">
    <div class="infinite-list-phantom" :style="{ height: `${placeholderHeight}px` }" />
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div v-for="item in visibleData" :key="item._id" ref="itemsRef" :tId="item._id" class="infinite-list-item">
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
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
    line-height: 100px;
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #999;
  }
}
</style>
