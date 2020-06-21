<template>
  <div>
    <div class="t-tabs">
      <el-tabs class="router-tabs-theme" v-model="activeIndex" v-if="openTab.length" type="border-card" closable @tab-click='tabClick' @tab-remove='tabRemove'>
        <el-tab-pane :key="item.path" v-for="item in openTab" :label="item.meta.title[item.meta.title.length-1]" :name="item.path">
          <div class="router-tabs-header-theme t-tabs-header">
          <span>当前位置：</span>
            <el-breadcrumb separator=">" class="t-breadcrumb">
              <el-breadcrumb-item v-for="(item, index) in item.meta.title" :key="index">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="t-tab-placeholder"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
import { ROUTER_TAB } from '../../store/mutations.js'
export default {
  created () {
    // 刷新时以当前路由做为 tab 加入tabs
    this.routerAdd(this.$route)
    this.activeIndex = this.$route.path
  },
  methods: {
    // tab标签点击时，切换相应的路由
    tabClick (tab) {
      this.$router.push({path: this.activeIndex})
    },
    // 移除tab标签
    tabRemove (targetPath) {
      // 只有一个tab标签，不做删除
      if (this.openTab && this.openTab.length > 1) {
        this.routerRemove(targetPath)

        if (this.activeIndex === targetPath) {
          // 设置当前激活的路由
          this.activeIndex = this.openTab[this.openTab.length - 1].path
          this.$router.push({path: this.activeIndex})
        }
      }
    },
    routerAdd (route) {
      this.$store.commit(ROUTER_TAB.ROUTER_ADD, {path: route.path, name: route.name, meta: route.meta })
    },
    routerRemove (path) {
      this.$store.commit(ROUTER_TAB.ROUTER_DELETE, path)
    }
  },
  watch: {
    '$route' (to, from) {
      // flag 判断路由是否已经tab打开
      let flag = false
      for (let item of this.openTab) {
        // 如果已经是打开的，将其置为active
        if (item.path === to.path) {
          this.activeIndex = to.path
          flag = true
          break
        }
      }

      // 如果未打开的，将其放入队列里
      if (!flag) {
        this.routerAdd(to)
        this.activeIndex = to.path
      }
    }
  },
  computed: {
    openTab () {
      return this.$store.state.routerTab.openTab
    },
    activeIndex: {
      get () {
        return this.$store.state.routerTab.activeIndex
      },
      set (val) {
        this.$store.commit(ROUTER_TAB.SET_ACTICE_ROUTER_INDEX, val)
      }
    }
  },
  destroyed () {
    this.$store.commit(ROUTER_TAB.SET_ACTICE_ROUTER_INDEX, '')
    this.$store.commit(ROUTER_TAB.ROUTER_CLEAR)
  }
}
</script>
