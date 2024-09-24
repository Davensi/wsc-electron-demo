<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <n-button @click="remove">移除图表</n-button>
    <h1>D3__________________________________________________1</h1>
    <div ref="container" style="height: 500px;"></div>
  </div>
</template>

<script setup lang="ts">
// console.log('[ d3   ] >', )
import * as d3 from 'd3'
import  { NButton } from 'naive-ui'
import { onMounted, ref, Ref } from 'vue'
const container: Ref<Element | null> = ref(null)
const remove = ()=>{
  d3.select(container.value).select('svg').remove()
}
// Declare the chart dimensions and margins.
const width = 640
const height = 400
const marginTop = 20
const marginRight = 20
const marginBottom = 30
const marginLeft = 40

// Declare the x (horizontal position) scale.
const x = d3
  .scaleUtc() // 使用UTC时间尺度。
  .domain([new Date('2023-01-01'), new Date('2024-01-01')]) // 填充时间范围。
  .range([marginLeft, width - marginRight]) // 设置输出范围。

// Declare the y (vertical position) scale.
const y = d3
  .scaleLinear() // 使用线性尺度。
  .domain([0, 9000]) // 填充数值范围。
  .range([height - marginBottom, marginTop]) // 设置输出范围。

// Create the SVG container.
const svg = d3.create('svg').attr('width', width).attr('height', height) // 设置宽高。

// Add the x-axis.
svg
  .append('g') // 添加一个g元素。
  .attr('transform', `translate(0,${height - marginBottom})`) // 设置g位置。
  .call(d3.axisBottom(x)) // 添加x轴。

// Add the y-axis.
svg.append('g').attr('transform', `translate(${marginLeft},0)`).call(d3.axisLeft(y)) // 添加y轴。

// Append the SVG element.
onMounted(() => {

  // 挂载到对应位置
  container?.value && container.value.append(svg.node())
})
</script>

<style lang="scss" scoped></style>
