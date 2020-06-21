<template>
  <div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="开始时间">
        <el-date-picker v-model="conditionForm.startTime" type="date" value-format="yyyy-MM-dd " placeholder="选择开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="conditionForm.endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form> 
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" show-summary :summary-method="getSummaries" tooltip-effect="dark" style="width:100%;">
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column label="日期" prop="date" sortable width="200">
      <template slot-scope="scope">
        {{scope.row.date?new Date(scope.row.date).toLocaleDateString(): ''}}
      </template>
      </el-table-column>
      <el-table-column label="总消耗流量" prop="totalFlux" sortable width="200">
        <template slot-scope="scope">
          {{scope.row.totalFlux?scope.row.totalFlux.toFixed(2):0}} GB
        </template>
      </el-table-column>
      <!-- <el-table-column label="已使用的资源空间" prop="payable" width="200">
        <template slot-scope="scope">
          {{scope.row.usageFileSpace}} GB
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <!-- 抽屉 -->
    <!-- <push-statics-details :visible.sync="tableVisible" :dataList="gridData" ></push-statics-details> -->
  </div>
</template>
<script>
// import { getFileFluxBilling } from '@/server/resource-module.js'
// import pushStaticsDetails from './push-statics-details'
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
export default {
  data () {
    return {
      pageSize,
      conditionForm: {},
      total: 0,
      tableData: [],
      tableVisible: false,
      gridData: []
    }
  },
  components: {pagination},
  activated () {
    this.initDataList()
  },
  methods: {
    /* ------------------------------------------操作------------------------------- */
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    // 获取列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      // let data = {
      //   SkipCount: SkipCount,
      //   MaxResultCount: pageSize,
      //   StartTime: this.conditionForm.startTime,
      //   EndTime: this.conditionForm.endTime
      // }
      // getFileFluxBilling(data).then(result => {
      //   this.tableData = result.items
      //   this.total = result.totalCount;
      // })
    },
    queryList () {
      this.initDataList()
    },
    /* ------------------------------------------操作------------------------------- */
    // 合计表格末行
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              // return parseFloat(prev + curr);
              return (parseFloat(prev) + parseFloat(curr)).toFixed(2)
            } else {
              return prev.toFixed(2)
            }
          }, 0)
          sums[index] += ' GB'
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>
<style lang="less" scoped>
.dateGroup{
  padding-top:0;
}
/deep/.el-table th > .cell .red-star{
  color:#f00;
}
</style>
