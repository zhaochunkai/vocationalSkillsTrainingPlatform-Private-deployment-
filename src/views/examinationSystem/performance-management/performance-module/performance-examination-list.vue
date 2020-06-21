
<template>
<div>
  <!-- 成绩管理 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>成绩管理</span>
      <el-tag style="margin-left:10px;" size="mini">正式考试中可录入学员成绩，模拟考试中可查看学员正确率</el-tag>
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
        <el-select v-model="conditionForm.courseId" filterable clearable>
          <el-option v-for="(item,i) of SemesterList" :key="i" :label="item.semesterName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试方式">
        <el-select v-model="conditionForm.methodOfExamination" clearable>
          <el-option v-for="(item,i) of methodOfExaminationList" :key="i" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试类别">
        <el-select v-model="conditionForm.ExaminationType" clearable>
          <el-option v-for="(item,i) of examinationTypeList" :key="i" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否补考">
        <el-select v-model="conditionForm.ExaminationType" clearable>
          <el-option v-for="(item,i) of ExaminationType" :key="i" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>           
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
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
      <el-table-column prop="examinationStatusName" label="考试状态" width="80" align="center"></el-table-column>
      <el-table-column prop="flagExaminationInformation" label="考务信息" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.flagExaminationInformation?'已生成': '未生成'}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.flagExaminationInformation && (scope.row.examinationStatus=='Enable' || scope.row.examinationStatus=='AlreadyOver')" >
            <el-button type="primary" size="mini" @click="viewPerformance(scope.row)">
              {{scope.row.examinationType=='Official'?'管理成绩': '查看正确率'}}
            </el-button>
            <!-- <el-button type="primary" size="mini" @click="exportFile(scope.row)">导出成绩</el-button>             -->
          </span>
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
    <course-list :dataForm="editForm" :visible.sync="courseListVisible"></course-list>
  </el-card>
</div>
</template>
<script>
import { getAcademicYearSpinnerData,getSemesterSpinnerData } from '@/server/basic-module';
import { getExaminationArrange } from '@/server/examination-module';
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import arrgentInfo from '../../examination-management/examination-arrangement-infomation' // 考试安排详细信息
import courseList from './performance-examination-course-list' // 考试安排详细信息
export default {
  components: {pagination, arrgentInfo, courseList},
  data() {
    return {
      style: '',
      conditionForm: {},
      // -------------表格------------
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
      tableData: [
        {id:1,}
      ],
      isSelectAll:false,
      multipleSelection: [],
      // -------------检索------------ 
      AcademicYearData: [],
      SemesterList: [],
      examinationTypeList: [
        {name: '全部',type: 'All'},
        {name: '模拟考试',type: 'Simulation'},
        {name: '正式考试',type: 'Official'}
      ],
      methodOfExaminationList: [
        {name: '全部',type: 'All'},
        {name: '在线考试',type: 'Online'},
        {name: '离线考试',type: 'Offline'}
      ],
      // -------------考试安排信息------------
      editForm: {},
      arrangeInfoVisible:false,
      // -------------班级课程------------
      courseListVisible:false,
    }
  },
  watch: {
    'conditionForm.AcademicYearId'(newVal) {
      if (newVal) {
        this._getSemesterSpinnerData(); // 根据学年获取下属学期
      }
    }
  },
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getAcademicYearSpinnerData();
    this.initialData();
  },
  methods: {
    // -----------------------------------------查询-----------------------------------     
    _getAcademicYearSpinnerData() { // 获取学年下拉框数据
      this.AcademicYearData= []
			getAcademicYearSpinnerData().then(result => {
        this.AcademicYearData=result;
			})
    }, 
    _getSemesterSpinnerData() { // 根据学年获取下属学期
      this.SemesterList= []
      getSemesterSpinnerData(this.conditionForm.AcademicYearId).then(result => {
        this.SemesterList=result;
      })
    }, 
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    queryList() {  
      this.initialData(this.SkipCount, this.pageSize);
    },
    // 获取试题列表
    initialData(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ExamName: this.conditionForm.ExamName,
        AcademicYear: this.conditionForm.AcademicYear,
        SemesterId: this.conditionForm.SemesterId,
      }
      if (this.conditionForm.methodOfExamination) {
        this.$set(data,'methodOfExamination',this.conditionForm.methodOfExamination)
      }
      if (this.conditionForm.ExaminationType) {
        this.$set(data,'ExaminationType',this.conditionForm.ExaminationType)
      }
      getExaminationArrange(data).then(result => {
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
    exportFile() { // 导出
      
    },
    toInfomationPage(row) {  // 查看考场安排详细信息
      this.editForm=row;
      this.arrangeInfoVisible=true;
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect=node;
      this.nodeId = node.id
      this.nodeName=node.label;        
      this.nodeLevel = node.level 
      if (node.level=='课程') {
        this.initialData();
      }
    },    
    viewPerformance(row) {
      let data={
        examinationType:row.examinationType, 
        examinationArrangeId:row.id
      }
      this.editForm = data
      this.courseListVisible = true
    },
  }
}
</script>