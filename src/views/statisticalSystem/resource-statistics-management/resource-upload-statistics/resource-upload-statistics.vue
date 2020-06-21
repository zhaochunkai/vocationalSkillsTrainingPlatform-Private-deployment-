<template>
<div>
  <!-- 用户上传统计 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>用户上传统计</span>
    </div>

  </el-card>
</div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      style: ''
    }
  },
  watch: {
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
  },
  methods: {
    /* ------------------------------------ 查询数据 -------------------------- */
    /* ------------------------------------ 操作按钮 -------------------------- */
  }
}
</script>
