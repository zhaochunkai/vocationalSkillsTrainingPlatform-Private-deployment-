<template>
  <el-card :style="style">
    <!-- 流量配置及统计 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="剩余流量统计" name="msgPust">
        <div class="t-box-card-header">
          <span class="date" style="margin-right:20px;">数据更新时间：{{date.toLocaleString()}}</span>
          <el-button type="text" @click="refresh">刷新</el-button>
        </div>
        <el-table
          class="t-table-list"
          ref="tableList"
          stripe
          size="small"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
        >
          <el-table-column prop="totalFlux" label="剩余流量" align="center">
            <template slot-scope="scope">{{scope.row.totalFlux}} GB</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="success" @click="goToCharge(scope.row,'flux')">流量充值</el-button>
            </template>
          </el-table-column>
          </el-table>
      </el-tab-pane>
      <!-- 流量账单 -->
      <el-tab-pane label="流量账单" name="PushStatistic">
        <push-teaching-statics ref="teachingStatics"></push-teaching-statics>
      </el-tab-pane>
    </el-tabs>
    <!-- 流量充值 -->
    <charge-dialog
      :dataForm="chargeForm"
      :title="dialogTitle"
      :StrategyType="StrategyType"
      :visible.sync="chargeVisible"
      @save="chargeSave"
      @updateList="updateList"
    ></charge-dialog>
  </el-card>
</template>
<script>
import { getResidueFlux } from '@/server/resource-module'
import chargeDialog from './flow-charge-dialog'
import pushTeachingStatics from './push-liveTeaching-statics.vue'
export default {
  data () {
    return {
      style: '',
      subPages: [],
      activeName: 'msgPust',
      date: new Date(),
      tableData: [],
      chargeForm: {},
      chargeVisible: false,
      flowCheckList: [],
      ResidueFlux: null,
      // CDN
      StrategyType: '', // 策略类型 CDN flux
      rechargeData: [],
      dialogTitle: '', // 充值窗口标题
    }
  },
  components: {
    chargeDialog,
    pushTeachingStatics
  },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
    this._getResidueFlux()
  },
  methods: {
    /* ------------------------------------------查询------------------------------- */
    _getResidueFlux () {
      // 获取剩余流量
      this.tableData = []
      getResidueFlux()
        .then(res => {
          this.tableData.push(res)
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    /* ------------------------------------------操作------------------------------- */
    refresh () {
      this._getResidueFlux()
      this.date = new Date()
    },
    goToCharge (row, type) {
      this.chargeVisible = true
      this.chargeForm = row || {}
      this.StrategyType = type
      this.dialogTitle = '流量充值'
      setTimeout(() => {
        this.$refs.tableList.setCurrentRow(row)
      }, 1)
    },
    chargeSave (id, type) {
      let obj = this.tableData.find(item => {
        return item.id === id
      })
      setTimeout(() => {
        this.$refs.tableList.setCurrentRow(obj)
      }, 1)
    },
    updateList (type) {
      this._getResidueFlux()
    },
    handleClick (tab, event) {
      if (this.activeName === 'PushStatistic') {
        // 直播流量
        this.$refs.teachingStatics.initDataList()
      } else if (this.activeName === 'msgPust') {
        // 所有流量统计
        this._getResidueFlux()
        this.date = new Date()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cardItem {
  margin: 20px 20px 10px;
  color: #993;
  line-height: 40px;
  .buttons {
    display: flex;
    justify-content: space-around;
  }
}
.message-check {
  margin-top: 10px;
  /deep/.el-form-item {
    max-width: 650px;
  }
}
.t-operate-filter {
  margin-top: 10px;
}
</style>
