

import { createPinia } from 'pinia'
import { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'



export function useStore(app: App<Element>) {
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)
    return pinia
}
// export * from '@renderer/store/modules'