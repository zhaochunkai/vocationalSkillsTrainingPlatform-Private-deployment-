import { ROUTER_TAB } from '../mutations'

const state = {
    openTab: [],             //所有打开的路由 - openTab 为 router对象的数组
    activeIndex: ''     // 激活状态 - activeIndex 为 path 路径
}

const mutations = {
    // 添加tabs
    [ROUTER_TAB.ROUTER_ADD] (state, data) {
        state.openTab.push(data);
    },
    // 删除tabs
    [ROUTER_TAB.ROUTER_DELETE] (state, path) {
        let index = 0;
        for (let option of state.openTab) {
            if (option.path === path) {
                break;
            }
            index++;
        }
        state.openTab.splice(index, 1);
    },
    // 清空tabs
    [ROUTER_TAB.ROUTER_CLEAR] (state) {
        state.openTab = [];
    },
    // 设置当前激活的tab
    [ROUTER_TAB.SET_ACTICE_ROUTER_INDEX] (state, index) {
        state.activeIndex = index;
    },
}

export default {
  state,
  mutations
}
