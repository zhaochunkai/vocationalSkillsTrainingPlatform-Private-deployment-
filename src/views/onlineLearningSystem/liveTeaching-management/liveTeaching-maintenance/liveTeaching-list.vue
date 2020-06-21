<template>
<div>
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>直播列表</span>
    </div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="学习项目" prop="trainingProgramId">
        <el-select v-model="conditionForm.trainingProgramId" filterable clearable>
          <el-option v-for="(item, i) of programs" :key="i" :label="item.projectName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学习课程" prop="courseId" v-if="conditionForm.trainingProgramId">
        <el-select v-model="conditionForm.courseId" filterable clearable >
          <el-option v-for="(item, i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="直播讲师" prop="anchorId" >
        <el-input v-model="teacherName" @focus="chooseJKTeacher">
          <el-button slot="append" size="small" @click="clearJK">清空已选老师</el-button>
        </el-input>
        <tree-transfer :visible.sync="showTeachers" TreeType="user" title="选择直播教师" :alias="alias" :chooseValue="ZBTeacherIds" :isMultiple="false" @saveTransfer="getNewTransfer"></tree-transfer>
      </el-form-item>
      <el-form-item>
         <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
      <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
      <el-tag type="danger" style="color:#f00;">请注意：直播开始后，推流地址有效期为30分钟，超时后推流地址将失效！！！</el-tag>
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top: 10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="roomNumber" label="直播号"></el-table-column>
      <el-table-column prop="title" label="直播标题" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" style="color: #00f" @click="toInfomationPage(scope.row)">{{scope.row.title}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="liveRoomType" label="直播类型" width="80"></el-table-column>
      <el-table-column prop="trainingProgram" label="学习项目"></el-table-column>
      <el-table-column prop="course" label="课程"></el-table-column>
      <el-table-column prop="anchor" label="直播讲师" width="90"></el-table-column>
      <el-table-column prop="planStartTime" label="计划开始时间">
        <template slot-scope="scope">
          {{new Date(scope.row.planStartTime) | formatAllDate}}
        </template>
      </el-table-column>
      <el-table-column prop="section" label="直播人数" width="80"></el-table-column>
      <el-table-column prop="liveRoomStatus" label="状态" width="70"></el-table-column>
      <el-table-column  fixed="right" label="操作" width="280" align="right">
        <template slot-scope="scope" slot="header">
          <div style="text-align: center;">操作</div>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.liveRoomStatus == '准备就绪'">
            <el-button type="text" size="small" @click="addEdit(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="start(scope.row)">开始直播</el-button>
          </span>
          <el-button type="primary" size="mini" @click="stop(scope.row)" v-if="scope.row.liveRoomStatus == '直播中'">停止直播</el-button>
          <el-button type="danger" size="mini" @click="toAnalysisPage(scope.row)">直播统计</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </el-card>
  <!-- 弹出层：新增/编辑直播信息 -->
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @updateQuery="queryList" :operate="operate"></add-edit>
  <!-- 直播统计 -->
  <analysis-list :dataForm="analysisFrom" :visible.sync="analysisVisible"></analysis-list>
  <!-- 直播详情 -->
  <liveTeaching-info :dataForm="addEditForm" :visible.sync="infoVisible"></liveTeaching-info>
