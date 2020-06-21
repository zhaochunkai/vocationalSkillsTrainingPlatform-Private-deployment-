
<template>
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>班级学生列表</span>
  </div>
  <!-- 查询 -->
  <el-form :inline="true" size="small" label-width="150px">
    <el-form-item >
      <el-button size="small" @click="close">返回</el-button>
    </el-form-item>
    <el-form-item label="选择班级">
      <el-select v-model="classId" filterable placeholder="请选择班级">
        <el-option v-for="(item,i) of classLists" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <el-row :gutter="20">
    <el-col :span="12">
      <div class="t-header-title">
        <span>学生列表</span>
      </div>
      <!-- 查询 -->
      <!-- <el-form class="t-form-block" v-model="conditionForm" ref="form" label-width="80px" size="small" inline>
        <el-form-item label="准考证号">
          <el-input v-model="conditionForm.candidateNo"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="type">
          <el-input v-model="conditionForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>      -->
      <!-- 表格 -->
      <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="candidateNo" label="准考证号"></el-table-column>
        <el-table-column prop="idCard" label="身份证号码"></el-table-column>
        <el-table-column prop="tel" label="手机号"></el-table-column>
        <el-table-column  fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="viewPaper(scope.row)">查看试卷</el-button> -->
          </template>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="viewRecords(scope.row)">查看考试记录<i class="el-icon-d-arrow-right"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="t-operate-footer">
        <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
      </div>
    </el-col>
    <el-col :span="12" v-if="recordShow">
      <el-card>
        <div slot="header" class="t-box-card-header">
          <span>考试记录</span>
        </div>
        <el-table class="t-table-list" ref="recordTable" size="small" :data="recordList" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="examName" sortable label="考试名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="candidateNo" label="试卷名称"></el-table-column>
          <el-table-column prop="courseId" label="课程名称"></el-table-column>
          <el-table-column prop="candidateNo" label="准考证号"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="viewPaper(scope.row)">查看试卷</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
  <!-- 学生试卷 -->
  <student-paper :dataForm="editForm" :visible.sync="paperVisible"></student-paper>
  <!-- 学生档案 -->
  <student-profile :dataForm="editForm" :visible.sync="profileVisible"></student-profile>
</el-card>
</template>
<script>
import {
  GetTeacherWithClass,
  GetStudentInfoByClassId,
  GetExamPaperRecord
} from '@/server/examination-module'
import orgTree from '@/components/orgTree.vue'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import studentPaper from './marking-paper-student-exam'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
export default {
  components: {orgTree, pagination, studentPaper, studentProfile},
  data () {
    return {
      style: '',
      style2: '',
      queryDate: {},
      // -----
      classId: null,
      classLists: [], // 班级列表
      // -------------树
      TreeData: [],
      nodeSelect: {},
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      // -------------学生列表------------
      conditionForm: {},
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      // -------------考试记录列表------------
      recordList: [],
      recordShow: false,
      // -------------编辑------------
      editForm: {},
      paperVisible: false,
      profileVisible: false
    }
  },
  watch: {
    classId (newVal) {
      if (newVal) {
        this.initialData() // 获取学生列表
        this.recordList = []
        this.recordShow = false
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.style2 = `height:${document.body.clientHeight - 290}px;overflow:scroll;`
    this.queryDate = this.$route.query
    // 获取老师所教授班级
    this._GetTeacherWithClass()
  },
  methods: {
    // -------------------------------------查询-------------------------------------
    _GetTeacherWithClass () { // 获取老师所教授班级
      GetTeacherWithClass(this.queryDate.id).then(res => {
        this.classLists = res
        if (res && res.length > 0) {
          this.classId = res[0].id
        }
      })
    },
    /* 接收改变后每页多少条 */
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
    // 获取学生列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        classId: this.classId
      }
      GetStudentInfoByClassId(data).then(result => {
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
    // 获取学生考试记录
    _GetExamPaperRecord (row) {
      let data = {
        ClassId: this.classId,
        Tel: row.tel,
        ExaminationArrangeId: this.queryDate.id
      }
      GetExamPaperRecord(data).then(res => {
        this.recordList = res.items
        this.recordShow = true
      })
    },
    /* ------------------------------------ 操作 -------------------------- */
    viewStudents (row) { // 查看右侧的学生列表
      this.classId = row.id
      this.initialData()
    },
    viewRecords (row) { // 查看学生的考试记录
      this._GetExamPaperRecord(row)
    },
    viewPaper (row) { // 查看试卷
      this.editForm = row
      this.paperVisible = true
    },
    exportFile () {},
    // 跳转至学生档案模块
    // toInfomationPage(row) {
    //   this.editForm = {
    //     studentId: row.id,
    //     name: row.name,
    //     programId: this.nodeId
    //   }
    //   this.profileVisible = true
    // },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      this.nodeLevel = node.level
      if (node.level === '课程') {
        this.initialData()
      }
    },
    edit (row) {
      let data = row || {}
      this.editForm = data
      this.paperVisible = true
    },
    // drawPaper(row) {  //
    //   let data=row || {};
    //   if (data) {
    //     this.$set(this.paperForm,'id',data.id);
    //   }
    //   this.paperVisible=true;
    // },
    close () {
      this.$router.push({path: '/marking/paper/list'})
    }
  }
}
</script>
