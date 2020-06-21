<template>
<div>
  <!-- 直播费用流水 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>费用流水</span>
    </div>
    <div class="dateGroup">
      <span style="line-height:30px;">统计时间：</span>
      <el-menu :default-active="EvaluationTimeTypeEnum" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="直播费用流水" name="chargesData">
        <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width:100%;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="examName" sortable label="日期" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.examName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="examName" label="直播号" align="center"></el-table-column>
          <el-table-column prop="examName" label="直播标题" align="center"></el-table-column>
          <el-table-column prop="examName" label="消耗流量（G）" align="center"></el-table-column>
          <el-table-column prop="examName" label="参与人数" align="center"></el-table-column>
          <el-table-column prop="examName" label="直播时长（分钟）" align="center"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="viewDetails(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="直播费用趋势" name="chargesGraph">
        <!-- <line-graph height = "400px" ref = "TimeLineGraph" v-if = "flag" :sourceData = "sourceDataTimeAnalysis" :legend = "legendTimeAnalysis" :xData = "xDataTimeAnalysis"></line-graph> -->
      </el-tab-pane>
    </el-tabs>
    <!-- 直播统计 -->
    <analysis-list :dataForm = "analysisFrom" :visible.sync = "analysisVisible"></analysis-list>
  </el-card>
</div>
</template>
<script>
import analysisList from '../../../onlineLearningSystem/liveTeaching-management/liveTeaching-analysis/liveTeaching-analysis-list'
import lineGraph from '@/components/line-graph'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
export default {
  components: {pagination, analysisList, lineGraph},
  data () {
    return {
      style: '',
      activeName: 'chargesData',
      // 时间查询
      EvaluationTimeTypeEnum: 'All', // 默认评价时间类型
      btns: [
        {type: 'All', name: '全部'},
        {type: 'Today', name: '今日'},
        {type: 'Yesterday', name: '昨日'},
        {type: 'Week', name: '本周'},
        {type: 'Month', name: '本月'},
        {type: 'CustomDate', name: '其他时间'}
      ],
      // ------------- 费用明细表格 ------------
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [
        {id: 1}
      ],
      // 直播统计
      analysisVisible: false,
      analysisFrom: {},
      // 直播费用趋势
      sourceDataTimeAnalysis: [
        {
          name: '访问次数',
          type: 'line',
          yAxisIndex: 0,
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name: '观众数量',
          type: 'line',
          yAxisIndex: 1,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: '观看分钟数',
          type: 'line',
          yAxisIndex: 2,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ],
      legendTimeAnalysis: [
        '观看分钟数',
        '访问次数',
        '观众数量'
      ],
      xDataTimeAnalysis: [
        '10:00:10',
        '10:30:20',
        '11:00:00',
        '11:10:350'
      ],
      sourceData: [],
      flag: true
    }
  },
  watch: {
    activeName (newVal) {
      if (newVal) {
        if (newVal === 'chargesData') {
          // 直播费用流水
        } else {
          // 直播费用趋势
        }        
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.activeName = 'chargesData'
  },
  methods: {
    /* ------------------------------------ 查询数据 -------------------------- */
    /* *接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    queryList () {
      this.initialData(this.SkipCount, this.pageSize)
    },
    // 费用列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      // let data = {
      //   SkipCount: SkipCount,
      //   MaxResultCount: pageSize,
      //   ExamName: this.conditionForm.ExamName
      // }
      // if (this.conditionForm.AcademicYearId) {
      //   this.$set(data, 'AcademicYearId', this.conditionForm.AcademicYearId)
      // }
      // if (this.conditionForm.SemesterId) {
      //   this.$set(data, 'SemesterId', this.conditionForm.SemesterId)
      // }
      // getExaminationArrangeListsHasArrangeInfo(data).then(result => {
      //   this.tableData = result.items
      //   this.total = result.totalCount
      // })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    handleSelect (key, keyPath) {
      // console.log(key, keyPath);
      this.EvaluationTimeTypeEnum = key
      // this.initDataList();
    },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    // 查看详情
    viewDetails (row) {
      this.analysisFrom = {
        id: row.id,
        anchor: row.anchor,
        title: row.title,
        liveRoomType: row.liveRoomType,
        liveRoomStatus: row.liveRoomStatus
      }
      this.analysisVisible = true

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
