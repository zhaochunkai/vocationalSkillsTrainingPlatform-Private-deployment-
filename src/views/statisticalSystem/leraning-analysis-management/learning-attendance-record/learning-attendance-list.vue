
<template>
  <div>
  <el-card :style="style">
    <div slot="header">
      <span>到课率分析</span>
    </div>
    <!-- 查询条件 -->
    <el-form :inline="true" :model="queryForm" class="t-operate-filter" size="small">
      <!-- 查询项目 -->
      <el-form-item label="培训项目">
          <el-select v-model="queryForm.trainingProgramId" filterable remote reserve-keyword placeholder="请选择培训项目" :remote-method="_getTrainingProgramsPullDown" :loading="resourceloading">
            <el-option v-for="item in resourceTree" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      <!-- 查询班级 -->
      <el-form-item label="班级">
        <el-select v-model="queryForm.classId" placeholder="班级">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 查询学习项目 -->
      <el-form-item label="学习课程">
        <el-select v-model="queryForm.courseId" placeholder="学习课程">
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 考勤类型 -->
      <el-form-item label="考勤类型">
        <el-select v-model="queryForm.attendance" placeholder="请选择查询直播或课堂">
          <el-option label="直播到课率" value="live"></el-option>
          <el-option label="课堂到课率" value="offline"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 选项卡 -->
    <el-tabs type="border-card"
        v-loading="loading"
        :element-loading-text="loadText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(250,250,250,0.9)">
      <!-- 个人 -->
      <el-tab-pane label="个人">
        <!-- 查询出来的结果 -->
        <!-- 表格 -->
        <el-table
          class="t-table-list"
          ref="multipleTable"
          stripe
          size="small"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="姓名" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color:#00f"
                @click="toStudentInfo(scope.row)"
              >{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="性别" width="100" align="center"></el-table-column>
          <el-table-column prop="tel" label="联系电话" width="120" align="center"></el-table-column>
          <el-table-column
          v-if="queryForm.attendance == 'offline'"
            prop="offlineArrivalRate"
            label="线下学习到课率"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.offlineArrivalRate}}
              <span v-if="scope.row.offlineArrivalRate">
                （
                应到数：{{scope.row.offlineShould}}
                <span
                  style="margin-left:10px;"
                >正常考勤数：{{scope.row.offlineNormal}}</span>
                ）
              </span>
            </template>
          </el-table-column>
          <el-table-column
          v-if="queryForm.attendance == 'live'"
            prop="liveArrivalRate"
            label="直播学习到课率"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.liveArrivalRate}}
              <span v-if="scope.row.liveArrivalRate">
                （
                应到数：{{scope.row.liveShould}}
                <span
                  style="margin-left:10px;"
                >正常考勤数：{{scope.row.liveNormal}}</span>
                ）
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
        <!-- 学生档案 -->
        <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
      </el-tab-pane>
      <el-tab-pane label="项目班级">
        <div class="left">
          <div class="text">线上学习</div>
          <ve-pie :data="offlineChartData" width="818px" height="500px"></ve-pie>
        </div>
        <div class="rigth">
          <div class="text">在线直播</div>
          <ve-pie :data="liveChartData" width="818px" height="500px"></ve-pie>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  </div>
