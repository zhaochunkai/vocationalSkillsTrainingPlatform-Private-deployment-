<template>
<el-dialog class="t-dialog" v-if="visible" :visible="visible" :close-on-click-modal="false" append-to-body @close="close" :title="title" width="40%">
  <el-transfer v-model="value" :data="dataList" :props="alias" :titles="['未分配', '已分配']"></el-transfer>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
  </div>
</el-dialog>
<!-- :props="{key: 'id',label: 'name'}" 给原数据标致取别名 -->
  <!-- <el-transfer v-model="value" :data="dataList" :props="alias" :titles="['未分配', '已分配']"></el-transfer> -->
</template>

<script>
export default {
  props: ['dataList', 'alias', 'visible', 'chooseValue', 'title'],
  data () {
    return {
      /* data: [
        {key:1,label: 'sss1'},
        {key:2,label: 'sss1'},
      ], */
      value: []
    }
  },
  watch: {
    chooseValue () {
      this.value = this.chooseValue
    }
  },
  methods: {
    save () {
      this.$emit('saveTransfer', this.value)
      this.close()
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog__header {
  border-bottom: 1px solid #ddd;
}
/deep/.el-dialog .el-dialog__body{
  padding:20px;
}
/deep/.el-transfer {
  max-width: 600px;
  margin-bottom: 0 auto 60px;
}
/deep/.el-transfer__buttons{
  padding:0 10px;
}
/deep/.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
  font-size:14px;
}
/deep/.el-checkbox__label span{
  font-size:13px;
}
</style>
