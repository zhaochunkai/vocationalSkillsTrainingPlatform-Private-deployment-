<template>
  <div>
    <!-- 操作按钮 -->
    <!-- <div class="dateGroup">
      <span style="line-height:30px;">统计时间：</span>
      <el-menu :default-active="EvaluationTimeTypeEnum" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
      </el-menu>
    </div> -->
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" show-summary tooltip-effect="dark" style="width: 100%;">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="日期" prop="date" sortable align="center">
      <template slot-scope="scope">
        {{new Date(scope.row.dateTime) | formatDate}}
      </template>
      </el-table-column>
      <el-table-column label="总流量" prop="totalFlux" sortable align="center">
        <template slot-scope="scope">
          {{Number(scope.row.totalFlux).toFixed(2)}} GB
        </template>
      </el-table-column>
      <!-- <el-table-column :render-header="customFieldColumn" label="并发连接数峰值" prop="maxOnlineNum" width="160"></el-table-column>
      <el-table-column label="最大带宽" prop="maxBandwidth" width="150">
        <template slot-scope="scope">
          {{scope.row.maxBandwidth}} Mbps
        </template>
      </el-table-column>
      <el-table-column label="账单金额" prop="payable" width="150">
        <template slot-scope="scope">
          {{scope.row.payable}} 元
        </template>
      </el-table-column>
      <el-table-column label="流名称" prop="streamName"></el-table-column> -->
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <!-- 抽屉 -->
    <push-statics-details :visible.sync="tableVisible" :dataList="gridData" ></push-statics-details>
  </div>
</template>
<script>
import { getLiveRoomBilling } from '@/server/resource-module.js'
import pushStaticsDetails from './push-statics-details'
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
export default {
  data () {
    return {
      EvaluationTimeTypeEnum: 'All', // 默认评价时间类型
      btns: [
        {type: 'All', name: '全部'},
        {type: 'Today', name: '今日'},
        {type: 'Yesterday', name: '昨日'},
        {type: 'Week', name: '本周'},
        {type: 'Month', name: '本月'},
        {type: 'CustomDate', name: '其他时间'}
      ],
      pageSize,
      total: 0,
      tableData: [],
      tableVisible: false,
      gridData: [],
      startTime: null
    }
  },
  components: {pagination, pushStaticsDetails},
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
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      getLiveRoomBilling(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    customFieldColumn (h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, ''),
        h('el-popover', {props: {placement: 'top', width: '200', trigger: 'hover', content: '公众号中此数量不可作为在线人数的参考。此数据由服务商提供，平台仅做展示'}}, [
          h('span', {slot: 'reference', class: 'font-normal'},
            [
              h('span', {}, '并发连接数峰值'),
              h('span', {class: 'red-star'}, ' *')
            ]
          )
        ])
      ])
    },
    /* ------------------------------------------操作------------------------------- */
    handleSelect (key, keyPath) { // 查询列表
      this.EvaluationTimeTypeEnum = key
      this.initDataList()
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
