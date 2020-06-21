<template>
<div>
<el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
  <el-tab-pane label="流量充值记录" name="orderList">
    <el-table class="t-table-list" stripe size="small" :data="orderData" tooltip-effect="dark" style="width:100%;">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="orderNumber" sortable label="订单编号"></el-table-column>
      <el-table-column prop="creationTime" sortable label="订单创建时间">
        <template slot-scope="scope" show-overflow-tooltip>
          {{new Date(scope.row.creationTime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column prop="expiration" sortable label="订单过期时间">
        <template slot-scope="scope" show-overflow-tooltip>
          {{scope.row.expiration?new Date(scope.row.expiration).toLocaleString(): ''}}
        </template>
      </el-table-column>
      <el-table-column prop="fluxOrderStatus" sortable label="订单状态"></el-table-column>
    </el-table>
    <div class="t-operate-footer">
      <pagination :total="orderTotal" @sizeChange="handleSizeOrder" @currentChange="handleCurrentOrder"></pagination>
    </div>  
  </el-tab-pane>

  <el-tab-pane label="流量账单列表" name="chargeList">
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
          {{scope.row.totalFlux?scope.row.totalFlux.toFixed(2): ''}} GB
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>    
  </el-tab-pane>
</el-tabs>
</div>
</template>
<script>
import { getCDNOrderList,getCDNBillingList } from '@/server/resource-module.js'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
export default {
  data() {return {
    pageSize,
    rechargeData: [],
    conditionForm: {},
    total:0,
    tableData: [], // 账单列表
    tableVisible: false,
    gridData: [],
    activeName: 'orderList',
    orderData: [], // 充值记录
    orderTotal:0, // 充值记录
  }},
  components: {pagination},
  activated() {
    this.activeName='orderList';
    this._getCDNOrderList();
  },
  methods: {
    /* ------------------------------------------充值记录查询------------------------------- */ 
    /* 接收改变后每页多少条*/
    handleSizeOrder (SkipCount, pageSize) {
      this._getCDNOrderList(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrentOrder (SkipCount, pageSize) {
      this._getCDNOrderList(SkipCount, pageSize);
    },
    // 获取账单列表
    _getCDNOrderList(SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      };
      getCDNOrderList(data).then(result => {
        this.orderData=result.items;
        this.orderTotal=result.totalCount;
      })
    },
    handleSelectionChange() { },
    /* ------------------------------------------账单查询------------------------------- */ 
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    // 获取账单列表
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        startDate: this.conditionForm.startTime,
        endDate: this.conditionForm.endTime
      };
      getCDNBillingList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    handleSelectionChange() { },
    queryList() {
      this.initDataList();
    },
    /* ------------------------------------------操作------------------------------- */    
    handleClick(tab, event) {
      if (this.activeName=='orderList') {
        this._getCDNOrderList();
      } else {
        this.queryList()
      }
    },
    // 合计表格末行
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (parseFloat(prev)+parseFloat(curr)).toFixed(2);
            } else {
              return prev.toFixed(2);
            }
          }, 0);
          sums[index] += ' GB';
        } else {
          sums[index] = '';
        }
      })

      return sums;
    },
		goToCharge(row) {
			this.chargeVisible=true;
			this.chargeForm=row;
			this.$refs.tableList.setCurrentRow(row);
		},
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

