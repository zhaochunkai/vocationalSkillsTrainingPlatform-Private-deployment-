<template>
<div>
  <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
    <el-tab-pane label="在线学习考勤" name="onlineLearning">
      <div class="t-header-title">
        <span>在线学习考勤统计</span>
      </div>

      <el-table class="t-table-list" ref="onlineLearningTable" stripe size="small" :data="onlineLearningData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="semesterName" label="学期名称" align="center"></el-table-column>
        <el-table-column prop="trainingProgramName" label="学习项目名称" align="center"></el-table-column>
        <el-table-column prop="className" label="班级名称" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" align="center"></el-table-column>
        <el-table-column prop="should" label="应到" width="80" align="center"></el-table-column>
        <el-table-column prop="leave" label="请假" width="80" align="center"></el-table-column>
        <el-table-column prop="beLate" label="迟到" width="80" align="center"></el-table-column>
        <el-table-column prop="absent" label="缺席" width="80" align="center"></el-table-column>
        <el-table-column prop="leaveEarly" label="早退" width="80" align="center"></el-table-column>
        <el-table-column prop="onTime" label="按时到" width="80" align="center"></el-table-column>
      </el-table>
      <div class="t-header-title">
        <span>考勤记录</span>
      </div>      
    </el-tab-pane>
    <el-tab-pane label="直播学习考勤" name="livingTeaching">直播学习考勤</el-tab-pane>
    <el-tab-pane label="到课率统计" name="attendanceRate">到课率统计</el-tab-pane>
  </el-tabs>
</div>
</template>
<script>
import { getAttendanceStatisticByStudentId } from '@/server/studentProfile-module'
export default {
  props: ['studentId', 'trainingProgramId'],
  data () {
    return {
      activeName: 'onlineLearning',
      onlineLearningData: []
    }
  },
  watch: {
    activeName (newVal) {
      if (newVal) {
        if (newVal === 'onlineLearning') {
          this._getAttendanceStatisticByStudentId()
        }
      }
    }
  },
  created () {
    if (this.onlineLearningData.length === 0 && this.activeName === 'onlineLearning') {
      this._getAttendanceStatisticByStudentId()
    }
  },
  methods: {
    // ------------------------------------ 查询 -----------------------------------
    _getAttendanceStatisticByStudentId () {
      if (this.studentId && this.trainingProgramId) {
        let data = {
          studentId: this.studentId,
          trainingProgramId: this.trainingProgramId
        }
        getAttendanceStatisticByStudentId(data).then(res => {
          this.onlineLearningData = res
        })
      }
    },
    // ------------------------------------ 操作 -----------------------------------
    handleClick (tab, event) { }

  }
}
</script>
<style lang="less" scoped>

</style>