import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
export const useRouterStore = defineStore('router', {
    state: () => {
        const router = useRouter()
        // const route = useRoute()
        // const menu = []

        // console.log('[ router ] >', router)

        const ele = {
            collapsed: false
        }
        return ele
    },
    getters: {

    },
    actions: {

    },
})