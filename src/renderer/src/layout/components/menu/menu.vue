<template>
  <div>
    <n-menu
      v-model:value="activeKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { renderIcon } from '@renderer/utils'
import type { MenuOption } from 'naive-ui'
import { BookOutline as BookIcon, HomeOutline as HomeIcon } from '@vicons/ionicons5'
const activeKey = ref<string>('')
const collapsed = ref<boolean>(false)
const menuOptions = ref<MenuOption[]>([
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookIcon)
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    icon: renderIcon(HomeIcon),
    disabled: true,
    children: [
      {
        label: 'chapter 1',
        key: 'rat'
      }
    ]
  }
])
</script>

<style scoped></style>
