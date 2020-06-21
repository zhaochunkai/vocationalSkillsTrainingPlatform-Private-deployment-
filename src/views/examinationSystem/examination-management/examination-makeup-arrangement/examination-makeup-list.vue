
<template>
<div>
  <!-- 补考安排 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>补考安排</span><el-tag style="margin-left:1rem;font-size:12px;">补考安排流程：【新增】(考试信息，抽卷，安排考场等)-->【查看考场分布】（生成考务信息）-->启用（通知学生）</el-tag>
    </div>
    <!-- 查询 -->
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="考试名称">
        <el-input class="input-append" v-model="conditionForm.ExamName" placeholder="请输入试卷名称"></el-input>	
      </el-form-item>
      <el-form-item label="学年" prop="AcademicYear">
        <el-select v-model="conditionForm.AcademicYearId" filterable clearable placeholder="请选择学年">
          <el-option v-for="(item,i) of AcademicYearData" :key="i" :label="item.academicYearName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学期" prop="SemesterId" v-if="conditionForm.AcademicYearId">
        <el-select v-model="conditionForm.courseId" filterable clearable>
          <el-option v-for="(item,i) of SemesterList" :key="i" :label="item.semesterName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
      <el-button type="primary" size="mini" @click="edit()">新增</el-button>
      <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button>
      <el-button type="primary" size="mini" @click="Enable()">启用</el-button>
      <el-button type="primary" size="mini" @click="Enable()">停用</el-button> -->
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="examName" label="考试名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.examName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="methodOfExaminationName" label="考试方式" width="100" align="center"></el-table-column>
      <el-table-column label="学年学期" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.academicYearSemesterName}}
        </template>
      </el-table-column>
      <el-table-column prop="sponsorUnitName" label="考试主管单位" width="200" align="center"></el-table-column>
      <el-table-column prop="examinationStatusName" label="状态" width="100" align="center"></el-table-column>
      <el-table-column  fixed="right" label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-show="!scope.row.flagExamInformation" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" size="small" v-show="!scope.row.flagExamInformation" @click="del(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="Enable(scope.row)">{{scope.row.examinationStatusName=='启用'?'停用': '启用'}}</el-button>
          <el-button type="success" size="mini" v-if="!scope.row.flagExamInformation" @click="createDistribution(scope.row)">生成考务信息</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.flagExamInformation" @click="viewDistribution(scope.row)">查看考务信息</el-button>
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
    <!-- 补考安排新增/编辑 -->
    <add-edit :dataForm="editForm" :visible.sync="addEditVisible" @queryList="queryList"></add-edit>
    <!-- 查看考务信息 -->
    <student-arrgent-info :dataForm="infoFrom" :visible.sync="infoVisible"></student-arrgent-info>
    <!-- 具体考试安排信息 -->
    <arrgent-info :dataForm="editForm" :visible.sync="arrangeInfoVisible"></arrgent-info>
  </el-card>
</div>
</template>
<script>
import { getAcademicYearSpinnerData, getSemesterSpinnerData } from '@/server/basic-module'
import { getSupplementaryArrange, deleteSupplementaryArrangeById, updateSupplementaryArrangeStatus, generateExamSupplementaryInformation } from '@/server/examination-module'
import orgTree from '@/components/orgTree.vue'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import addEdit from './examination-makeup-edit'
import studentArrgentInfo from '../examination-student-arrangement' // 考务信息：每个学生的考试安排
import arrgentInfo from './examination-arrangement-infomation' // 考试安排详细信息
export default {
  components: {orgTree, pagination, addEdit, studentArrgentInfo, arrgentInfo},
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
      // -------------查看考务信息------------
      infoFrom: {},
      infoVisible: false,
      // -------------安排信息------------
      // arrangeInfoFrom: {},
      arrangeInfoVisible: false
    }
  },
  watch: {
    'conditionForm.AcademicYearId' (newVal) {
      if (newVal) {
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
    // -----------------------------------------查询-----------------------------------
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
        AcademicYear: this.conditionForm.AcademicYearId,
        SemesterId: this.conditionForm.SemesterId
      }
      getSupplementaryArrange(data).then(result => {
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
    /* ------------------------------------ 操作按钮 -------------------------- */
    // 生成考务信息
    createDistribution (row) {
      let data = {
        ExamSupplementaryArrangeId: row.id
      }
      generateExamSupplementaryInformation(data).then(res => {
        this.queryList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 查看考务信息
    viewDistribution (row) {
      this.infoFrom = {
        ExaminationArrangeId: row.id,
        FlagSupplementaryExam: true
      }
      this.infoVisible = true
    },
    // 查看考试安排详情
    toInfomationPage (row) {
      this.editForm = row
      this.arrangeInfoVisible = true
    },
    edit (row) {
      let data = row || {}
      this.editForm = data
      this.addEditVisible = true
    },
    del (row) {
      this.$confirm(`此操作将删除选中的补考安排 【${row.examName}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        deleteSupplementaryArrangeById(row.id).then(() => {
          this.$message.success('补考安排删除成功！')
          this.$refs.pagination.currentPage = 1
          this.initialData()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      })
    },
    Enable (row) {
      this.$confirm(`此操作将 ${row.examinationStatusName === '启用' ? '停用' : '启用'} 选中的补考安排 【${row.examName}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        let flagEnable = true
        if (row.examinationStatusName === '启用') {
          flagEnable = false
        }
        updateSupplementaryArrangeStatus(row.id, flagEnable).then(() => {
          this.$message.success('状态更新成功！')
          this.queryList()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      })
    }
  }
}
</script>
