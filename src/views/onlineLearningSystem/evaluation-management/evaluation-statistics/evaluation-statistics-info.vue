<template>
<div>
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
      <el-table-column prop="organization" label="所属组织" align="center"></el-table-column>
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

  <el-row>
    <h2 class="newEvaluate">最新评价</h2>
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="evaluateData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column >
        <template slot-scope="scope">
          <div style="display:flex;">
            <div class="t-avatar"><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
            <div class="t-content">
              <div class="t-evaluate-stuInfo">
                <div style="width:100%;">
                  <p class="t-p">{{scope.row.commentPersonName}}</p>
                  <div class="t-evaluate-grade">
                    <span style="padding-right:2rem;">{{new Date(scope.row.creationTime).toLocaleString()}}</span>
                    <el-rate :value="scope.row.score" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
                  </div>
                </div>
              </div>
              <div class="t-evaluate-tag">
                <el-tag color="#fff" style="color:#000;border:1px solid #999;" v-show="list" v-for="(list,j) of scope.row.IndicatorList" :key="j">{{list}}</el-tag>
                <div class="t-evaluate-content">
                  {{scope.row.content}}
                </div>
              </div>
              <div class="t-evaluate-Reply" v-show="scope.row.replyContent">
                {{scope.row.replyContent}}
              </div>
              <div v-if="scope.row.replyContent">
                <span>回复时间：{{new Date(scope.row.replyTime).toLocaleString()}}</span>  
                <span>回复人：{{scope.row.replyPersonName}}</span>  
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="reply(scope.row)">回复</el-button>
          <el-button type="primary" size="small" @click="display(scope.row)">{{!scope.row.flagShow?'显示': '隐藏'}}</el-button>
          <el-button type="primary" size="small" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 回复模块 -->
    <evaluation-reply :dataForm="replyEditForm" :visible.sync="replyVisible" @save="replySave"></evaluation-reply>
  </el-row>
</div>
</template>
<script>
import { getEvaluationStatisticsInfo, getEvaluationDetailInfoList,
  GetCommentWithGraphInfo, getEvaluationInfoTop10,
  ReplyEvaluationInfo, deleteEvaluationInfo, EvaluationInfoFlagShow } from '@/server/online-module'
