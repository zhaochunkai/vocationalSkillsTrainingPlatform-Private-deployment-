<template>
<div>
  <!-- 流量充值记录 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>流量充值记录</span>
    </div>
    <!-- 操作按钮 -->
    <div class="dateGroup">
      <span style="line-height:30px;">订单状态：</span>
      <el-menu :default-active="OrderStatus" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable"  stripe size="small" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="orderNumber" sortable label="订单编号" align="center"></el-table-column>
      <el-table-column prop="strategyName" label="套餐" align="center"></el-table-column>
      <el-table-column prop="creationTime" sortable label="订单创建时间" align="center">
        <template slot-scope="scope" show-overflow-tooltip>
          {{new Date(scope.row.creationTime) | formatAllDate}}
        </template>
      </el-table-column>
      <el-table-column prop="status" sortable label="订单状态" align="center"></el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </el-card>
</div>
</template>
<script>
import { getFluxOrder } from '@/server/resource-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      style: '',
      pageSizes,
      SkipCount: 0,
      pageSize,
      total: 0,
      OrderStatus: '1', // 默认状态
      btns: [
        {type: '1', name: '等待付款'},
        {type: '2', name: '付款成功'},
        {type: '3', name: '付款失败'}
      ],
      tableData: [],
      isSelectAll: false
    }
  },
  components: {pagination},
  activated () {
    this.initDataList()
  },
  methods: {
    /* ------------------------------- 查询 ------------------------------- */
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    // 获取流量充值订单记录
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        OrderStatus: this.OrderStatus
      }
      getFluxOrder(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    /* ------------------------------- 操作 ------------------------------- */
    toInfomationPage (row) { // 跳转至资源信息模块
      this.$router.push({path: '/repository/infomation', query: {id: row.id}})
    },
    handleSelect (key, keyPath) { // 查询列表
      this.OrderStatus = key
      this.initDataList()
    }
  }
}
</script>
<style lang="less" scoped>
.dateGroup{
  padding-top:0;
}
</style>
