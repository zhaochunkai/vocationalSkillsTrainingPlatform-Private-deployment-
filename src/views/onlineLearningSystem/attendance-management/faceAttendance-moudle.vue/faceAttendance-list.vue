<template>
<div>
  <!-- 人脸识别考勤 -->
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <el-tree :data="treeData" ref="tree" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-card :style="style" v-if="classId">
        <div slot="header" class="t-box-card-header">
          <span>【{{currentNode.label}}】 人脸考勤列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="课程">
            <el-select v-model="conditionForm.courseId" clearable placeholder="选择课程">
              <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="conditionForm.name"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="conditionForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="conditionForm.idCard"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="conditionForm.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="conditionForm.endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <el-button type="primary" size="mini">导出</el-button>
        </div>
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名">
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="性别"></el-table-column>
          <el-table-column prop="tel" label="手机号"></el-table-column>
          <el-table-column prop="idCard" label="身份证号"></el-table-column>
          <el-table-column prop="education" label="学历"></el-table-column>
          <el-table-column prop="courseName" label="课程"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addEdit(scope.row,true)">查看考勤</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 弹出层：查看考勤信息 -->
  <face-attendance-details type="learning" :dataForm="CheckInForm" :visible.sync="faceCheckInVisible"></face-attendance-details>
  <!-- 学生档案 -->
  <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
</div>
</template>
<script>
import { getGradeTree } from '@/server/basic-module.js'
import { getTrainingProgramsBindCourse } from '@/server/training-module'
import { getFaceAttendanceRecordList } from '@/server/online-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import faceAttendanceDetails from '@/components/faceAttendance-details.vue'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
export default {
  components: {pagination, faceAttendanceDetails, studentProfile},
  data () {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      style: '',
      total: 0,
      operate: false,
      // 检索
      courseList: [], // 课程列表
      conditionForm: {},
      // 表格
      tableData: [],
      isSelectAll: false,
      faceCheckInVisible: false,
      CheckInForm: {},
      courseName: '',
      // 项目班级树
      treeData: [],
      currentNode: {}, // 当前班级节点
      parentNode: {}, // 当前班级父节点，即项目节点
      classId: '',
      addEditForm: {},
      profileVisible: false
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getGradeTree()
  },
  watch: {
    classId (newVal) {
      if (newVal) {
        this.courseList = []
        this.tableData = []
        this.$set(this.conditionForm, 'courseId', '')
        this.courseName = ''
        this._getTrainingProgramsBindCourse()
        this.initDataList()
      }
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <el-button style="color:#666;font-size:13px;" type="text" title={node.label} on-click={() => this.getNode(node)}>{node.label}</el-button>
        </span>
      )
    },
    /* ------------------------------- 查询 ------------------------------- */
    // 获取班级树
    _getGradeTree () {
      this.treeData = []
      getGradeTree({state: '3,4'}).then(result => { // 查询状态为 3-培训中心 4-已结束状态的项目班级树
        for (let i = result.children.length - 1; i >= 0; i--) {
          let item = result.children[i]
          if (item.children.length === 0) {
            result.children.splice(i, 1)
          }
        }
        this.treeData.push(result)
      })
    },
    _getTrainingProgramsBindCourse () { // 根据项目id查询课程
      this.courseList = []
      getTrainingProgramsBindCourse(this.parentNode.id).then(result => {
        this.courseList = result
        // if (result && result.length>0) { // 默认选择第一个课程
        //   this.$set(this.conditionForm,'courseId',result[0].id)
        // }
      })
    },
    /* 接收改变后每页多少条 */
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
        MaxResultCount: pageSize,
        Name: this.conditionForm.name,
        Tel: this.conditionForm.tel,
        IdCard: this.conditionForm.idCard,
        StartTime: this.conditionForm.startTime,
        EndTime: this.conditionForm.endTime,
        courseId: this.conditionForm.courseId,
        trainingProgramsId: this.parentNode.id,
        classId: this.classId
      }
      getFaceAttendanceRecordList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
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
    /* ------------------------------- 操作 ------------------------------- */
    toInfomationPage (row) { // 跳转至学生档案模块
      this.addEditForm = {
        studentId: row.id, // 学生id
        name: row.name, // 学生姓名
        programId: this.nodeId // 项目id
      }
      this.profileVisible = true
    },
    /* 选择的班级 */
    getNode (node) {
      this.classId = ''
      this.currentNode = node.data
      if (this.currentNode.level === '班级') {
        this.classId = this.currentNode.id
        this.parentNode = node.parent.data
      }
    },
    addEdit (row, operate) {
      this.CheckInForm = {
        id: row.id, // 考勤记录id
        name: row.name, // 学生姓名
        courseName: row.courseName // 课程名称
      }
      this.faceCheckInVisible = true
      this.operate = operate
    }
  }
}
</script>
