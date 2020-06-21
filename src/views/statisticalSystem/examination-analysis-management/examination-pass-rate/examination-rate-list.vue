<template>
<div>
  <!-- 成绩查询 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>成绩查询</span>
      <el-tag type="danger" class="t-margin-left" style="color:#f00;">只统计正式考试的合格率！</el-tag>
    </div>
    <!-- 查询 -->
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="考试名称">
        <el-input class="input-append" v-model="conditionForm.ExamName" placeholder="请输入考试名称"></el-input>
      </el-form-item>
      <el-form-item label="学年" prop="AcademicYear">
        <el-select v-model="conditionForm.AcademicYearId" filterable clearable placeholder="请选择学年">
          <el-option v-for="(item,i) of AcademicYearData" :key="i" :label="item.academicYearName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学期" prop="SemesterId" v-if="conditionForm.AcademicYearId">
        <el-select v-model="conditionForm.SemesterId" filterable clearable>
          <el-option v-for="(item,i) of SemesterList" :key="i" :label="item.semesterName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width:100%;" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="examName" sortable label="考试名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.examName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="学年学期" width="160">
        <template slot-scope="scope">
          {{scope.row.academicYearName}} {{scope.row.semesterName}}
        </template>
      </el-table-column>
      <el-table-column prop="sponsorUnitName" label="考试主管单位" width="160"></el-table-column>
      <!-- <el-table-column prop="methodOfExamination" label="是否为补考" width="100"></el-table-column> -->
      <el-table-column prop="examinationTypeName" label="考试类别" width="100" align="center"></el-table-column>
      <el-table-column prop="methodOfExaminationName" label="考试方式" width="100" align="center"></el-table-column>
      <el-table-column prop="examinationStatusName" label="启用状态" width="80" align="center"></el-table-column>
      <el-table-column prop="flagExaminationInformation" label="考务信息" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.flagExaminationInformation?'已生成': '未生成'}}
        </template>
      </el-table-column>
      <el-table-column  fixed="right" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="viewPassRate(scope.row)">查询合格率</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <!-- 具体考试安排信息 -->
    <arrgent-info :dataForm="editForm" :visible.sync="arrangeInfoVisible"></arrgent-info>
    <!-- 成绩管理-班级课程列表 -->
    <rate-info :dataForm="editForm" :visible.sync="rateListVisible"></rate-info>

  </el-card>
</div>
</template>
<script>
import { getAcademicYearSpinnerData, getSemesterSpinnerData } from '@/server/basic-module'
import { getExaminationArrangeListsHasArrangeInfo } from '@/server/examination-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import arrgentInfo from '../../../examinationSystem/examination-management/examination-arrangement-infomation' // 考试安排详细信息
import rateInfo from './examination-rate-infomation' // 考试-班级课程列表
export default {
  components: {pagination, arrgentInfo, rateInfo},
  data () {
    return {
      style: '',
      conditionForm: {},
      // -------------表格------------
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      // -------------检索------------
      AcademicYearData: [],
      SemesterList: [],
      // -------------编辑------------
      editForm: {},
      addEditVisible: false,
      paperForm: {},
      paperVisible: false,
      // -------------考试安排信息------------
      arrangeInfoVisible: false,
      // -------------班级课程------------
      rateListVisible: false
    }
  },
  watch: {
    'conditionForm.AcademicYearId' (newVal) {
      if (newVal) {
        this.$set(this.conditionForm, 'SemesterId', '')
        this._getSemesterSpinnerData() // 根据学年获取下属学期
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getAcademicYearSpinnerData()
    this.initialData()
  },
  methods: {
    _getAcademicYearSpinnerData () { // 获取学年下拉框数据
      this.AcademicYearData = []
      getAcademicYearSpinnerData().then(result => {
        this.AcademicYearData = result
      })
    },
    _getSemesterSpinnerData () { // 根据学年获取下属学期
      this.SemesterList = []
      getSemesterSpinnerData(this.conditionForm.AcademicYearId).then(result => {
        this.SemesterList = result
      })
    },
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
    // 获取试题列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ExamName: this.conditionForm.ExamName,
        ExaminationType: 'Official'
      }
      if (this.conditionForm.AcademicYearId) {
        this.$set(data, 'AcademicYearId', this.conditionForm.AcademicYearId)
      }
      if (this.conditionForm.SemesterId) {
        this.$set(data, 'SemesterId', this.conditionForm.SemesterId)
      }
      getExaminationArrangeListsHasArrangeInfo(data).then(result => {
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
    /* ------------------------------------ 操作按钮 -------------------------- */
    exportFile () {
      // sds
    },
    // 查看考场安排详细信息
    toInfomationPage (row) {
      this.editForm = row
      this.arrangeInfoVisible = true
    },
    viewPassRate (row) {
      this.editForm = row
      this.rateListVisible = true
    }
  }
}
</script>