</div>
</template>
<script>
import { getIdentityUserList } from '@/server/identity-module'
import { getLiveRoomList, StartLiveRoomById, StopLiveRoomById, deleteLiveRoomById } from '@/server/online-module'
import { getTrainingProgramsList, getTrainingProgramsBindCourse } from '@/server/training-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import treeTransfer from '@/components/tree-transfer-dialog'
import addEdit from './liveTeaching-edit'
import liveTeachingInfo from './liveTeaching-infomation'
import analysisList from '../liveTeaching-analysis/liveTeaching-analysis-list'
export default {
  data () {
    return {
      style: '',
      SemesterList: [],
      // ---查询条件
      programs: [], // 项目列表
      courseList: [], // 课程列表
      teacherName: '',
      showTeachers: false,
      ZBTeacherIds: [], // 已选择的老师
      userLists: [], // 获取所有用户列表
      alias: {key: 'id', label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      // ------------列表
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      conditionForm: {},
      tableData: [],
      isSelectAll: false,
      // ------------新增|编辑
      operate: false,
      addEditVisible: false,
      addEditForm: {},
      // 直播详情
      infoVisible: false,
      // 直播统计
      analysisVisible: false,
      analysisFrom: {}
    }
  },
  components: {pagination, addEdit, treeTransfer, analysisList, liveTeachingInfo},
  activated () {
    this.conditionForm = {}
    this.style = `height: ${document.body.clientHeight - 200}px;overflow: scroll;`
    this._getTrainingProgramsList()
    this._getIdentityUserList()
    this.initDataList()
  },
  watch: {
    'conditionForm.trainingProgramId' (newVal) {
      if (newVal) {
        this.$set(this.conditionForm, 'courseId', '')
        this._getTrainingProgramsBindCourse()
      }
    }
  },
  methods: {
    /* ----------------------------------------查询----------------------------------- */
    _getTrainingProgramsList () { // 状态为“3-培训中”的项目
      let data = {
        SkipCount: 0,
        MaxResultCount: 200
        // Status: 3
      }
      getTrainingProgramsList(data).then(result => {
        this.programs = result.items
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    _getTrainingProgramsBindCourse () { // 根据项目id查询课程
      this.courseList = []
      getTrainingProgramsBindCourse(this.conditionForm.trainingProgramId).then(result => {
        this.courseList = result
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    _getIdentityUserList (SkipCount = 0) { // 获取用户列表
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: 400
      }
      getIdentityUserList(data).then(result => {
        this.userLists = result.items
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
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    // 根据项目id获取报名列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      if (this.conditionForm.anchorId) {
        data.anchorId = this.conditionForm.anchorId
      }
      if (this.conditionForm.courseId) {
        data.courseId = this.conditionForm.courseId
      }
      if (this.conditionForm.trainingProgramId) {
        data.trainingProgramId = this.conditionForm.trainingProgramId
      }
      getLiveRoomList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    }, 
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    /* ----------------------------------------操作----------------------------------- */
    chooseJKTeacher () {
      this.showTeachers = true
    },
    clearJK () { // 清空已选监考老师
      this.teacherName = ''
      this.ZBTeacherIds = []
      this.$set(this.conditionForm, 'anchorId', '')
    },
    getNewTransfer (ids, nodeName) { // 获取穿梭框中的最新数据
      this.$set(this.conditionForm, 'anchorId', ids[0])
      this.ZBTeacherIds = ids
      this.userLists.forEach(item => {
        if (ids.indexOf(item.id) !== -1) {
          this.teacherName += `${item.name} `
        }
      })
    },
    toInfomationPage (row) { // 直播信息
      this.addEditForm = row
      this.infoVisible = true
      // this.$router.push({path: '/liveTeaching/infomation', query: {id: row.id}})
    },
    toAnalysisPage (row) { // 直播统计
      this.analysisFrom = {
        id: row.id,
        anchor: row.anchor,
        title: row.title,
        liveRoomType: row.liveRoomType,
        liveRoomStatus: row.liveRoomStatus
      }
      this.analysisVisible = true
    },
    start (row) { // 开始直播
      this.$confirm(`此操作将开始选中的 【${row.title}】直播， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StartLiveRoomById(row.id).then(() => {
          this.queryList()
          this.$message.success('消息推送成功！')
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    stop (row) { // 结束直播
      this.$confirm(`此操作将停止选中的 【${row.title}】直播， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StopLiveRoomById(row.id).then(() => {
          this.queryList()
          this.$message.success('停止成功！')
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    addEdit (row) { // 新增|编辑
      this.addEditForm = row || {}
      this.addEditVisible = true
    },
    del (data) { // 删除
      let row = data || this.multipleSelection[0]
      this.$confirm(`此操作将删除选中的 【${row.title}】直播， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLiveRoomById(row.id).then(() => {
          this.initDataList()
          this.$refs.pagination.currentPage = 1
          this.$message.success('数据删除成功！')
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
  },
}
</script>
