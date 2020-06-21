<template>
  <div style="height: 100%;background: #eaeef3;">
    <el-container class="container">
      <el-header height="auto" class="header">
        <navigationBar :isCollapse.sync="isCollapse"></navigationBar>
      </el-header>
      <el-container>
        <el-aside width="auto" class="menu-aside-theme aside">
          <menuAside :isCollapse="isCollapse"></menuAside>
        </el-aside>
        <el-main class="menu-main-theme main">
          <router-tab></router-tab>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import routerTab from './router-tab'
import navigationBar from './navigationBar'
import menuAside from './menuAside'
export default {
  data () {
    return {
      isCollapse: false,
    }
  },
    methods: {
      handleClose(done) {done();
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {})
      }
    },
  components: {
    routerTab,
    navigationBar,
    menuAside
  }
}
</script>
<style lang="less" scoped>
@import url('../../assets/less/common/container.less');

</style>
