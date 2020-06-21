<template>
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>报名分析</span>
  </div>
  <div class="dateGroup">
    <span style="line-height:30px;">统计时间：</span>
    <el-menu :default-active="EvaluationTimeTypeEnum" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
    </el-menu>
    <el-form v-if="EvaluationTimeTypeEnum=='OtherTime'" class="t-form-block" ref="form" :model="conditionForm" inline label-width="90px" size="small">
      <el-form-item label="开始时间" prop="StartTime">
        <el-date-picker v-model="conditionForm.StartTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="EndTime">
        <el-date-picker v-model="conditionForm.EndTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <bar-graph height="400px" :sourceData="sourceData" yName="报名人数" title="报名分析" @xClick="ratio"></bar-graph>

  <!-- 项目学历和学生来源占比 -->
  <charts-dialog :title="programName" :dataForm="infoChartsdata" :visible.sync="dialogVisible"></charts-dialog>

</el-card>
</template>
<script>
import barGraph from '@/components/bar-multiple-graph'
// import circularGraph from '@/components/circular-graph'
import chartsDialog from './registration-analysis-charts-dialog'
import {
  getRegistrationAnalysisBar, getRegistrationAnalysisRatio
} from '@/server/statistical-module'
export default {
  components: {barGraph, chartsDialog},
  data () {
    return {
      style: '',
      EvaluationTimeTypeEnum: 'Month', // 默认评价时间类型
      btns: [
        // {type: 'All',name: '全部'},
        {type: 'Today', name: '今日'},
        {type: 'Yesterday', name: '昨日'},
        {type: 'Week', name: '本周'},
        {type: 'Month', name: '本月'},
        {type: 'OtherTime', name: '其他时间'}
      ],
      conditionForm: {},
      // -----------------------------报名分析柱状图---------------------------
      initialArr: [], // 原始数据
      sourceData: [ // 多柱状图数据
        ['product', '招生计划', '报名', '录取']
      ],
      programIds: [],
      // -----------------------------项目学历和学生来源占比---------------------------
      infoChartsdata: {},
      dialogVisible: false,
      programName: ''
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getRegistrationAnalysisBar()
    // this._getRegistrationAnalysisRatio();
  },
  methods: {
    /* ------------------------------------------查询------------------------------- */
    query () {
      if (this.EvaluationTimeTypeEnum === 'OtherTime' && this.conditionForm.StartTime > this.conditionForm.EndTime) {
        this.$alert('开始时间不得大于结束时间')
        return
      }
      this._getRegistrationAnalysisBar()
    },
    _getRegistrationAnalysisBar () { // 获取报名分析柱状图表
      let data = {
        FilterFilterEnum: this.EvaluationTimeTypeEnum,
        StartTime: this.EvaluationTimeTypeEnum === 'OtherTime' ? this.conditionForm.StartTime : null,
        EndTime: this.EvaluationTimeTypeEnum === 'OtherTime' ? this.conditionForm.EndTime : null
      }
      this.sourceData = [
        ['product', '招生计划', '报名', '录取']
      ]
      // sourceData: [
      //   ['product', '招生计划', '报名', '录取'],
      //   ['2019农名工培训', 43.3, 85.8, 93.7],
      //   ['面点师培训', 83.1, 73.4, 55.1],
      //   ['社区养老培训', 86.4, 65.2, 82.5],
      //   ['Walnut Brownie', 72.4, 53.9, 39.1]
      // ]
      this.programIds = []
      getRegistrationAnalysisBar(data).then(result => {
        this.initialArr = result
        result.forEach(item => {
          let arr = []
          arr.push(item.trainingProgramName, item.plan, item.apply, item.admission)
          this.sourceData.push(arr)
          this.programIds.push(item.trainingProgramId)
        })
      })
    },
    _getRegistrationAnalysisRatio (programId) {
      let data = {
        FilterFilterEnum: this.EvaluationTimeTypeEnum,
        StartTime: this.EvaluationTimeTypeEnum === 'OtherTime' ? this.conditionForm.StartTime : null,
        EndTime: this.EvaluationTimeTypeEnum === 'OtherTime' ? this.conditionForm.EndTime : null,
        TrainingProgramId: programId
      }
      getRegistrationAnalysisRatio(data).then(result => {
        this.infoChartsdata = Object.assign({}, result)
      })
    },
    /* ------------------------------------------操作------------------------------- */
    ratio (index) {
      // console.log(this.programIds[index]);  // 根据x轴下标，获取项目id
      this.programName = this.initialArr.find(item => { // 根据项目id，获取项目名称
        return item.trainingProgramId === this.programIds[index]
      }).trainingProgramName
      this._getRegistrationAnalysisRatio(this.programIds[index])

      this.dialogVisible = true
    },
    handleSelect (key, keyPath) { // 查询列表
      // console.log(key, keyPath);
      this.EvaluationTimeTypeEnum = key
      if (this.EvaluationTimeTypeEnum === 'OtherTime') {
        return
      }
      this._getRegistrationAnalysisBar()
      this._getRegistrationAnalysisRatio()
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
</style>
