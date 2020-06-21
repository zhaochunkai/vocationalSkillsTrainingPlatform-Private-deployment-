<template>
  <div class="menu-theme t-menu-wrap text-nowrap">
    <div class="menu-title">
      <i class="fa fa-bookmark"></i>
      <span>{{moduleName}}</span>
    </div>
    <!-- 菜单列表 -->
    <div v-if="loading">
      <el-menu class="menu-list" :default-active="activeMenuIndex" :collapse="isCollapse">
        <MenuTree :menuLIst="menuLIst" @clickMenuItem="clickMenuItem"></MenuTree>
      </el-menu>
    </div>
  </div>
</template>
<script>
import { MenuTree } from '../../components'
import { MENU_LIST } from '../../store/mutations.js'
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true
    }
  },
  created () {
    // 刷新页面，通过路由(meta > title)设置模块名与菜单名
    let routeMeta = this.$route.meta
    this.moduleName = routeMeta.title[0] // 当前模块名
    this.activeMenuName = routeMeta.title[routeMeta.title.length - 1] // 当前菜单名
  },
  methods: {
    // 点击菜单的跳转，改变菜单index值
    clickMenuItem (menuItem) {
      this.activeMenuIndex = menuItem.index
      this.$router.push(menuItem.path)
    }
  },
  watch: {
    // 当切换模块时，菜单index === '-1'，重新渲染菜单列表
    activeMenuIndex (newVal) {
      if (newVal === '-1') {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      }
    }
  },
  computed: {
    moduleName: {
      get () {
        return this.$store.state.menuList.activeModuleName
      },
      set (val) {
        this.$store.commit(MENU_LIST.SET_ACTICE_MODULE_NAME, val)
      }
    },
    menuLIst () {
      return this.$store.getters.menuList
    },
    activeMenuIndex: {
      get () {
        return this.$store.state.menuList.activeMenuIndex
      },
      set (val) {
        this.$store.commit(MENU_LIST.SET_ACTICE_MENU_INDEX, val)
      }
    },
    activeMenuName: {
      get () {
        return this.$store.state.menuList.activeMenuName
      },
      set (val) {
        this.$store.commit(MENU_LIST.SET_ACTICE_MENU_NAME, val)
      }
    }
  },
  components: {
    MenuTree
  }
}
</script>
<style lang="less" scoped>
@import url("../../assets/less/common/menuAside.less");
</style>