</template>
<script>
import { GetLiveArrivalRateList, GetOfflineArrivalRateList, gitAttendancePie } from '@/server/statistical-module'
import { getClassList, getTrainingProgramsBindCourse, getTrainingProgramsPullDown } from '@/server/training-module'
import pagination from '@/components/pagination'
import orgTree from '@/components/orgTree'
import { pageSizes, pageSize } from '@/config.js'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
export default {
  components: { pagination, orgTree, studentProfile },
  data () {
    return {
      style: '',
      queryForm: {
        trainingProgramId: '',
        classId: '',
        courseId: '',
        attendance: ''
      },
      liveChartData: {
        columns: ['状态', '到课率'],
        rows: []
      },
      offlineChartData: {
        columns: ['状态', '到课率'],
        rows: []
      },
      // -------------所有项目------------
      resourceTree: [],
      classList: [],
      nodeSelect: {},
      // -------------检索------------
      trainingProgramId: '',
      programs: [],
      courseList: [],
      judgeTypeList: [
        { name: '全部', type: 'All' },
        { name: '线下学习', type: 'Offline' },
        { name: '直播学习', type: 'Live' }
      ],
      // -------------表格------------
      pageSizes,
      pageSize,
      total: 0,
      tableData: [],
      loading: true,
      loadText: '请选择项目!',
      // -------------编辑------------
      dataForm: {},
      studentVisible: false,
      // -------------学生档案------------
      addEditForm: {},
      profileVisible: false,
      gitAttendancePie: {},
      resourceloading: false
    }
  },
  watch: {
    'queryForm.trainingProgramId' (newVal) {
      this.$set(this.queryForm, 'courseId', '')
      this.$set(this.queryForm, 'classId', '')
      if (newVal) {
        this.loadText = '请选择课程和班级！'
        this._getClassList()
        this._getTrainingProgramsBindCourse()
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
    this._getTrainingProgramsPullDown()
    this.$set(this.queryForm, 'attendance', 'live')
    if (this.nodeSelect && JSON.stringify(this.nodeSelect) !== '{}') {
      this.foucsOnNode()
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <div class="custom-tree-node" style="width:100%">
          <div
            style="width:100%"
            title={node.label}
            on-click={() => this.getNode(node)}
          >
            {node.label}
          </div>
        </div>
      )
    },
    // -----------------------------------------查询-----------------------------------
    _getTrainingProgramsPullDown (e) {
      this.resourceTree = []
      this.resourceloading = true
      if (e === undefined) {
        e = ''
      }
      getTrainingProgramsPullDown({
        status: '3,4',
        name: e
      }).then(result => {
        this.resourceloading = false
        // 查询状态为3-培训中、4-已结束的项目
        this.resourceTree = result
      })
    },
    // 根据项目id获取班级列表
    _getClassList () {
      getClassList({
        tpId: this.queryForm.trainingProgramId
      }).then(res => {
        this.classList = []
        this.classList = res.items
      })
    },
    _getTrainingProgramsBindCourse () {
      // 根据项目id查询课程
      this.courseList = []
      getTrainingProgramsBindCourse(this.queryForm.trainingProgramId).then(result => {
        this.courseList = result
      })
    },
    // 查询
    onSubmit () {
      // 查询列表
      this.initialData()
      // 查询饼图
      this._gitAttendancePie()
    },
    /*  接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize)
    },
    // 获取个人考情记录列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      if (!this.queryForm.courseId) {
        this.$alert('请先选择课程！')
        return
      }
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ClassId: this.queryForm.classId,
        TrainingProgramsId: this.queryForm.trainingProgramId,
        CourseId: this.queryForm.courseId
      }
      this.loading = true
      this.loadText = '数据加载中...'
      // 线下到课率
      if (this.queryForm.attendance === 'live') {
        GetLiveArrivalRateList(data)
          .then(result => {
            console.log(result)
            this.tableData = result.items
            this.total = result.totalCount
            this.loading = false
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      }
      // 直播到课率
      if (this.queryForm.attendance === 'offline') {
        GetOfflineArrivalRateList(data)
          .then(result => {
            console.log(result)
            this.tableData = result.items
            this.total = result.totalCount
            this.loading = false
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      }
    },
    // 获取个人到课率饼图
    _gitAttendancePie () {
      let data = {
        ClassId: this.queryForm.classId,
        TrainingProgramsId: this.queryForm.trainingProgramId,
        CourseId: this.queryForm.courseId
      }
      gitAttendancePie(data).then(res => {
        console.log(res)
        if (res) {
          let liveChart = [
            { 状态: '正常', 到课率: res.live.normal },
            { 状态: '异常', 到课率: res.live.abnormal }
          ]
          let offlineChart = [
            { 状态: '正常', 到课率: res.offline.normal },
            { 状态: '异常', 到课率: res.offline.abnormal }
          ]
          this.$set(this.liveChartData, 'rows', liveChart)
          this.$set(this.offlineChartData, 'rows', offlineChart)
        }
        this.gitAttendancePie = res
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    format (percentage) {
      return `正确率${percentage}%`
    },
    foucsOnNode () {
      setTimeout(() => {
        this.$refs.tree.setCurrentNode(this.nodeSelect)
      }, 500)
    },
    toStudentInfo (row) {
      // 跳转至学生档案模块
      this.addEditForm = {
        studentId: row.studentId, // 学生id
        name: row.name, // 学生姓名
        programId: this.queryForm.trainingProgramId // 项目id
      }
      this.profileVisible = true
    }
    /* 选择的树节点 */
    // getNode (node) {
    //   this.nodeSelect = node.data
    //   if (node.data.level == '班级') {
    //     this.ClassId = node.data.id
    //     this.trainingProgramId = node.parent.data.id
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
.t-header-title span {
  font-size: 14px;
  width: 300px;
  text-align: left;
  padding-left: 10px;
}
.symbol {
  padding: 0 6px;
  //  display: inline-block;
  //  width:80px;
  //  text-align: center;
}
.left{
  width: 50%;
  height: ceil(100vh - 30px) !important;
  float: left;
  text-align: center;
}
.rigth{
  float: left;
  width: 50%;
  height: ceil(100vh - 30px) !important;
  float: left;
}
.text{
  text-align: center;
  margin: 20px auto;
  font-size: 14px;
  color: #666;
}
</style>
