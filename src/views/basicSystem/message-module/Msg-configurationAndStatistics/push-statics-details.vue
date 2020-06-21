<template>
<el-dialog class="t-dialog" title="发送失败详情" v-if="visible" :visible="visible" :close-on-click-modal="false" width="70%" @close="close">  
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="dataList" tooltip-effect="dark" style="width: 100%;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="notificationType" sortable label="短信类型" width="130"></el-table-column>
    <el-table-column prop="failedReason" label="失败原因"></el-table-column>
    <el-table-column prop="sendTime" label="发送时间" width="220">
      <template slot-scope="scope">{{scope.row.sendTime?new Date(scope.row.sendTime).toLocaleString(): ''}}</template>
    </el-table-column>
    <el-table-column prop="receiver" label="用户手机号" width="220"></el-table-column>            
  </el-table>
</el-dialog>
</template>
</template>
<script>
export default {
  props: ['visible','dataList'],
  data () {
    return {

    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)       
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-drawer__body{
  padding:20px 25px;
  border-top:1px solid #ccc;
}
</style>