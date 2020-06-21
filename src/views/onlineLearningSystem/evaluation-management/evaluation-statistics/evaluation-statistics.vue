<template>
<el-dialog class="t-dialog" :title="`【${dataForm.evaluationName}】评价统计`" v-if="visible" :visible="visible" :close-on-click-modal="false" width="80%" @close="close">
  <div class="t-header-title">
    <span>汇总统计</span>
  </div>
  <el-table class="t-table-list" ref="Table" border stripe size="small" :data="summaryStatistics" tooltip-effect="dark" style="margin-top:10px;">
    <el-table-column prop="" label="满分" align="center">
      <template slot-scope="scope">5</template>
    </el-table-column>
    <el-table-column prop="score" label="得分" align="center"></el-table-column>
    <el-table-column prop="numberOfParticipants" label="应参评人数" align="center"></el-table-column>
    <el-table-column prop="actualNumberOfParticipants" label="实际参评人数" align="center"></el-table-column>
    <el-table-column prop="participationRate" label="参评率" align="center">
      <template slot-scope="scope">{{scope.row.participationRate * 100}}%</template>
    </el-table-column>
  </el-table>
  <div class="t-header-title">
    <span>明细信息</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="participatingUsers" label="参评用户" align="center"></el-table-column>
    <el-table-column prop="evaluationTime" label="评价时间" align="center">
      <template slot-scope="scope">
        {{new Date(scope.row.evaluationTime) | formatAllDate}}
      </template>
    </el-table-column>
    <el-table-column prop="score" label="评价分数" align="center"></el-table-column>
    <el-table-column  fixed="right" label="操作" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="toDetails(scope.row)">评价详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>
  <!-- 评价详细信息 -->
  <statistics-detail :dataForm="addEditForm" :visible.sync="detailVisible"></statistics-detail>
</el-dialog>
</template>
<script>
import { getEvaluationStatisticsInfo, getEvaluationDetailInfoList } from '@/server/online-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import statisticsDetail from './evaluation-statistics-detail'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      // 汇总信息
      summaryStatistics: [],
      // 明细列表
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      // 详细信息
      addEditForm: {},
      detailVisible: false
    }
  },
  components: {pagination, statisticsDetail},
  watch: {
    visible (newVal) {
      if (newVal) {
        if (this.dataForm.id) {
          setTimeout(() => { // 自动调用子组件中的方法
            // 汇总统计
            this._getEvaluationStatisticsInfo()
            // 明细列表
            this._getEvaluationDetailInfoList()
          }, 1)
        }
      }
    }
  },
  activated () {
  },
  methods: {
    // ------------------------------------- 查询 -------------------------------------
    // 获取评价汇总统计信息
    _getEvaluationStatisticsInfo () {
      getEvaluationStatisticsInfo(this.dataForm.id).then(res => {
        this.summaryStatistics = [res]
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* *接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getEvaluationDetailInfoList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getEvaluationDetailInfoList(SkipCount, pageSize)
    },
    // 获取评价明细列表
    _getEvaluationDetailInfoList () {
      getEvaluationDetailInfoList(this.dataForm.id).then(res => {
        this.tableData = res.items
        this.total = res.totalCount
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // ------------------------------------- 操作 -------------------------------------
    // 查看评价详情
    toDetails (row) {
      this.addEditForm = row
      this.detailVisible = true
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.el-form .el-form-item{
//   max-width:80%;
// }
// /deep/.el-input__inner,
// /deep/.el-textarea__inner{
//   border:none;
//   background: #eee;
// }
// 评价列表
  .t-evaluate-item{
    padding:1rem 0;
    border-bottom:4px solid #f5f5f5;
    .t-evaluate-stuInfo{
      display: flex;
      .t-avatar{
        margin-right:0.6rem;
        /deep/.van-image__img{
          border-radius: 50%;
        }
      }
      .t-evaluate-grade{
        display: flex;
        justify-content: space-between;
      }
    }
    .t-evaluate-content{
      line-height:1.3rem;
      margin:0.6rem 0;
    }
    .t-evaluate-Reply{
      line-height:1.3rem;
      background: #ffebf5;
      border:1px dashed #FF3399;
      color:#FF3399;
      padding:0.6rem;
      border-radius:6px;
    }
    /deep/.van-tag{
      margin-right:2rem;
    }
  }
  .t-evaluate-item:last-child{
    border-bottom:none;
    padding:0;
  }
</style>
