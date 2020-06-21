<template>
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>短息余量统计</span>
    </div>
    <el-tag
      type="warning"
      style="color:#000;margin-bottom:20px;"
      effect="dark"
    >消息推送功能，可以通过短信和微信公众号，给学员推送考试和学员相关的提醒消息，包括成绩导入、成绩查询等，以提升学员的学习体验。</el-tag>
    <div class="info-title">
      <span class="date">数据更新时间：{{date.toLocaleString()}}</span>
      <el-button type="success" size="small" @click="refresh">刷 新</el-button>
    </div>
    <el-table
      class="t-table-list"
      ref="tableList"
      stripe
      size="small"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column prop="successCount" label="成功到达量" align="center"></el-table-column>
      <el-table-column prop="remainingCount" label="剩余短信" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="goToCharge(scope.row)">短信充值</el-button>
          <!-- <el-button type="text" size="small" @click="isEneble(scope.row)">{{scope.row.isAvailable?'启用': '停用'}}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 短信充值 -->
    <charge-dialog
      :dataForm="chargeForm"
      :visible.sync="chargeVisible"
      @save="chargeSave"
      @updateList="_getSurplusMessage"
    ></charge-dialog>
  </el-card>
</template>
<script>
import { getSurplusMessage } from '@/server/message-module'
import rechargeRecord from './recharge-record.vue'
import messageSign from './message-sign.vue'
import chargeDialog from './message-charge-dialog'
export default {
  data () {
    return {
      style: '',
      subPages: [],
      date: new Date(),
      tableData: [],
      chargeForm: {},
      chargeVisible: false,
      messageCheckList: []
    }
  },
  components: { rechargeRecord, messageSign, chargeDialog },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
    this._getSurplusMessage()
  },
  methods: {
    /* ------------------------------- 查询 ------------------------------- */
    // 短信余量
    _getSurplusMessage () {
      this.tableData = []
      getSurplusMessage()
        .then(result => {
          this.tableData.push(result)
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    /* ------------------------------- 操作 ------------------------------- */
    refresh () {
      this._getSurplusMessage()
      this.date = new Date()
    },
    goToCharge (row) {
      this.chargeVisible = true
      this.chargeForm = row
      this.$refs.tableList.setCurrentRow(row)
    },
    chargeSave (id) {
      let obj = this.tableData.find(item => {
        return item.id === id
      })
      this.$refs.tableList.setCurrentRow(obj)
    }
  }
}
</script>
<style lang="less" scoped>
.info-title {
  line-height: 40px;
  span.title {
    padding: 10px 16px;
    border: 1px solid #666;
    border-bottom: none;
  }
  span.date {
		margin: 0 60px;
		font-size: 14px;
  }
}
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
</style>
