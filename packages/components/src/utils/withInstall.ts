import type { Plugin } from 'vue'

export default <T>(comp: T & Plugin & { name: string }) => {
  comp.install = (app) => {
    const name = comp.name
    // 注册组件
    app.component(name, comp)
  }
  return comp
}
