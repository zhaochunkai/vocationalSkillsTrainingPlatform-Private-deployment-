import { DEMO } from '../mutations'

const state = {
  count: 0
}

const getters = {
  demoText: (state, getters) =>
    state.count > 10 ? '你真厉害！' : '再接再厉吧！'
}

const mutations = {
  [DEMO.ADD] (state) {
    state.count++ // 变更状态
  }
}

export default {
  state,
  getters,
  mutations
}
