<template>
  <div class="section">
    <img src="../../assets/images/error_404.jpg" alt>
    <div class="reminder">
      <div>
        <span class="text">哎呀，看来你拐错弯啦。</span>
        <el-button type="text" @click="backLogin">返回登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    // 返回登录页面
    backLogin () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../assets/less/common/error_404.less');
</style>
