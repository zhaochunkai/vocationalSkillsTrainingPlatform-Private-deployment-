<template>
<div>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="在线学习考勤" name="onlineLearning">
      <div class="t-header-title">
        <span>在线学习考勤统计</span>
      </div>
      <el-table class="t-table-list" ref="onlineLearningTable" stripe size="small" :data="onlineLearningData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="semesterName" label="学期" align="center"></el-table-column>
        <el-table-column prop="trainingProgramName" label="学习项目" align="center"></el-table-column>
        <el-table-column prop="className" label="班级" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
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
      <el-table class="t-table-list" ref="onlineLearningDetailsTable" stripe size="small" :data="onlineLearningDetailData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="semesterName" label="学年学期"></el-table-column>
        <el-table-column prop="trainingProgramName" label="学习项目"></el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column prop="courseName" label="课程" width="120"></el-table-column>
        <el-table-column prop="attendanceDate" label="考勤日期">
          <template slot-scope="scope">
            {{scope.row.attendanceDate?new Date(scope.row.attendanceDate).toLocaleDateString(): ''}}
          </template>
        </el-table-column>
        <el-table-column prop="pointInTimeName" label="节次" width="120">
          <template slot-scope="scope">
            {{`${scope.row.pointInTimeName} ${scope.row.section}`}}
          </template>
        </el-table-column>
        <el-table-column prop="attendanceStatus" label="考勤状态" width="90"></el-table-column>
        <el-table-column prop="attendanceType" label="考勤方式" width="90"></el-table-column>
        <el-table-column prop="birthday" label="操作时间">
          <template slot-scope="scope">
            {{scope.row.attendanceTime?new Date(scope.row.attendanceTime).toLocaleDateString(): ''}}
          </template>
        </el-table-column>
        <el-table-column prop="executor" label="操作人" width="90"></el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="t-operate-footer">
        <pagination :total="onlineLearningDetailTotal" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="直播学习考勤" name="livingTeaching">
      <div class="t-header-title">
        <span>直播考勤统计</span>
      </div>
      <el-table class="t-table-list" ref="livingTeachingTable" stripe size="small" :data="livingTeachingData" show-summary tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="projectName" label="学习项目" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
        <el-table-column prop="totalTimeInt" label="累计学时" align="center"></el-table-column>
        <el-table-column prop="should" label="应参加（次）" align="center"></el-table-column>
        <el-table-column prop="actual" label="实际参加（次）" align="center"></el-table-column>
        <el-table-column prop="beLate" label="迟到（次）" align="center"></el-table-column>
      </el-table>
      <div class="t-header-title">
        <span>直播学习记录</span>
      </div>
      <el-table class="t-table-list" ref="livingTeachingDetailsTable" stripe size="small" :data="livingTeachingDetailData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="title" label="直播名称"></el-table-column>
        <el-table-column prop="courseName" label="课程"></el-table-column>
        <el-table-column prop="liveTime" label="直播时长"></el-table-column>
        <el-table-column prop="firstEnterTime" label="第一次进入时间">
          <template slot-scope="scope">
            <span v-if="scope.row.firstEnterTime">{{new Date(scope.row.firstEnterTime) | formatAllDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastLeaveTime" label="最后一次退出时间">
          <template slot-scope="scope">
            <span v-if="scope.row.lastLeaveTime">{{new Date(scope.row.lastLeaveTime) | formatAllDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="learning" label="观看时长" width="90"></el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="t-operate-footer">
        <pagination :total="livingTeachingDetailTotal" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
      </div>
    </el-tab-pane>
    <!-- 到课率统计 -->
    <!-- <el-tab-pane label="到课率统计" name="attendanceRate">
      <attendance-rate :courseList="courseList"></attendance-rate>
    </el-tab-pane> -->
  </el-tabs>
</div>
</template>
<script>
import { getAttendanceStatisticByStudentId, getAttendanceItemByStudentId, getLivingCheckInHistoryStatistic, getLivingCheckInHistoryItems } from '@/server/studentProfile-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import faceAttendanceDetails from '@/components/faceAttendance-details.vue'
import attendanceRate from './attendance-rate'
export default {
  props: ['dataForm', 'courseList', 'checkedTabName'],
  components: { pagination, faceAttendanceDetails, attendanceRate },
  data () {
    return {
      activeName: 'onlineLearning',
      // 在线学习考勤
      onlineLearningData: [],
      pageSizes,
      pageSize,
      onlineLearningDetailTotal: 0,
      onlineLearningDetailData: [],
      // 直播学习考勤
      livingTeachingData: [],
      livingTeachingDetailTotal: 0,
      livingTeachingDetailData: []
    }
  },
  watch: {
    activeName (newVal) {
      if (this.checkedTabName === 'attendance') {
        if (newVal === 'onlineLearning') {
          this._getAttendanceStatisticByStudentId()
          this._getAttendanceItemByStudentId()
        } else if (newVal === 'livingTeaching') {
          this._getLivingCheckInHistoryStatistic()
          this._getLivingCheckInHistoryItems()
        }
      }
    }
  },
  methods: {
    // ------------------------------------ 查询-分页组件 -----------------------------------
    /* *接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      if (this.onlineLearning === 'onlineLearning') {
        this._getAttendanceItemByStudentId(SkipCount, pageSize)
      } else if (this.onlineLearning === 'livingTeaching') {
        this._getLivingCheckInHistoryItems(SkipCount, pageSize)
      }
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      // as
    },
    // ------------------------------------ 查询-在线学习考勤 -----------------------------------
    // 获取学生考勤统计
    _getAttendanceStatisticByStudentId () {
      let data = {
        studentId: this.dataForm.studentId,
        trainingProgramId: this.dataForm.programId
      }
      getAttendanceStatisticByStudentId(data).then(res => {
        this.onlineLearningData = res
      })
    },
    // 获取学生考勤详情
    _getAttendanceItemByStudentId (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        studentId: this.dataForm.studentId,
        trainingProgramId: this.dataForm.programId
      }
      getAttendanceItemByStudentId(data).then(res => {
        this.onlineLearningDetailData = res.items
        this.onlineLearningDetailTotal = res.totalCount
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    onlineLearningQueryList () {
      this._getAttendanceItemByStudentId()
    },
    // ------------------------------------ 查询-直播学习考勤 -----------------------------------
    // 获取直播考勤统计
    _getLivingCheckInHistoryStatistic () {
      let data = {
        studentId: this.dataForm.studentId,
        trainingProgramId: this.dataForm.programId
      }
      // if (this.courseId) {
      //   this.$set(data, 'courseId', this.courseId)
      // }
      getLivingCheckInHistoryStatistic(data).then(res => {
        this.livingTeachingData = res
      })
    },
    // 获取直播学习记录
    _getLivingCheckInHistoryItems (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        studentId: this.dataForm.studentId,
        trainingProgramId: this.dataForm.programId
      }
      // if (this.courseId) {
      //   this.$set(data, 'courseId', this.courseId)
      // }
      getLivingCheckInHistoryItems(data).then(res => {
        this.livingTeachingDetailData = res.items
        this.livingTeachingDetailTotal = res.totalCount
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // ------------------------------------ 操作 -----------------------------------

  }
}
</script>
<style lang="less" scoped>

</style>
