<template>
<el-dialog class="t-dialog" title="设置监管单位" v-if="visible" :visible="visible" :close-on-click-modal="false" width="1300px" @close="close">
  <el-form class="t-operate-filter" :inline="true" size="small">
    <el-form-item label="单位名称">
      <el-input class="input-append" v-model="filter" placeholder="可输入单位名称过滤" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="queryList">查询</el-button>
    </el-form-item>
  </el-form>
  <el-transfer v-model="value"
    :data="transferData"
    :props="alias"
    :titles="['未分配', '已分配']"
  >
    <!-- filterable
    :filter-method="filterMethod"
    filter-placeholder="可输入单位名称过滤" -->
    <!-- 分页组件 -->
    <div class="transfer-footer" slot="left-footer">
      <pagination
        ref="pagination"
        :total="total"
        @sizeChange="handleSize"
        @currentChange="handleCurrent"
      ></pagination>
    </div>
  </el-transfer>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="saveSupervision">保 存</el-button>
  </span>
</el-dialog>
</template>
<script>
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import { getGovernmentAccountList, bindGovernmentWithProgram } from '@/server/training-module'
export default {
  props: ['visible', 'chooseValue', 'dataForm'],
  components: {pagination},
  data () {
    return {
      alias: {key: 'id', label: 'displayName'},
      value: [],
      transferData: [],
      pageSize,
      pageSizes,
      total: 0,
      SkipCount: 0,
      // filterMethod (query, item) {
      //   return item.displayName.indexOf(query) > -1
      // },
      filter: ''
    }
  },
  watch: {
    chooseValue () {
      this.value = this.chooseValue
    },
    visible (newVal) {
      if (newVal) {
        this._getGovernmentAccountList()
      }
    }
  },
  methods: {
    /* ----------------------------------- 查询 ----------------------------------- */
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getGovernmentAccountList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getGovernmentAccountList(SkipCount, pageSize)
    },
    queryList () {
      this._getGovernmentAccountList(this.SkipCount, this.pageSize)
    },
    // 获取监管单位列表
    _getGovernmentAccountList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        filter: this.filter
      }
      getGovernmentAccountList(data).then(res => {
        this.transferData = res.items
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* ----------------------------------- 操作 ----------------------------------- */
    close () {
      this.$emit('update:visible', false)
    },
    // 获得穿梭框的监管单位数据
    saveSupervision () {
      let data = {
        trainingProgramId: this.dataForm.id,
        governmentIds: this.value
      }
      bindGovernmentWithProgram(data).then(() => {
        this.$message.success('监管单位设置成功！')
        this.$emit('queryList')
        this.close()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-transfer-panel{
  width:40%;
  min-width:500px;
}
</style>
