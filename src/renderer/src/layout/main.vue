<template>


    <n-space vertical>
        <n-layout has-sider>
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
                show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                <Menu />
            </n-layout-sider>
            <n-layout>
                <!-- <router-view /> -->
                <D301 />
            </n-layout>
        </n-layout>
    </n-space>
</template>

<script setup lang="ts">
import Menu from '@renderer/layout/components/menu/menu.vue'
import D301 from '@renderer/pages/test/d3/02.vue'
import { useRouterStore } from '@renderer/store/modules/router'
const routerStore = useRouterStore()
const collapsed = routerStore.collapsed
</script>

<style lang="scss" scoped></style>
<!-- 
各种天气 车距  包错的
桥梁，陡坡，隧道，弯道 50米内不停车 错一次
虚假材料申请 500-一年
虚假材料，贿赂获得 2k,3年
车距
参加安全教育扣减，鼓弄虚假罚款1k
除了小汽车以外其余车辆在高速公路 超速达50% 扣分9
车辆超100时速，必须保持100以上的距离
校车，公路客运车，旅游客运车，超载20 6分
驾驶车辆在高速公路时遇到特殊天气需要·保持40 s/h 50m的距离
--> 