import barGraph from '@/components/bar-graph'
import circularGraph from '@/components/circular-graph'
import evaluationReply from './evaluation-reply'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  props: ['planId'],
  data () {
    return {
      evaluationTimeType: 'All', // 默认评价时间类型
      btns: [
        {type: 'All', name: '全部'},
        {type: 'Today', name: '今日'},
        {type: 'Yesterday', name: '昨日'},
        {type: 'Week', name: '本周'},
        {type: 'Month', name: '本月'},
        {type: 'CustomDate', name: '其他时间'}
      ],
      evaluateData: [],
      dataCenter: {}, // 综合数据
      // -----------------------------柱状图---------------------------
      xData: ['1分', '2分', '3分', '4分', '5分'], // x轴标题
      yData: [], // 柱状对应数值
      // yData: [10, 52, 0, 334, 390],    // 柱状对应数值
      // -------------- 环形图---------------------
      legendData: [],
      colorData: ['#a169f1', '#ffae88', '#00f', '#32b2ef', '#ff7da1', '#f60', '#0fa', '#0a9'],
      // dataList: [{value:335, name: '直达'}]
      dataList: [],
      // -----------------------------最新评价-----------------------
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      replyVisible: false,
      replyEditForm: {},
      // 汇总信息
      summaryStatistics: [],
      // 明细列表
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: []
    }
  },
  components: {pagination, barGraph, circularGraph, evaluationReply},
  watch: {
    // planId (newVal) {
    //   if (newVal) {
    //     console.log('sssss')
    //     this._getEvaluationStatisticsInfo()
    //     this._GetCommentWithGraphInfo()
    //     this._getEvaluationInfoTop10()
    //   }
    // }
  },
  methods: {
    // ------------------------------------- 操作 -------------------------------------
    // 获取评价汇总统计信息
    _getEvaluationStatisticsInfo () {
      getEvaluationStatisticsInfo(this.planId).then(res => {
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
      getEvaluationDetailInfoList(this.planId).then(res => {
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
    _getEvaluationInfoTop10 () { // 评论列表top10
      getEvaluationInfoTop10(this.planId).then(result => {
        result.forEach(item => {
          if (item.belongToIndicatorName) {
            this.$set(item, 'IndicatorList', item.belongToIndicatorName.split(','))
          }
        })
        this.evaluateData = result
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    _GetCommentWithGraphInfo () { // 图形统计
      let data = {
        evaluationTimeType: this.evaluationTimeType,
        planId: this.planId
        // startDate: this.startDate,
        // endDate: this.endDate,
      }
      this.yData = []
      this.dataList = []
      this.legendData = []
      GetCommentWithGraphInfo(data).then(result => {
        this.dataCenter = Object.assign({}, result)
        for (let i = 0; i < 5; i++) { // ---柱状图数据
          result.scoreStatistic.forEach(item => {
            if (i === item.scoreType - 1) {
              this.$set(this.yData, i, item.personCount)
            } else {
              this.$set(this.yData, i, 0)
            }
          })
        }
        result.scoreStatistic.forEach(item => { // 评价统计
          let index = item.scoreType - 1
          this.$set(this.yData, index, item.personCount ? item.personCount : 0)// 柱状图数据
        })
        result.indicatorProportion.forEach(item => {
          this.$set(item, 'value', item.proportion)
          this.legendData.push(item.name)// 饼状图-色块
        })
        this.dataList = result.indicatorProportion // 饼状图-数据
      })
    },
    // ------------------------------------- 操作 -------------------------------------
    // 查看评价详情
    toDetails (row) {

    },
    del (row) { // 删除
      this.$confirm(`此操作将 删除学员【${row.commentPersonName}】的评价 ，请确认？`, '提示', {
        confirmButtonText: '通过',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteEvaluationInfo(row.id).then(() => {
          this.$message.success('删除成功')
          this._getEvaluationInfoTop10()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch()
    },
    display (row) { // 显示
      EvaluationInfoFlagShow(row.id, !row.flagShow).then(() => {
        this.$message.success(`${!row.flagShow ? '显示' : '隐藏'}学员【${row.commentPersonName}】的评论成功`)
        this._getEvaluationInfoTop10()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    reply (row) { // 回复评论
      this.replyVisible = true
      this.replyEditForm = row
    },
    replySave (id, replyContent) { // 回复评论
      let data = {id, replyContent}
      ReplyEvaluationInfo(data).then(() => {
        this.$message.success('回复成功')
        this._getEvaluationInfoTop10()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
      this.evaluationTimeType = key
      this._GetCommentWithGraphInfo()
    },
    gotoReviewers () { // 查看评价人员列表
      this.$router.push({path: '/evaluating/reviewers', query: {planId: this.planId}})
    }
  }
}
</script>
<style lang="less" scoped>
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom-color: transparent;
  color: #303133;
  border-radius: 4px;
  background: #4593bf;
  color:#fff;
}
// 评价列表
.t-avatar{
  margin-right:1rem;
  img{
    width:80px;
    height:80px;
    border-radius:6px;
  }
}
.t-p{
  margin:6px 0;
}
.t-content{
  max-width: 800px;
  width: 100%;
}
.t-evaluate-stuInfo{
  display: flex;
  .t-evaluate-grade{
    display: flex;
    // justify-content: space-between;
  }
}
.t-evaluate-content{
  line-height:1rem;
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
/deep/.el-tag{
  margin-right:1rem;
}
.t-evaluate-tag{
  margin-top:6px;
}
</style>