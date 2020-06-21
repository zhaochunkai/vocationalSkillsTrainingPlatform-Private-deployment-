<template>
  <el-drawer
    title="发票信息"
    v-if="visible"
    :visible="visible"
    :direction="direction"
    size="80%"
    @close="close"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="发票基本信息" name="basicInfo">
        发票基本信息
      </el-tab-pane>
      <el-tab-pane label="发票订单组成信息" name="payment">
        <el-table class="t-table-list" ref="multipleTable" show-summary stripe size="small" :data="tableData" tooltip-effect="dark" style="width:100%;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="examName" sortable label="订单编号" align="center"></el-table-column>
          <el-table-column prop="examinationTypeName" label="类型" align="center"></el-table-column>
          <el-table-column prop="methodOfExaminationName" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="sponsorUnitName" label="订单实付金额" align="center"></el-table-column>
          <el-table-column prop="sponsorUnitName" label="订单支付时间" align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script>
import { } from '@/server/statistical-module'
export default {
  props: ['visible', 'dataForm'],
  data () {
    return {
      style: '',
      direction: 'rtl',
      activeName: 'basicInfo',
      tableData: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName = 'basicInfo'
      }
    },
    activeName (newVal) {
      if (newVal === 'basicInfo') {

      } else if (newVal === 'payment') {
        
      }
    }
  },
  activated () {},
  methods: {
    /* ------------------------------------------- 查询 ----------------------------------- */
    /* ------------------------------------------- 操作 ----------------------------------- */
    handleClick (tab, event) {
      // console.log (tab, event)
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang = "less" scoped>
.t-header-title span {
  text-align: center !important;
}
/deep/.el-drawer__body {
  overflow: scroll;
}
</style>
